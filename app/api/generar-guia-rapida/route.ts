import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { SYSTEM_PROMPT_PROFESIONALES } from '@/lib/prompts';
import { checkPlanLimits } from '@/lib/plan';
import { createClient } from '@/lib/supabase/server';
import { streamGuiaYResponder } from '@/lib/generar-guia-stream';
import { checkRateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';
export const maxDuration = 60;

const rapidaSchema = z.object({
  pregunta: z.string().trim().min(10).max(1500),
});

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const rl = await checkRateLimit(`user:${user.id}`);
  if (!rl.success)
    return NextResponse.json({ error: 'Demasiadas guías en poco tiempo.' }, { status: 429 });

  const plan = await checkPlanLimits();
  if (!plan.permitido)
    return NextResponse.json(
      { error: 'Alcanzaste tu límite de guías mensuales.', plan },
      { status: 402 }
    );

  const payload = await request.json().catch(() => null);
  const parsed = rapidaSchema.safeParse(payload);
  if (!parsed.success)
    return NextResponse.json(
      {
        error: 'Pregunta inválida',
        issues: parsed.error.issues.map((i) => ({ path: i.path.join('.'), message: i.message })),
      },
      { status: 400 }
    );

  const pregunta = parsed.data.pregunta;
  const prompt = `Consulta rápida de un/a profesional de salud. Necesito una respuesta CONCISA y PRÁCTICA (máx 6 puntos clave, sin secciones largas):

PREGUNTA:
${pregunta}

Respondé en <400 palabras. Priorizá lo accionable AHORA. Si la situación requiere urgencia, decilo al inicio.`;

  return streamGuiaYResponder({
    supabase,
    userId: user.id,
    modulo: 'profesionales',
    systemPrompt: SYSTEM_PROMPT_PROFESIONALES,
    userPrompt: prompt,
    discapacidades: [],
    datosModulo: { modo: 'rapida', pregunta },
    contenidoResumen: `[Rápida] ${pregunta.slice(0, 200)}`,
  });
}

import { NextResponse, type NextRequest } from 'next/server';
import { SYSTEM_PROMPT, buildPrompt } from '@/lib/prompts';
import { formularioConsultaSchema } from '@/lib/validators';
import { checkPlanLimits } from '@/lib/plan';
import { createClient } from '@/lib/supabase/server';
import { streamGuiaYResponder } from '@/lib/generar-guia-stream';
import { checkRateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const rl = await checkRateLimit(`user:${user.id}`);
  if (!rl.success) {
    return NextResponse.json(
      { error: 'Demasiadas guías en poco tiempo. Esperá un minuto.' },
      { status: 429, headers: { 'Retry-After': '60' } }
    );
  }

  const plan = await checkPlanLimits();
  if (!plan.permitido) {
    return NextResponse.json(
      {
        error: plan.planVencido
          ? 'Tu plan Pro venció. Renovalo para seguir generando guías.'
          : 'Alcanzaste tu límite mensual de guías.',
        plan,
      },
      { status: 402 }
    );
  }

  const payload = await request.json().catch(() => null);
  const parsed = formularioConsultaSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: 'Formulario inválido',
        issues: parsed.error.issues.map((i) => ({
          path: i.path.join('.'),
          message: i.message,
        })),
      },
      { status: 400 }
    );
  }

  const form = parsed.data;

  return streamGuiaYResponder({
    supabase,
    userId: user.id,
    modulo: 'docentes',
    systemPrompt: SYSTEM_PROMPT,
    userPrompt: buildPrompt(form),
    discapacidades: form.discapacidades,
    datosModulo: form,
    contenidoResumen: form.contenido,
    legacy: {
      nivel: form.nivel_id,
      subnivel: form.subnivel_id ?? null,
      anio_grado: form.anio_grado,
      materia: form.materia,
      contenido: form.contenido,
      cantidad_alumnos: form.cantidad_alumnos,
      situacion_apoyo: form.situacion_apoyo,
      contexto_aula: form.contexto_aula ?? null,
      objetivo_clase: form.objetivo_clase ?? null,
    },
  });
}

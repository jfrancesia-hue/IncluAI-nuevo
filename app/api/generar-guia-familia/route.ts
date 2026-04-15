import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { SYSTEM_PROMPT_FAMILIAS, buildPromptFamilias } from '@/lib/prompts';
import { formularioFamiliaSchema } from '@/lib/validators';
import { streamGuiaYResponder } from '@/lib/generar-guia-stream';
import { guardApi } from '@/lib/api-guard';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  const guard = await guardApi();
  if (!guard.ok) return guard.response;

  const payload = await request.json().catch(() => null);
  const parsed = formularioFamiliaSchema.safeParse(payload);
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
    supabase: guard.supabase,
    userId: guard.user.id,
    modulo: 'familias',
    systemPrompt: SYSTEM_PROMPT_FAMILIAS,
    userPrompt: buildPromptFamilias(form),
    discapacidades: form.discapacidades,
    datosModulo: form,
    contenidoResumen: form.situacion_especifica.slice(0, 300),
  });
}

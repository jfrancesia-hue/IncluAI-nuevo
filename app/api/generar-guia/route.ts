import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { SYSTEM_PROMPT, buildPrompt } from '@/lib/prompts';
import { formularioConsultaSchema } from '@/lib/validators';
import { streamGuiaYResponder } from '@/lib/generar-guia-stream';
import { guardApi } from '@/lib/api-guard';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  const guard = await guardApi();
  if (!guard.ok) return guard.response;

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
    supabase: guard.supabase,
    userId: guard.user.id,
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

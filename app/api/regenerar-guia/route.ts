import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { anthropic, CLAUDE_MODEL } from '@/lib/anthropic';
import { guardApi } from '@/lib/api-guard';
import { isGuiaIncompleta } from '@/lib/guide-status';
import { enrichGuideToStructured } from '@/lib/structure-guide';
import {
  SYSTEM_PROMPT,
  SYSTEM_PROMPT_FAMILIAS,
  SYSTEM_PROMPT_PROFESIONALES,
  buildPrompt,
  buildPromptFamilias,
  buildPromptProfesionales,
} from '@/lib/prompts';
import {
  formularioConsultaSchema,
  formularioFamiliaSchema,
  formularioProfesionalSchema,
} from '@/lib/validators';
import type { ModuloIncluIA } from '@/lib/types';

export const runtime = 'nodejs';
export const maxDuration = 60;

const STRUCTURED_GUIDE_ENABLED =
  process.env.INCLUA_DISABLE_STRUCTURED_GUIDE !== 'true';

const bodySchema = z.object({
  consulta_id: z.string().uuid(),
});

type ConsultaRow = {
  id: string;
  modulo: ModuloIncluIA;
  datos_modulo: Record<string, unknown> | null;
  discapacidades: string[] | null;
  materia: string | null;
  contenido: string;
  nivel: string | null;
  anio_grado: string | null;
  situacion_apoyo: string | null;
  respuesta_ia: string | null;
};

// No reserva cupo: la consulta ya existe y el cupo se consumió en el intento
// original. Si esa guía quedó incompleta (stream cortado, crash del server)
// el usuario puede regenerarla sobre la misma fila sin castigo adicional.
export async function POST(request: NextRequest) {
  // checkPlan:false — no descontamos cuota, solo regeneramos lo ya pagado.
  const guard = await guardApi({ checkPlan: false });
  if (!guard.ok) return guard.response;
  const { user, supabase } = guard;

  const payload = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Payload inválido' }, { status: 400 });
  }

  const { data: consulta } = await supabase
    .from('consultas')
    .select(
      'id, modulo, datos_modulo, discapacidades, materia, contenido, nivel, anio_grado, situacion_apoyo, respuesta_ia'
    )
    .eq('id', parsed.data.consulta_id)
    .eq('user_id', user.id)
    .single<ConsultaRow>();

  if (!consulta) {
    return NextResponse.json({ error: 'Consulta no encontrada' }, { status: 404 });
  }

  if (!isGuiaIncompleta(consulta)) {
    return NextResponse.json(
      {
        error:
          'Esta guía ya está completa. Usá “Refinar” o generá una nueva consulta.',
      },
      { status: 409 }
    );
  }

  const promptInputs = buildPromptsForConsulta(consulta);
  if (!promptInputs) {
    return NextResponse.json(
      { error: 'No se pudo reconstruir el formulario original para regenerar.' },
      { status: 422 }
    );
  }
  const { systemPrompt, userPrompt } = promptInputs;

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: string, data: unknown) =>
        controller.enqueue(
          encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
        );

      let textoNuevo = '';

      try {
        const claude = anthropic.messages.stream({
          model: CLAUDE_MODEL,
          max_tokens: 4000,
          system: [
            {
              type: 'text',
              text: systemPrompt,
              cache_control: { type: 'ephemeral' },
            },
          ],
          messages: [{ role: 'user', content: userPrompt }],
        });

        claude.on('text', (d) => {
          textoNuevo += d;
          send('delta', { text: d });
        });

        const finalMessage = await claude.finalMessage();
        const tokens =
          finalMessage.usage.input_tokens + finalMessage.usage.output_tokens;

        let datosModuloFinal: Record<string, unknown> = {
          ...(consulta.datos_modulo ?? {}),
          regenerada_at: new Date().toISOString(),
        };
        // Si la guía original tenía structured previo, lo reemplazamos;
        // si no, se agrega ahora.
        delete (datosModuloFinal as Record<string, unknown>).structured;

        if (STRUCTURED_GUIDE_ENABLED) {
          try {
            const structured = await enrichGuideToStructured({
              markdown: textoNuevo,
              modulo: consulta.modulo,
              context: {
                contenido: consulta.contenido,
                materia: consulta.materia,
                nivel: consulta.nivel,
                anio_grado: consulta.anio_grado,
                discapacidades: consulta.discapacidades ?? [],
                situacion_apoyo: consulta.situacion_apoyo,
              },
            });
            if (structured) {
              datosModuloFinal = { ...datosModuloFinal, structured };
            }
          } catch (enrichErr) {
            console.error('[regenerar-guia enrich]', enrichErr);
          }
        }

        const { error: updateError } = await supabase
          .from('consultas')
          .update({
            datos_modulo: datosModuloFinal,
            respuesta_ia: textoNuevo,
            tokens_usados: tokens,
          })
          .eq('id', consulta.id)
          .eq('user_id', user.id);

        if (updateError) {
          send('error', {
            message: 'La guía se regeneró pero no se pudo guardar.',
            detail: updateError.message,
          });
        } else {
          send('done', { consulta_id: consulta.id, tokens });
        }
      } catch (err) {
        send('error', {
          message: err instanceof Error ? err.message : 'Error desconocido',
        });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
    },
  });
}

function buildPromptsForConsulta(
  consulta: ConsultaRow
): { systemPrompt: string; userPrompt: string } | null {
  const datos = consulta.datos_modulo ?? {};

  if (consulta.modulo === 'docentes') {
    const ok = formularioConsultaSchema.safeParse(datos);
    if (!ok.success) return null;
    return {
      systemPrompt: SYSTEM_PROMPT,
      userPrompt: buildPrompt(ok.data),
    };
  }
  if (consulta.modulo === 'familias') {
    const ok = formularioFamiliaSchema.safeParse(datos);
    if (!ok.success) return null;
    return {
      systemPrompt: SYSTEM_PROMPT_FAMILIAS,
      userPrompt: buildPromptFamilias(ok.data),
    };
  }
  if (consulta.modulo === 'profesionales') {
    const ok = formularioProfesionalSchema.safeParse(datos);
    if (!ok.success) return null;
    return {
      systemPrompt: SYSTEM_PROMPT_PROFESIONALES,
      userPrompt: buildPromptProfesionales(ok.data),
    };
  }
  return null;
}

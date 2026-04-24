import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { anthropic, getModelForPlan } from '@/lib/anthropic';
import { guardApi } from '@/lib/api-guard';
import { LIMITES_PLAN, type ModuloIncluIA } from '@/lib/types';
import { enrichGuideToStructured } from '@/lib/structure-guide';

export const runtime = 'nodejs';
export const maxDuration = 60;

const STRUCTURED_GUIDE_ENABLED =
  process.env.INCLUA_DISABLE_STRUCTURED_GUIDE !== 'true';

const schema = z.object({
  consulta_id: z.string().uuid(),
  instruccion: z.enum(['mas_corto', 'mas_simple', 'mas_ejemplos', 'mas_tecnico']),
});

const INSTRUCCIONES_MAP: Record<z.infer<typeof schema>['instruccion'], string> = {
  mas_corto:
    'Reescribí la guía más corta: reducila a la mitad conservando los puntos esenciales. Menos secciones, listas más compactas.',
  mas_simple:
    'Reescribí la guía en lenguaje más simple: palabras más comunes, frases más cortas, sin tecnicismos. Pensá en explicar a alguien que nunca oyó hablar del tema.',
  mas_ejemplos:
    'Reescribí la guía agregando más ejemplos concretos: para CADA estrategia, al menos 2 ejemplos paso a paso con materiales reales.',
  mas_tecnico:
    'Reescribí la guía con enfoque más técnico: citá normativa específica, nombres de protocolos y marcos teóricos (DUA, TEACCH, CIF, etc.), con lenguaje profesional.',
};

type ConsultaOriginal = {
  id: string;
  respuesta_ia: string | null;
  modulo: ModuloIncluIA;
  datos_modulo: Record<string, unknown> | null;
  discapacidades: string[] | null;
  materia: string | null;
  contenido: string;
  nivel: string | null;
  anio_grado: string | null;
  situacion_apoyo: string | null;
};

export async function POST(request: NextRequest) {
  const guard = await guardApi();
  if (!guard.ok) return guard.response;
  const { user, supabase, plan } = guard;

  const payload = await request.json().catch(() => null);
  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Payload inválido' }, { status: 400 });
  }

  const { data: consulta } = await supabase
    .from('consultas')
    .select(
      'id, respuesta_ia, modulo, datos_modulo, discapacidades, materia, contenido, nivel, anio_grado, situacion_apoyo'
    )
    .eq('id', parsed.data.consulta_id)
    .eq('user_id', user.id)
    .single<ConsultaOriginal>();

  if (!consulta || !consulta.respuesta_ia) {
    return NextResponse.json({ error: 'Guía no encontrada' }, { status: 404 });
  }

  const instruccion = INSTRUCCIONES_MAP[parsed.data.instruccion];

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: string, data: unknown) =>
        controller.enqueue(
          encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
        );

      let reservado = false;
      let textoNuevo = '';

      try {
        // Reserva atómica de cupo ANTES de gastar tokens — mismo patrón
        // que en generar-guia-stream. Evita que un refinar se pase del límite.
        const limite = LIMITES_PLAN[plan.plan].guias_mes;
        const reserva = await supabase.rpc('reservar_consulta', {
          p_user_id: user.id,
          p_limite: limite,
        });
        if (reserva.error) {
          send('error', {
            message:
              reserva.error.code === 'P0001'
                ? 'Alcanzaste el límite de guías de este mes.'
                : 'No se pudo reservar cupo de consulta.',
            detail: reserva.error.message,
          });
          controller.close();
          return;
        }
        reservado = true;

        const claude = anthropic.messages.stream({
          model: getModelForPlan(plan.plan),
          max_tokens: 4000,
          system:
            'Sos un editor pedagógico que reescribe guías inclusivas según la instrucción dada. Mantenés el español rioplatense argentino, el tono y la estructura de secciones con ##.',
          messages: [
            {
              role: 'user',
              content: `Acá está la guía original:\n\n${consulta.respuesta_ia}\n\n---\n\nINSTRUCCIÓN: ${instruccion}\n\nReescribila completa.`,
            },
          ],
        });

        claude.on('text', (d) => {
          textoNuevo += d;
          send('delta', { text: d });
        });

        const finalMessage = await claude.finalMessage();
        const tokens =
          finalMessage.usage.input_tokens + finalMessage.usage.output_tokens;

        // Enrichment estructurado — mismo flujo que generar-guia-stream.
        // Preserva la metadata del módulo original en datos_modulo.
        const baseModulo: Record<string, unknown> = {
          ...(consulta.datos_modulo ?? {}),
          refinado_de: consulta.id,
          instruccion: parsed.data.instruccion,
        };

        let datosModuloFinal = baseModulo;
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
              datosModuloFinal = { ...baseModulo, structured };
            }
          } catch (enrichErr) {
            console.error('[refinar-guia enrich]', enrichErr);
          }
        }

        const { data: saved, error: saveError } = await supabase
          .from('consultas')
          .insert({
            user_id: user.id,
            modulo: consulta.modulo,
            datos_modulo: datosModuloFinal,
            // Preservamos metadata relevante del módulo original
            discapacidades: consulta.discapacidades ?? [],
            materia: consulta.materia,
            nivel: consulta.nivel,
            anio_grado: consulta.anio_grado,
            situacion_apoyo: consulta.situacion_apoyo,
            contenido: `[Refinado] ${consulta.contenido}`,
            respuesta_ia: textoNuevo,
            tokens_usados: tokens,
            cantidad_alumnos: 1,
          })
          .select('id')
          .single<{ id: string }>();

        if (saveError || !saved) {
          send('error', {
            message: 'La guía se generó pero no se pudo guardar.',
            detail: saveError?.message,
          });
        } else {
          send('done', { consulta_id: saved.id, tokens });
          reservado = false; // cupo consumido legítimamente
        }
      } catch (err) {
        send('error', {
          message: err instanceof Error ? err.message : 'Error desconocido',
        });
      } finally {
        // Compensación: si reservamos cupo pero el stream falló antes de guardar,
        // devolvemos el cupo al usuario.
        if (reservado) {
          try {
            const dec = await supabase.rpc('decrementar_consultas', {
              p_user_id: user.id,
            });
            if (dec.error) console.error('[decrementar_consultas]', dec.error.message);
          } catch (err) {
            console.error('[decrementar_consultas]', err);
          }
        }
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

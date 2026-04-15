import 'server-only';
import type { SupabaseClient } from '@supabase/supabase-js';
import { anthropic, CLAUDE_MODEL } from '@/lib/anthropic';
import type { ModuloIncluIA } from '@/lib/types';

type InsertConsultaInput = {
  supabase: SupabaseClient;
  userId: string;
  modulo: ModuloIncluIA;
  systemPrompt: string;
  userPrompt: string;
  discapacidades: string[];
  datosModulo: Record<string, unknown>;
  // Sólo para docentes (el módulo original); el resto usa datos_modulo.
  legacy?: {
    nivel?: string | null;
    subnivel?: string | null;
    anio_grado?: string | null;
    materia?: string | null;
    contenido: string;
    cantidad_alumnos?: number;
    situacion_apoyo?: string | null;
    contexto_aula?: string | null;
    objetivo_clase?: string | null;
  };
  // Resumen de la consulta para fallback de `contenido` cuando no es docente.
  contenidoResumen: string;
};

// Envía el stream de Claude como SSE y persiste la consulta al cerrar.
export function streamGuiaYResponder(input: InsertConsultaInput): Response {
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: string, data: unknown) => {
        controller.enqueue(
          encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
        );
      };

      let textoCompleto = '';

      try {
        const claudeStream = anthropic.messages.stream({
          model: CLAUDE_MODEL,
          max_tokens: 4000,
          system: input.systemPrompt,
          messages: [{ role: 'user', content: input.userPrompt }],
        });

        claudeStream.on('text', (delta) => {
          textoCompleto += delta;
          send('delta', { text: delta });
        });

        const finalMessage = await claudeStream.finalMessage();
        const tokens =
          finalMessage.usage.input_tokens + finalMessage.usage.output_tokens;

        const insertRow: Record<string, unknown> = {
          user_id: input.userId,
          modulo: input.modulo,
          datos_modulo: input.datosModulo,
          discapacidades: input.discapacidades,
          contenido: input.contenidoResumen,
          respuesta_ia: textoCompleto,
          tokens_usados: tokens,
        };

        if (input.legacy) {
          Object.assign(insertRow, {
            nivel: input.legacy.nivel ?? null,
            subnivel: input.legacy.subnivel ?? null,
            anio_grado: input.legacy.anio_grado ?? null,
            materia: input.legacy.materia ?? null,
            contenido: input.legacy.contenido,
            cantidad_alumnos: input.legacy.cantidad_alumnos ?? 1,
            situacion_apoyo: input.legacy.situacion_apoyo ?? null,
            contexto_aula: input.legacy.contexto_aula ?? null,
            objetivo_clase: input.legacy.objetivo_clase ?? null,
          });
        } else {
          // Los módulos nuevos no llenan estas columnas; pero `situacion_apoyo`
          // tenía NOT NULL; la migración la relaja. Seteamos defaults por si no.
          insertRow.cantidad_alumnos = 1;
        }

        const { data: saved, error: saveError } = await input.supabase
          .from('consultas')
          .insert(insertRow)
          .select('id')
          .single<{ id: string }>();

        if (saveError || !saved) {
          send('error', {
            message: 'La guía se generó pero no se pudo guardar.',
            detail: saveError?.message,
          });
        } else {
          await input.supabase.rpc('incrementar_consultas', {
            p_user_id: input.userId,
          });
          send('done', { consulta_id: saved.id, tokens });
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
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}

import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { anthropic, CLAUDE_MODEL } from '@/lib/anthropic';
import { guardApi } from '@/lib/api-guard';

export const runtime = 'nodejs';
export const maxDuration = 60;

const schema = z.object({
  consulta_id: z.string().uuid(),
  instruccion: z.enum(['mas_corto', 'mas_simple', 'mas_ejemplos', 'mas_tecnico']),
});

const INSTRUCCIONES_MAP: Record<z.infer<typeof schema>['instruccion'], string> = {
  mas_corto: 'Reescribí la guía más corta: reducila a la mitad conservando los puntos esenciales. Menos secciones, listas más compactas.',
  mas_simple: 'Reescribí la guía en lenguaje más simple: palabras más comunes, frases más cortas, sin tecnicismos. Pensá en explicar a alguien que nunca oyó hablar del tema.',
  mas_ejemplos: 'Reescribí la guía agregando más ejemplos concretos: para CADA estrategia, al menos 2 ejemplos paso a paso con materiales reales.',
  mas_tecnico: 'Reescribí la guía con enfoque más técnico: citá normativa específica, nombres de protocolos y marcos teóricos (DUA, TEACCH, CIF, etc.), con lenguaje profesional.',
};

export async function POST(request: NextRequest) {
  const guard = await guardApi();
  if (!guard.ok) return guard.response;
  const { user, supabase } = guard;

  const payload = await request.json().catch(() => null);
  const parsed = schema.safeParse(payload);
  if (!parsed.success) return NextResponse.json({ error: 'Payload inválido' }, { status: 400 });

  const { data: consulta } = await supabase
    .from('consultas')
    .select('id, respuesta_ia, modulo')
    .eq('id', parsed.data.consulta_id)
    .eq('user_id', user.id)
    .single<{ id: string; respuesta_ia: string | null; modulo: string }>();

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

      let textoNuevo = '';
      try {
        const claude = anthropic.messages.stream({
          model: CLAUDE_MODEL,
          max_tokens: 4000,
          system: 'Sos un editor pedagógico que reescribe guías inclusivas según la instrucción dada. Mantenés el español rioplatense argentino, el tono y la estructura de secciones con ##.',
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

        await claude.finalMessage();

        // Guardamos como nueva consulta para que quede en el historial.
        const { data: saved } = await supabase
          .from('consultas')
          .insert({
            user_id: user.id,
            modulo: consulta.modulo,
            datos_modulo: { refinado_de: consulta.id, instruccion: parsed.data.instruccion },
            discapacidades: [],
            contenido: `[Refinado] ${parsed.data.instruccion}`,
            respuesta_ia: textoNuevo,
            cantidad_alumnos: 1,
          })
          .select('id')
          .single<{ id: string }>();

        if (saved) {
          await supabase.rpc('incrementar_consultas', { p_user_id: user.id });
          send('done', { consulta_id: saved.id });
        } else {
          send('error', { message: 'No se pudo guardar' });
        }
      } catch (err) {
        send('error', { message: err instanceof Error ? err.message : 'Error' });
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

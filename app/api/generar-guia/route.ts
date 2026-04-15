import { NextResponse, type NextRequest } from 'next/server';
import { anthropic, CLAUDE_MODEL } from '@/lib/anthropic';
import { SYSTEM_PROMPT, buildPrompt } from '@/lib/prompts';
import { formularioConsultaSchema } from '@/lib/validators';
import { checkPlanLimits } from '@/lib/plan';
import { createClient } from '@/lib/supabase/server';

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
  const userPrompt = buildPrompt(form);

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: string, data: unknown) => {
        controller.enqueue(
          encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
        );
      };

      let textoCompleto = '';
      let tokensOut = 0;

      try {
        const claudeStream = anthropic.messages.stream({
          model: CLAUDE_MODEL,
          max_tokens: 4000,
          system: SYSTEM_PROMPT,
          messages: [{ role: 'user', content: userPrompt }],
        });

        claudeStream.on('text', (delta) => {
          textoCompleto += delta;
          send('delta', { text: delta });
        });

        const finalMessage = await claudeStream.finalMessage();
        tokensOut = finalMessage.usage.output_tokens;
        const tokensIn = finalMessage.usage.input_tokens;

        const { data: saved, error: saveError } = await supabase
          .from('consultas')
          .insert({
            user_id: user.id,
            nivel: form.nivel_id,
            subnivel: form.subnivel_id ?? null,
            anio_grado: form.anio_grado,
            materia: form.materia,
            contenido: form.contenido,
            discapacidades: form.discapacidades,
            cantidad_alumnos: form.cantidad_alumnos,
            situacion_apoyo: form.situacion_apoyo,
            contexto_aula: form.contexto_aula ?? null,
            objetivo_clase: form.objetivo_clase ?? null,
            respuesta_ia: textoCompleto,
            tokens_usados: tokensIn + tokensOut,
          })
          .select('id')
          .single<{ id: string }>();

        if (saveError || !saved) {
          send('error', {
            message: 'La guía se generó pero no se pudo guardar.',
            detail: saveError?.message,
          });
        } else {
          await supabase.rpc('incrementar_consultas', { p_user_id: user.id });
          send('done', { consulta_id: saved.id, tokens: tokensIn + tokensOut });
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

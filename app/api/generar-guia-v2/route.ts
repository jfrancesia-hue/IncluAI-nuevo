import { NextResponse, type NextRequest } from 'next/server';
import { anthropic, CLAUDE_MODEL_V2 } from '@/lib/anthropic';
import { guardApi } from '@/lib/api-guard';
import { buildPromptDocentesV2 } from '@/lib/prompts';
import {
  GuiaPedagogicaSchema,
  type GuiaPedagogica,
} from '@/lib/schemas/guia-schema';
import { enriquecerImagen } from '@/lib/servicios/imagenes';
import { enriquecerVideo } from '@/lib/servicios/videos';
import { formularioConsultaSchema } from '@/lib/validators';
import { LIMITES_PLAN } from '@/lib/types';

export const runtime = 'nodejs';
export const maxDuration = 60;

// Endpoint v2.1: genera una guía pedagógica estructurada (JSON) con referencias
// a imágenes y videos, las enriquece con URLs reales de Unsplash/YouTube,
// y la guarda en respuesta_ia_estructurada.
//
// Coexiste con /api/generar-guia (v1 streaming markdown) — el frontend actual
// sigue consumiendo v1 hasta que se migre en la sesión de frontend.
export async function POST(request: NextRequest) {
  const guard = await guardApi();
  if (!guard.ok) return guard.response;
  const { user, supabase, plan } = guard;

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

  // 1. Reserva atómica de cupo antes de gastar tokens
  const limite = LIMITES_PLAN[plan.plan].guias_por_mes;
  const reserva = await supabase.rpc('reservar_consulta', {
    p_user_id: user.id,
    p_limite: limite,
  });
  if (reserva.error) {
    return NextResponse.json(
      {
        error:
          reserva.error.code === 'P0001'
            ? 'Alcanzaste el límite de guías de este mes.'
            : 'No se pudo reservar cupo de consulta.',
        detail: reserva.error.message,
      },
      { status: 402 }
    );
  }
  let cupoConsumido = true;

  try {
    // 2. Construir prompt v2 con reglas multimedia
    const prompt = buildPromptDocentesV2(form);

    // 3. Generar JSON con Claude (Opus 4.7 — más preciso para adherencia a schema)
    const response = await anthropic.messages.create({
      model: CLAUDE_MODEL_V2,
      max_tokens: 8000,
      messages: [{ role: 'user', content: prompt }],
    });

    const rawText =
      response.content[0]?.type === 'text' ? response.content[0].text : '';

    // 4. Extraer JSON — Claude a veces envuelve en ```json ... ```
    const jsonText = extraerJSON(rawText);
    if (!jsonText) {
      throw new Error('No se encontró JSON en la respuesta del modelo');
    }

    const parsedJson = JSON.parse(jsonText);

    // 5. Validar con Zod
    const guiaValidada = GuiaPedagogicaSchema.parse(parsedJson);

    // 6. Enriquecer multimedia en paralelo
    const guiaEnriquecida = await enriquecerGuia(guiaValidada);

    // 7. Persistir en Supabase
    const tokens =
      response.usage.input_tokens + response.usage.output_tokens;

    const { data: saved, error: saveError } = await supabase
      .from('consultas')
      .insert({
        user_id: user.id,
        modulo: 'docentes',
        datos_modulo: form,
        discapacidades: form.discapacidades,
        nivel: form.nivel_id,
        subnivel: form.subnivel_id ?? null,
        anio_grado: form.anio_grado,
        materia: form.materia,
        contenido: form.contenido,
        cantidad_alumnos: form.cantidad_alumnos,
        situacion_apoyo: form.situacion_apoyo,
        contexto_aula: form.contexto_aula ?? null,
        objetivo_clase: form.objetivo_clase ?? null,
        respuesta_ia: rawText, // retrocompat: mantenemos el raw para v1
        respuesta_ia_estructurada: guiaEnriquecida,
        version_schema: '2.1',
        tokens_usados: tokens,
      })
      .select('id')
      .single<{ id: string }>();

    if (saveError || !saved) {
      throw new Error(
        `La guía se generó pero no se pudo guardar: ${saveError?.message ?? 'error desconocido'}`
      );
    }

    cupoConsumido = false; // éxito: el cupo queda legítimamente usado
    return NextResponse.json({
      success: true,
      id: saved.id,
      guia: guiaEnriquecida,
      tokens,
    });
  } catch (err) {
    console.error('[generar-guia-v2] error:', err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : 'Error desconocido',
      },
      { status: 500 }
    );
  } finally {
    // Compensación: si algo falló antes del insert, devolvemos el cupo
    if (cupoConsumido) {
      try {
        await supabase.rpc('decrementar_consultas', { p_user_id: user.id });
      } catch (compErr) {
        console.error('[generar-guia-v2] decrementar fallido:', compErr);
      }
    }
  }
}

// Intenta extraer un objeto JSON del texto devuelto por Claude,
// tolerando bloques markdown ```json ... ```
function extraerJSON(text: string): string | null {
  const fenced = text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
  if (fenced?.[1]) return fenced[1];

  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    return text.slice(firstBrace, lastBrace + 1);
  }
  return null;
}

async function enriquecerGuia(
  guia: GuiaPedagogica
): Promise<GuiaPedagogica> {
  const [conceptosClave, estrategias, videos, materiales] = await Promise.all([
    Promise.all(
      guia.conceptosClave.map(async (c) => ({
        ...c,
        imagen: await enriquecerImagen(c.imagen),
      }))
    ),
    Promise.all(
      guia.estrategias.map(async (e) => ({
        ...e,
        imagenApoyo: e.imagenApoyo
          ? await enriquecerImagen(e.imagenApoyo)
          : undefined,
        videoApoyo: e.videoApoyo
          ? await enriquecerVideo(e.videoApoyo)
          : undefined,
      }))
    ),
    Promise.all(guia.videos.map((v) => enriquecerVideo(v))),
    Promise.all(
      guia.materiales.map(async (m) => ({
        ...m,
        imagenReferencia: m.imagenReferencia
          ? await enriquecerImagen(m.imagenReferencia)
          : undefined,
      }))
    ),
  ]);

  return {
    ...guia,
    conceptosClave,
    estrategias,
    videos,
    materiales,
  };
}

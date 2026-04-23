import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { anthropic, CLAUDE_MODEL_V2 } from '@/lib/anthropic';
import { guardApi } from '@/lib/api-guard';
import {
  buildPromptDocentesV2,
  buildPromptFamiliasV2,
  buildPromptProfesionalesV2,
} from '@/lib/prompts';
import {
  GuiaPedagogicaSchema,
  type GuiaPedagogica,
} from '@/lib/schemas/guia-schema';
import { enriquecerImagen } from '@/lib/servicios/imagenes';
import { enriquecerVideo } from '@/lib/servicios/videos';
import {
  formularioConsultaSchema,
  formularioFamiliaSchema,
  formularioProfesionalSchema,
} from '@/lib/validators';
import { LIMITES_PLAN, type ModuloIncluIA } from '@/lib/types';

export const runtime = 'nodejs';
export const maxDuration = 60;

// Endpoint v2.1: genera una guía estructurada (JSON enriquecido con multimedia)
// para los 3 módulos. El módulo se infiere del body:
//   - `{ modulo: 'docentes', ...form }` — forma explícita nueva
//   - Sin `modulo`: intenta detectar por schema (retrocompat con llamadas
//     que mandaban solo el form de docentes sin el campo)
export async function POST(request: NextRequest) {
  const guard = await guardApi();
  if (!guard.ok) return guard.response;
  const { user, supabase, plan } = guard;

  const rawBody = await request.json().catch(() => null);
  if (!rawBody || typeof rawBody !== 'object') {
    return NextResponse.json(
      { error: 'Payload JSON inválido' },
      { status: 400 }
    );
  }

  const detected = detectarModulo(rawBody);
  if (!detected) {
    return NextResponse.json(
      { error: 'Formulario inválido — no coincide con ningún módulo' },
      { status: 400 }
    );
  }
  const { modulo, form } = detected;

  // Reserva atómica de cupo antes de gastar tokens
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
    const prompt = buildPromptPorModulo(modulo, form);

    const response = await anthropic.messages.create({
      model: CLAUDE_MODEL_V2,
      max_tokens: 5500,
      messages: [{ role: 'user', content: prompt }],
    });

    const rawText =
      response.content[0]?.type === 'text' ? response.content[0].text : '';

    const jsonText = extraerJSON(rawText);
    if (!jsonText) {
      throw new Error('No se encontró JSON en la respuesta del modelo');
    }

    const parsedJson = JSON.parse(jsonText);
    const guiaValidada = GuiaPedagogicaSchema.parse(parsedJson);
    const guiaEnriquecida = await enriquecerGuia(guiaValidada);

    const tokens = response.usage.input_tokens + response.usage.output_tokens;
    const insertRow = construirInsertRow({
      userId: user.id,
      modulo,
      form,
      rawText,
      guiaEnriquecida,
      tokens,
    });

    const { data: saved, error: saveError } = await supabase
      .from('consultas')
      .insert(insertRow)
      .select('id')
      .single<{ id: string }>();

    if (saveError || !saved) {
      throw new Error(
        `La guía se generó pero no se pudo guardar: ${saveError?.message ?? 'error desconocido'}`
      );
    }

    cupoConsumido = false;
    return NextResponse.json({
      success: true,
      id: saved.id,
      modulo,
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
    if (cupoConsumido) {
      try {
        await supabase.rpc('decrementar_consultas', { p_user_id: user.id });
      } catch (compErr) {
        console.error('[generar-guia-v2] decrementar fallido:', compErr);
      }
    }
  }
}

type FormDocentes = z.infer<typeof formularioConsultaSchema>;
type FormFamilia = z.infer<typeof formularioFamiliaSchema>;
type FormProfesional = z.infer<typeof formularioProfesionalSchema>;

type Detected =
  | { modulo: 'docentes'; form: FormDocentes }
  | { modulo: 'familias'; form: FormFamilia }
  | { modulo: 'profesionales'; form: FormProfesional };

// Detecta el módulo del payload. Prioriza `body.modulo` si viene; si no,
// intenta validar contra cada schema hasta encontrar match.
function detectarModulo(body: unknown): Detected | null {
  if (typeof body !== 'object' || body === null) return null;
  const bag = body as Record<string, unknown>;
  const explicit = typeof bag.modulo === 'string' ? bag.modulo : null;

  if (explicit === 'docentes') {
    const p = formularioConsultaSchema.safeParse(body);
    if (p.success) return { modulo: 'docentes', form: p.data };
    return null;
  }
  if (explicit === 'familias') {
    const p = formularioFamiliaSchema.safeParse(body);
    if (p.success) return { modulo: 'familias', form: p.data };
    return null;
  }
  if (explicit === 'profesionales') {
    const p = formularioProfesionalSchema.safeParse(body);
    if (p.success) return { modulo: 'profesionales', form: p.data };
    return null;
  }

  // Retrocompat: sin `modulo`, intentamos docentes → familias → profesionales
  const pd = formularioConsultaSchema.safeParse(body);
  if (pd.success) return { modulo: 'docentes', form: pd.data };
  const pf = formularioFamiliaSchema.safeParse(body);
  if (pf.success) return { modulo: 'familias', form: pf.data };
  const pp = formularioProfesionalSchema.safeParse(body);
  if (pp.success) return { modulo: 'profesionales', form: pp.data };
  return null;
}

function buildPromptPorModulo(
  modulo: ModuloIncluIA,
  form: FormDocentes | FormFamilia | FormProfesional
): string {
  if (modulo === 'docentes') return buildPromptDocentesV2(form as FormDocentes);
  if (modulo === 'familias') return buildPromptFamiliasV2(form as FormFamilia);
  return buildPromptProfesionalesV2(form as FormProfesional);
}

type InsertArgs = {
  userId: string;
  modulo: ModuloIncluIA;
  form: FormDocentes | FormFamilia | FormProfesional;
  rawText: string;
  guiaEnriquecida: GuiaPedagogica;
  tokens: number;
};

function construirInsertRow({
  userId,
  modulo,
  form,
  rawText,
  guiaEnriquecida,
  tokens,
}: InsertArgs): Record<string, unknown> {
  const base = {
    user_id: userId,
    modulo,
    datos_modulo: form,
    discapacidades: form.discapacidades,
    respuesta_ia: rawText,
    respuesta_ia_estructurada: guiaEnriquecida,
    version_schema: '2.1',
    tokens_usados: tokens,
    cantidad_alumnos: 1,
  };

  if (modulo === 'docentes') {
    const f = form as FormDocentes;
    return {
      ...base,
      nivel: f.nivel_id,
      subnivel: f.subnivel_id ?? null,
      anio_grado: f.anio_grado,
      materia: f.materia,
      contenido: f.contenido,
      cantidad_alumnos: f.cantidad_alumnos,
      situacion_apoyo: f.situacion_apoyo,
      contexto_aula: f.contexto_aula ?? null,
      objetivo_clase: f.objetivo_clase ?? null,
    };
  }
  if (modulo === 'familias') {
    const f = form as FormFamilia;
    return {
      ...base,
      contenido: f.situacion_especifica.slice(0, 300),
    };
  }
  const f = form as FormProfesional;
  return {
    ...base,
    contenido: f.situacion_especifica.slice(0, 300),
  };
}

// Intenta extraer un objeto JSON del texto, tolerando bloques ```json ... ```
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

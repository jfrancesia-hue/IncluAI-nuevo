import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { anthropic, CLAUDE_MODEL_V2 } from '@/lib/anthropic';
import { guardApi } from '@/lib/api-guard';
import {
  GUIA_JSON_SCHEMA,
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
import type { ModuloIncluIA } from '@/lib/types';

export const runtime = 'nodejs';
export const maxDuration = 300;

// Endpoint v2.1: genera una guía estructurada (JSON enriquecido con multimedia)
// para los 3 módulos. El módulo se infiere del body:
//   - `{ modulo: 'docentes', ...form }` — forma explícita nueva
//   - Sin `modulo`: intenta detectar por schema (retrocompat con llamadas
//     que mandaban solo el form de docentes sin el campo)
export async function POST(request: NextRequest) {
  const guard = await guardApi();
  if (!guard.ok) return guard.response;
  const { user, supabase } = guard;

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

  // El cupo se consume SOLO al final, despues del insert exitoso. Asi cualquier
  // error intermedio (timeout de Vercel, Claude 401, Zod parse, Supabase save)
  // no descuenta guia al usuario. guardApi ya valido que hay cupo disponible;
  // la race entre requests paralelas puede hacer que un usuario exceda en 1
  // ocasionalmente — es preferible a cobrarle una guia por cada error.

  try {
    const prompt = buildPromptPorModulo(modulo, form);

    // Tool-use: en vez de pedir JSON en texto (fragil, se trunca, Haiku
    // rompe sintaxis), definimos una tool con el schema como input. El SDK
    // fuerza que Claude devuelva un objeto conforme al schema. Ventaja
    // adicional: el prompt ya no necesita embeber el schema (~4k tokens
    // menos de input), bajando latencia.
    const response = await anthropic.messages.create({
      model: CLAUDE_MODEL_V2,
      max_tokens: 8000,
      tools: [
        {
          name: 'guardar_guia_pedagogica',
          description:
            'Guarda la guía pedagógica inclusiva completa con todas sus secciones. Invocá esta tool exactamente una vez con la guía que respondés al usuario.',
          input_schema: GUIA_JSON_SCHEMA as unknown as {
            type: 'object';
            properties?: Record<string, unknown>;
            required?: string[];
          },
        },
      ],
      tool_choice: { type: 'tool', name: 'guardar_guia_pedagogica' },
      messages: [{ role: 'user', content: prompt }],
    });

    const toolUse = response.content.find(
      (block) => block.type === 'tool_use' && block.name === 'guardar_guia_pedagogica'
    );
    if (!toolUse || toolUse.type !== 'tool_use') {
      throw new Error(
        'El modelo no invocó la tool guardar_guia_pedagogica — respuesta inesperada'
      );
    }

    // Validamos con Zod por las dudas (segunda capa de defensa) y para obtener
    // el tipo TS. El SDK ya valida que input cumpla el JSON schema.
    const guiaValidada = GuiaPedagogicaSchema.parse(toolUse.input);
    const rawText = JSON.stringify(toolUse.input);
    // Enriquecemos todas las imagenes con calidad completa. Las llamadas a
    // Unsplash/Pexels tienen timeout individual de 5s en los servicios; si
    // algun servicio cae, esa imagen queda sin URL (ImagenInteligente usa el
    // fallback con alt-text). Con Vercel Pro tenemos tiempo de sobra.
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

    // Recien ahora consumimos el cupo. Si falla, la guia igual existe en BD,
    // solo que el contador queda desincronizado (se loguea para revision).
    const inc = await supabase.rpc('incrementar_consultas', {
      p_user_id: user.id,
    });
    if (inc.error) {
      console.error('[generar-guia-v2] incrementar_consultas fallo:', inc.error);
    }

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

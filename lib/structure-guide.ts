// ============================================
// IncluAI — Enricher de guías
// Convierte el markdown generado por Claude en un JSON estructurado
// que nuestros componentes React rendericen como UI rica.
//
// Diseño "zero-breaking":
// - Si falla (timeout, parseo, validación), retorna null.
// - El caller sigue guardando el markdown original intacto.
// - El frontend hace fallback al renderer markdown legado.
// ============================================
import 'server-only';
import { anthropic, MODELO_OPERATIVO } from '@/lib/anthropic';
import {
  structuredGuideSchema,
  STRUCTURED_GUIDE_TOOL_SCHEMA,
  type StructuredGuide,
} from '@/lib/guide-schema';

type EnrichInput = {
  markdown: string;
  modulo: 'docentes' | 'familias' | 'profesionales';
  /** Contexto mínimo para que Claude arme los chips del header */
  context: {
    contenido: string;
    materia?: string | null;
    nivel?: string | null;
    anio_grado?: string | null;
    discapacidades?: string[];
    situacion_apoyo?: string | null;
  };
};

const SYSTEM_ENRICHER = `Sos un asistente que convierte guías pedagógicas en formato markdown a un JSON estructurado para mostrarlas en una UI rica.

Tu trabajo es ÚNICAMENTE reestructurar — no agregás contenido nuevo, no cambiás sentido, no omitís información importante.

Reglas:
1. Tenés que llamar obligatoriamente a la tool "render_structured_guide" una sola vez, con el JSON completo.
2. Mapear cada sección del markdown a la variante de "section.kind" más apropiada:
   - Contenidos prioritarios / adecuación curricular → "timeline"
   - Estrategias de enseñanza → "strategies"
   - Materiales y recursos → "resources"
   - Evaluación → "evaluation"
   - Comunicación / vínculo / qué decir → "communication"
   - Qué evitar / errores comunes → "avoid"
   - Coordinación / familia / EOE / equipo → "coordination"
3. Si alguna sección no tiene equivalente, omitila (no inventes).
4. Mantené el tono argentino original (voseo, sin jerga técnica extra).
5. Los chips del header deben incluir: materia, nivel/grado, 1-2 discapacidades principales, y tipo de apoyo si es relevante.
6. Para las ilustraciones de estrategias, elegí el id más coherente del enum. Si ninguno encaja, usá "generic".
7. No uses emojis en ningún campo de texto — las tarjetas ya tienen iconografía propia.
8. No agregues backticks ni cercas de código al resultado.`;

const TOOL_NAME = 'render_structured_guide';

function buildUserMessage(input: EnrichInput): string {
  const { markdown, context, modulo } = input;
  return `Contexto del docente/usuario (para armar los chips del header):
- Módulo: ${modulo}
- Contenido: ${context.contenido}
${context.materia ? `- Materia: ${context.materia}` : ''}
${context.nivel ? `- Nivel: ${context.nivel}` : ''}
${context.anio_grado ? `- Grado/Año: ${context.anio_grado}` : ''}
${context.discapacidades?.length ? `- Discapacidades: ${context.discapacidades.join(', ')}` : ''}
${context.situacion_apoyo ? `- Situación de apoyo: ${context.situacion_apoyo}` : ''}

---

Guía en markdown a estructurar:

${markdown}

---

Ahora llamá a la tool "${TOOL_NAME}" con el JSON estructurado completo.`;
}

/**
 * Transforma una guía markdown en un JSON estructurado.
 * Tiempo objetivo: < 12s. Si falla → null (el caller debe manejar el fallback).
 */
export async function enrichGuideToStructured(
  input: EnrichInput
): Promise<StructuredGuide | null> {
  try {
    const response = await anthropic.messages.create({
      model: MODELO_OPERATIVO,
      max_tokens: 4000,
      system: SYSTEM_ENRICHER,
      tools: [
        {
          name: TOOL_NAME,
          description:
            'Entrega el JSON estructurado final de la guía para renderizar en la UI rica.',
          // El cast es seguro: Anthropic SDK acepta JSONSchema válido
          // pero el tipo expuesto es un union muy amplio.
          input_schema:
            STRUCTURED_GUIDE_TOOL_SCHEMA as unknown as {
              type: 'object';
              [k: string]: unknown;
            },
        },
      ],
      tool_choice: { type: 'tool', name: TOOL_NAME },
      messages: [{ role: 'user', content: buildUserMessage(input) }],
    });

    const toolBlock = response.content.find(
      (b): b is Extract<typeof b, { type: 'tool_use' }> =>
        b.type === 'tool_use' && b.name === TOOL_NAME
    );

    if (!toolBlock) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('[structure-guide] no tool_use block found');
      }
      return null;
    }

    const parsed = structuredGuideSchema.safeParse(toolBlock.input);
    if (!parsed.success) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(
          '[structure-guide] zod validation failed:',
          parsed.error.issues.slice(0, 4)
        );
      }
      return null;
    }

    return parsed.data;
  } catch (err) {
    console.error(
      '[structure-guide] enrichment error:',
      err instanceof Error ? err.message : err
    );
    return null;
  }
}

/**
 * Helper defensivo para leer una guía estructurada desde `datos_modulo`.
 * Cualquier anomalía retorna null para que el frontend caiga al markdown.
 */
export function readStructuredGuide(
  datosModulo: unknown
): StructuredGuide | null {
  if (!datosModulo || typeof datosModulo !== 'object') return null;
  const obj = datosModulo as Record<string, unknown>;
  const candidate = obj.structured;
  if (!candidate) return null;
  const parsed = structuredGuideSchema.safeParse(candidate);
  return parsed.success ? parsed.data : null;
}

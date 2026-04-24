import { z } from 'zod';

// ─────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────

// String con longitud máxima que NO falla si el LLM se pasa — lo trunca.
// Sonnet ocasionalmente excede los maxLength del tool-use schema por 10-50
// chars. En vez de abortar la guía entera, preferimos truncar con elipsis
// y conservar el 99% del contenido. El JSON Schema exportado sigue
// diciendo maxLength: N para que Claude intente respetarlo.
function boundedString(max: number) {
  return z.preprocess(
    (val) => {
      if (typeof val !== 'string') return val;
      if (val.length <= max) return val;
      // Truncar en el último espacio antes del límite (si hay), sino cortar
      // duro. Agregamos elipsis solo si hay lugar.
      const hardCut = val.slice(0, max);
      const lastSpace = hardCut.lastIndexOf(' ');
      const cutAt = lastSpace > max * 0.8 ? lastSpace : max - 1;
      return val.slice(0, cutAt).trimEnd() + '…';
    },
    z.string().max(max)
  );
}

// ─────────────────────────────────────────────────────────
// TIPOS DE RECURSOS MULTIMEDIA
// ─────────────────────────────────────────────────────────

export const ImagenRefSchema = z.object({
  tipo: z.enum(['unsplash', 'pexels', 'banco_incluia', 'wikimedia']),
  query: z.string().describe('Query de búsqueda para la API de imágenes'),
  alt: z.string().describe('Descripción accesible de la imagen'),
  orientacion: z.enum(['horizontal', 'vertical', 'cuadrada']).optional(),
  contextoEducativo: z
    .string()
    .optional()
    .describe('Por qué esta imagen es pedagógicamente útil'),
  urls: z
    .object({
      full: z.string().optional(),
      regular: z.string().optional(),
      small: z.string().optional(),
      thumb: z.string().optional(),
    })
    .optional()
    .describe('URLs enriquecidas por el servicio de imágenes (Pexels/Unsplash)'),
  autor: z
    .object({
      nombre: z.string(),
      url: z.string(),
    })
    .optional()
    .describe('Atribución del autor de la imagen enriquecida'),
});

export const VideoRefSchema = z.object({
  titulo: z.string(),
  duracion: z.string().describe("Formato: '3 min', '2-4 min'"),
  fuente: z.enum(['youtube', 'pakapaka', 'encuentro', 'educ_ar']),
  url: z
    .string()
    .url()
    .optional()
    .describe('URL directa si se conoce, si no dejar vacío'),
  queryBusqueda: z
    .string()
    .describe('Query para que el usuario busque el video'),
  embedId: z
    .string()
    .optional()
    .describe('ID de YouTube si se conoce, para iframe embed'),
  descripcion: z.string().describe('Qué muestra el video y por qué es útil'),
  thumbnailHint: z
    .string()
    .describe('Color/bioma asociado para el thumbnail de fallback'),
});

// ─────────────────────────────────────────────────────────
// ESTRUCTURA DE LA GUÍA PEDAGÓGICA
// ─────────────────────────────────────────────────────────

// Todos los strings con tope usan boundedString(N): si Sonnet se pasa, se
// trunca con elipsis en vez de abortar la guía. El maxLength se sigue
// exportando al LLM vía z.toJSONSchema() para que Claude intente respetarlo.

export const VistaRapidaSchema = z.object({
  titulo: boundedString(120),
  resumen: boundedString(400).describe(
    'Lo esencial que el docente lee en 30 segundos'
  ),
});

export const ConceptoClaveSchema = z.object({
  nombre: z.string(),
  descripcionCorta: boundedString(200),
  imagen: ImagenRefSchema,
  color: z
    .enum(['selva', 'desierto', 'pampa', 'oceano', 'montana', 'neutro'])
    .describe('Paleta para el visual'),
});

export const PasoEstrategiaSchema = z.object({
  texto: z.string(),
  destacado: z
    .string()
    .optional()
    .describe('Palabra o frase clave a resaltar'),
});

export const EstrategiaSchema = z.object({
  numero: z.number().int().min(1).max(6),
  tipo: z.enum([
    'manipulativa',
    'visual',
    'audiovisual',
    'producto',
    'corporal',
    'social',
  ]),
  titulo: boundedString(100),
  subtitulo: boundedString(160).describe(
    "Tags tipo 'Material concreto · 30 min'"
  ),
  pasos: z.array(PasoEstrategiaSchema).min(3).max(8),
  porQueFunciona: boundedString(360),
  imagenApoyo: ImagenRefSchema.optional(),
  videoApoyo: VideoRefSchema.optional(),
});

export const MaterialSchema = z.object({
  nombre: boundedString(100),
  descripcion: boundedString(300),
  tiempoPreparacion: z.string().describe("Ej: '20 minutos', '1 hora'"),
  imagenReferencia: ImagenRefSchema.optional(),
});

export const CriterioEvaluacionSchema = z.object({
  criterio: boundedString(200),
  nivelEsperado: z.enum(['inicial', 'en_proceso', 'consolidado']),
});

export const TipComunicacionSchema = z.object({
  usar: z.string(),
  evitar: z.string(),
});

export const ErrorComunSchema = z.object({
  titulo: boundedString(100),
  descripcion: boundedString(340),
});

// ─────────────────────────────────────────────────────────
// PLANIFICACIÓN PASO A PASO (contextualizada por módulo)
// Docentes: planificación de la clase (Inicio / Desarrollo / Cierre).
// Profesionales: planificación de la consulta (Acogida / Evaluación / Devolución).
// Familias: planificación para la casa (Antes / Durante / Después).
// ─────────────────────────────────────────────────────────

export const MomentoPlanificacionSchema = z.object({
  nombre: boundedString(80).describe(
    'Etapa del proceso. Docentes: Inicio/Desarrollo/Cierre. Profesionales: Acogida/Evaluación/Devolución. Familias: Antes/Durante/Después.'
  ),
  duracion: boundedString(40).describe(
    "Tiempo aproximado. Ej: '10 min', '2-3 min', 'rutina diaria'"
  ),
  pasos: z
    .array(boundedString(260))
    .min(2)
    .max(6)
    .describe(
      'Acciones concretas en orden, en imperativo argentino: "Mostrá el pictograma", "Preguntale a Juan…".'
    ),
  ajusteInclusivo: boundedString(280)
    .optional()
    .describe(
      'Adaptación específica para la/s discapacidad/es en este momento puntual. Omitir si no aplica.'
    ),
});

export const PlanificacionSchema = z.object({
  titulo: boundedString(120).describe(
    'Docentes: "Planificación de la clase". Profesionales: "Planificación de la consulta". Familias: "Qué hacer en casa, paso a paso".'
  ),
  duracionTotal: boundedString(60)
    .optional()
    .describe("Ej: '40 min', '1 sesión de 45 min', 'rutina semanal'"),
  momentos: z.array(MomentoPlanificacionSchema).min(3).max(5),
});

// ─────────────────────────────────────────────────────────
// GUÍA COMPLETA (RESPUESTA DEL AGENTE)
// ─────────────────────────────────────────────────────────

export const GuiaPedagogicaSchema = z.object({
  // Metadata
  version: z.literal('2.1'),
  generadaEn: z.string().datetime(),

  // Hero
  vistaRapida: VistaRapidaSchema,

  // 1. Conceptos clave del contenido (3 tarjetas ilustradas)
  conceptosClave: z.array(ConceptoClaveSchema).min(2).max(4),

  // 2. Estrategias de enseñanza
  estrategias: z.array(EstrategiaSchema).min(3).max(6),

  // 3. Videos recomendados
  videos: z.array(VideoRefSchema).min(2).max(6),

  // 4. Materiales para hacer
  materiales: z.array(MaterialSchema).min(2).max(5),

  // 5. Grilla de evaluación
  criteriosEvaluacion: z.array(CriterioEvaluacionSchema).min(4).max(8),

  // 6. Comunicación en el aula
  tipsComunicacion: z.array(TipComunicacionSchema).min(3).max(6),

  // 7. Errores a evitar
  erroresComunes: z.array(ErrorComunSchema).min(2).max(4),

  // 8. Planificación paso a paso (opcional para retrocompat con guías pre-v2.2;
  //    las guías nuevas siempre la traen — el prompt lo exige).
  planificacion: PlanificacionSchema.optional(),

  // Fuentes normativas citadas (para legitimidad)
  fuentesNormativas: z.array(z.string()).optional(),
});

export type GuiaPedagogica = z.infer<typeof GuiaPedagogicaSchema>;
export type ImagenRef = z.infer<typeof ImagenRefSchema>;
export type VideoRef = z.infer<typeof VideoRefSchema>;
export type Estrategia = z.infer<typeof EstrategiaSchema>;
export type ConceptoClave = z.infer<typeof ConceptoClaveSchema>;
export type Material = z.infer<typeof MaterialSchema>;
export type CriterioEvaluacion = z.infer<typeof CriterioEvaluacionSchema>;
export type TipComunicacion = z.infer<typeof TipComunicacionSchema>;
export type ErrorComun = z.infer<typeof ErrorComunSchema>;
export type VistaRapida = z.infer<typeof VistaRapidaSchema>;
export type Planificacion = z.infer<typeof PlanificacionSchema>;
export type MomentoPlanificacion = z.infer<typeof MomentoPlanificacionSchema>;

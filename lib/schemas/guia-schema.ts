import { z } from 'zod';

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

export const VistaRapidaSchema = z.object({
  titulo: z.string().max(80),
  resumen: z
    .string()
    .max(280)
    .describe('Lo esencial que el docente lee en 30 segundos'),
});

export const ConceptoClaveSchema = z.object({
  nombre: z.string(),
  descripcionCorta: z.string().max(140),
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
  titulo: z.string().max(60),
  subtitulo: z
    .string()
    .max(100)
    .describe("Tags tipo 'Material concreto · 30 min'"),
  pasos: z.array(PasoEstrategiaSchema).min(3).max(8),
  porQueFunciona: z.string().max(240),
  imagenApoyo: ImagenRefSchema.optional(),
  videoApoyo: VideoRefSchema.optional(),
});

export const MaterialSchema = z.object({
  nombre: z.string().max(60),
  descripcion: z.string().max(200),
  tiempoPreparacion: z.string().describe("Ej: '20 minutos', '1 hora'"),
  imagenReferencia: ImagenRefSchema.optional(),
});

export const CriterioEvaluacionSchema = z.object({
  criterio: z.string().max(120),
  nivelEsperado: z.enum(['inicial', 'en_proceso', 'consolidado']),
});

export const TipComunicacionSchema = z.object({
  usar: z.string(),
  evitar: z.string(),
});

export const ErrorComunSchema = z.object({
  titulo: z.string().max(60),
  descripcion: z.string().max(220),
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

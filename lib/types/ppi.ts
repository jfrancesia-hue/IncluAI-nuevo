import { z } from 'zod'

export type PPINivel = 'inicial' | 'primaria' | 'secundaria'
export type PPIPeriodo =
  | 'anual'
  | 'primer_cuatrimestre'
  | 'segundo_cuatrimestre'
  | 'trimestral'
export type PPIEstado = 'borrador' | 'completo' | 'presentado' | 'archivado'

// ---------- Secciones generadas ----------

export interface PPISeccion {
  titulo: string
  contenido: string
  puntos?: string[]
}

export interface PPISecciones {
  datos_generales?: PPISeccion
  fortalezas?: PPISeccion
  barreras?: PPISeccion
  apoyos?: PPISeccion                        // configuraciones de apoyo (CFE 311/16 art. 3-4)
  contenidos_priorizados?: PPISeccion
  adaptaciones_metodologicas?: PPISeccion
  evaluacion?: PPISeccion
  acuerdos_familia?: PPISeccion
  articulacion_equipo?: PPISeccion
  seguimiento_trimestral?: PPISeccion
}

export type PPISeccionKey = keyof PPISecciones

export const SECCIONES_ORDEN: PPISeccionKey[] = [
  'datos_generales',
  'fortalezas',
  'barreras',
  'apoyos',
  'contenidos_priorizados',
  'adaptaciones_metodologicas',
  'evaluacion',
  'acuerdos_familia',
  'articulacion_equipo',
  'seguimiento_trimestral',
]

export const SECCION_LABELS: Record<PPISeccionKey, string> = {
  datos_generales: 'Datos generales',
  fortalezas: 'Fortalezas del estudiante',
  barreras: 'Barreras para el aprendizaje',
  apoyos: 'Configuraciones de apoyo',
  contenidos_priorizados: 'Contenidos priorizados',
  adaptaciones_metodologicas: 'Adaptaciones metodológicas',
  evaluacion: 'Criterios y modalidad de evaluación',
  acuerdos_familia: 'Acuerdos con la familia',
  articulacion_equipo: 'Articulación con equipo de apoyo',
  seguimiento_trimestral: 'Plan de seguimiento trimestral',
}

// ---------- Documento completo ----------

export interface PPIDocumento {
  id: string
  user_id: string
  alumno_identificador: string
  alumno_edad: number
  alumno_nivel: PPINivel
  alumno_anio_grado: string | null
  alumno_discapacidades: string[]
  alumno_diagnostico: string | null
  institucion: string
  ciclo_lectivo: string
  periodo: PPIPeriodo
  fortalezas_observadas: string | null
  barreras_observadas: string | null
  contexto_familiar: string | null
  equipo_externo: string | null
  secciones: PPISecciones
  estado: PPIEstado
  version_schema: string
  created_at: string
  updated_at: string
  generado_at: string | null
  presentado_at: string | null
}

export interface PPISeguimiento {
  id: string
  ppi_id: string
  fecha: string
  trimestre: number
  logros: string | null
  desafios: string | null
  ajustes: string | null
  created_at: string
}

// ---------- Zod schemas para formularios ----------

export const ppiFormSchema = z.object({
  // Paso 1 — alumno
  alumno_identificador: z
    .string()
    .min(1, 'Ingresá iniciales o pseudónimo del alumno.')
    .max(40, 'Máximo 40 caracteres — usá iniciales o pseudónimo, no nombre completo.')
    .refine((s) => !/\s{2,}/.test(s), 'Sin dobles espacios.'),
  alumno_edad: z
    .number()
    .int()
    .min(3, 'Edad mínima 3 años.')
    .max(25, 'Edad máxima 25 años.'),
  alumno_nivel: z.enum(['inicial', 'primaria', 'secundaria']),
  alumno_anio_grado: z.string().max(40).optional().nullable(),
  alumno_discapacidades: z
    .array(z.string())
    .min(1, 'Seleccioná al menos una discapacidad.'),
  alumno_diagnostico: z.string().max(600).optional().nullable(),

  // Paso 2 — institución
  institucion: z.string().min(2, 'Nombre de la institución').max(200),
  ciclo_lectivo: z
    .string()
    .regex(/^\d{4}$/, 'Año de 4 dígitos, ej: 2026'),
  periodo: z.enum([
    'anual',
    'primer_cuatrimestre',
    'segundo_cuatrimestre',
    'trimestral',
  ]),

  // Paso 3 — observaciones del docente (alimentan a Claude)
  fortalezas_observadas: z
    .string()
    .min(20, 'Contanos al menos una fortaleza observada (20+ caracteres).')
    .max(2000),
  barreras_observadas: z
    .string()
    .min(20, 'Describí brevemente las barreras detectadas (20+ caracteres).')
    .max(2000),

  // Paso 4 — contexto
  contexto_familiar: z.string().max(1500).optional().nullable(),
  equipo_externo: z.string().max(1500).optional().nullable(),

  // Vínculo opcional con consultas previas
  consultas_vinculadas: z.array(z.string().uuid()).optional().default([]),
})

export type PPIFormValues = z.infer<typeof ppiFormSchema>

export const ppiRegenerarSeccionSchema = z.object({
  seccion: z.enum(SECCIONES_ORDEN as [PPISeccionKey, ...PPISeccionKey[]]),
  instruccion_adicional: z.string().max(500).optional(),
})

export type PPIRegenerarSeccion = z.infer<typeof ppiRegenerarSeccionSchema>

// ---------- Ciclo lectivo helper ----------

/**
 * Ciclo lectivo argentino: marzo-febrero.
 * Si hoy es enero-febrero, el ciclo actual es el que arrancó el año anterior.
 */
export function cicloLectivoActual(now = new Date()): string {
  const y = now.getFullYear()
  const m = now.getMonth() + 1 // 1-12
  return m >= 3 ? String(y) : String(y - 1)
}

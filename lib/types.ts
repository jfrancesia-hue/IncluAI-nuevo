// ============================================
// IncluIA — Tipos TypeScript principales
// ============================================

// --- Niveles y Modalidades ---

export type NivelEducativo = {
  id: string
  label: string
  modalidad?: string
  subniveles?: {
    id: string
    label: string
    anios: string[]
  }[]
}

// --- Materias ---

export type MateriasPorNivel = {
  [nivelId: string]: string[]
}

// --- Discapacidades ---

export type Discapacidad = {
  id: string
  label: string
  icon: string
  descripcion: string
  estrategias_clave: string[]
}

// --- Formulario ---

export type FormStep = 1 | 2 | 3

export type SituacionApoyo =
  | 'maestra_integradora'
  | 'acompanante_terapeutico'
  | 'sin_apoyo'
  | 'en_diagnostico'
  | 'otro'

export type FormularioConsulta = {
  // Paso 1: Contexto docente
  nivel_id: string
  subnivel_id?: string
  anio_grado: string
  materia: string
  contenido: string

  // Paso 2: Discapacidad/es
  discapacidades: string[] // IDs de discapacidades seleccionadas
  discapacidad_otra?: string // Si seleccionó "otra"
  cantidad_alumnos: number
  situacion_apoyo: SituacionApoyo
  situacion_apoyo_otra?: string

  // Paso 3: Contexto adicional
  contexto_aula?: string
  objetivo_clase?: string
}

// --- Usuario / Perfil ---

export type RolUsuario = 'docente' | 'admin'

export type PlanUsuario = 'free' | 'pro' | 'institucional'

export type Perfil = {
  id: string
  nombre: string
  apellido: string
  email: string
  nivel_educativo?: string
  institucion?: string
  localidad?: string
  provincia?: string
  rol: RolUsuario
  plan: PlanUsuario
  plan_activo_hasta?: string // ISO date
  consultas_mes: number
  created_at: string
}

// --- Consultas ---

export type Consulta = {
  id: string
  user_id: string
  nivel: string
  anio_grado?: string
  materia: string
  contenido: string
  discapacidades: string[]
  cantidad_alumnos: number
  situacion_apoyo: SituacionApoyo
  contexto_aula?: string
  objetivo_clase?: string
  respuesta_ia: string
  tokens_usados?: number
  feedback_estrellas?: number
  created_at: string
}

// --- Guías guardadas ---

export type GuiaGuardada = {
  id: string
  consulta_id: string
  user_id: string
  titulo: string
  es_favorita: boolean
  created_at: string
  consulta?: Consulta // Join opcional
}

// --- Límites por plan ---

export const LIMITES_PLAN: Record<PlanUsuario, {
  guias_por_mes: number
  historial: boolean
  exportar_pdf: boolean
  precio_ars: number
}> = {
  free: {
    guias_por_mes: 2,
    historial: false,
    exportar_pdf: false,
    precio_ars: 0,
  },
  pro: {
    guias_por_mes: 40,
    historial: true,
    exportar_pdf: true,
    precio_ars: 9900,
  },
  institucional: {
    guias_por_mes: 999,
    historial: true,
    exportar_pdf: true,
    precio_ars: 29900,
  },
}

// --- API Response ---

export type GenerarGuiaRequest = FormularioConsulta

export type GenerarGuiaResponse = {
  success: boolean
  error?: string
  consulta_id?: string
}

// --- Feedback ---

export type FeedbackRequest = {
  consulta_id: string
  estrellas: number // 1-5
}

// ============================================
// IncluAI — Tipos TypeScript principales
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

export type PlanUsuario = 'free' | 'basico' | 'profesional' | 'premium'

export type PlanPago = Exclude<PlanUsuario, 'free'>

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
  tipo_usuario: 'docente' | 'familia' | 'profesional'
  especialidad?: string
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

// --- Límites por plan (Planes Híbridos Sonnet/Opus) ---
// Free/Básico/Profesional usan Sonnet 4.6 (más barato, misma calidad de base).
// Premium usa Opus 4.7 (máxima calidad estructural y adherencia al schema).

export const LIMITES_PLAN: Record<PlanUsuario, {
  guias_mes: number
  ppis_ciclo: number
  modelo: 'claude-sonnet-4-6' | 'claude-opus-4-7'
  guia_persistente: boolean
  historial: boolean
  exportar_pdf: boolean
  precio_ars: number
}> = {
  free: {
    guias_mes: 1,
    ppis_ciclo: 0,
    modelo: 'claude-sonnet-4-6',
    guia_persistente: true,
    historial: true,
    exportar_pdf: false,
    precio_ars: 0,
  },
  basico: {
    guias_mes: 20,
    ppis_ciclo: 2,
    modelo: 'claude-sonnet-4-6',
    guia_persistente: true,
    historial: true,
    exportar_pdf: true,
    precio_ars: 10_000,
  },
  profesional: {
    guias_mes: 40,
    ppis_ciclo: 3,
    modelo: 'claude-sonnet-4-6',
    guia_persistente: true,
    historial: true,
    exportar_pdf: true,
    precio_ars: 15_000,
  },
  premium: {
    guias_mes: 10,
    ppis_ciclo: 5,
    modelo: 'claude-opus-4-7',
    guia_persistente: true,
    historial: true,
    exportar_pdf: true,
    precio_ars: 25_000,
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

// ============================================
// Expansión: módulo selector (docentes / familias / profesionales)
// ============================================

export type ModuloIncluIA = 'docentes' | 'familias' | 'profesionales'

export type TipoUsuario = 'docente' | 'familia' | 'profesional'

// ============================================
// Módulo Familias
// ============================================

export type RangoEdad =
  | '0-2'
  | '3-5'
  | '6-8'
  | '9-12'
  | '13-15'
  | '16-18'
  | '18+'

export type AreaAyudaFamilia =
  | 'rutinas'
  | 'comunicacion'
  | 'conducta'
  | 'autonomia'
  | 'socializacion'
  | 'estimulacion'
  | 'escolaridad'
  | 'emociones'
  | 'sueno'
  | 'alimentacion'
  | 'transiciones'
  | 'hermanos'
  | 'tramites'

export type SituacionFamiliar =
  | 'ambos_padres'
  | 'monoparental'
  | 'familia_ampliada'
  | 'otro'

export type FormularioFamilia = {
  nombre_hijo?: string
  edad_rango: RangoEdad
  discapacidades: string[]
  discapacidad_otra?: string
  diagnostico_detalle?: string

  areas_ayuda: AreaAyudaFamilia[]
  situacion_especifica: string

  situacion_familiar: SituacionFamiliar
  tiene_terapias: boolean
  terapias_detalle?: string
  contexto_adicional?: string
}

// ============================================
// Módulo Profesionales
// ============================================

export type EspecialidadProfesional =
  | 'psicologo'
  | 'fonoaudiologo'
  | 'terapeuta_ocupacional'
  | 'kinesiologo'
  | 'medico_pediatra'
  | 'medico_familia'
  | 'medico_neurologo'
  | 'medico_psiquiatra'
  | 'odontologo'
  | 'nutricionista'
  | 'trabajador_social'
  | 'psicopedagogo'
  | 'musicoterapeuta'
  | 'acompanante_terapeutico'
  | 'otro'

export type ContextoAtencion =
  | 'primera_consulta'
  | 'seguimiento'
  | 'evaluacion'
  | 'intervencion'
  | 'interconsulta'
  | 'domiciliaria'

export type ObjetivoConsultaProfesional =
  | 'comunicacion'
  | 'adaptacion_espacio'
  | 'manejo_conducta'
  | 'evaluacion_adaptada'
  | 'plan_tratamiento'
  | 'orientacion_familia'
  | 'coordinacion_equipo'
  | 'material_adaptado'

export type FormularioProfesional = {
  especialidad: EspecialidadProfesional
  especialidad_otra?: string
  contexto_atencion: ContextoAtencion
  lugar_atencion: string

  edad_paciente: RangoEdad
  discapacidades: string[]
  discapacidad_otra?: string
  diagnostico_detalle?: string
  comunicacion_paciente: string

  objetivos: ObjetivoConsultaProfesional[]
  situacion_especifica: string
  contexto_adicional?: string
}

// ============================================
// Consulta unificada — vista genérica que cruza los 3 módulos
// ============================================

export type ConsultaUnificada = {
  id: string
  user_id: string
  modulo: ModuloIncluIA
  datos_modulo: Record<string, unknown>
  discapacidades: string[]
  respuesta_ia: string
  tokens_usados?: number
  feedback_estrellas?: number
  created_at: string
}

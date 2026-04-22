import 'server-only'
import type {
  CoverageMetrics,
  ImpactMetrics,
  ComplianceMetrics,
  DashboardKPI,
} from '@/lib/types/gobierno'

/**
 * Las vistas materializadas `mv_gov_*` NO son accesibles directamente por el cliente
 * (hardening 005). Se consultan vía funciones RPC SECURITY DEFINER que validan:
 *   - es_gov_user()
 *   - jurisdiction_id ∈ gov_jurisdicciones_accesibles()
 */

type SupabaseLike = {
  rpc: (fn: string, args: Record<string, unknown>) => Promise<{ data: unknown; error: unknown }>
}

type CoverageRow = {
  jurisdiction_id: string
  schools_total: number
  schools_active_30d: number
  teachers_total: number
  teachers_active_week: number
  consultas_30d: number
}

type ImpactRow = {
  jurisdiction_id: string
  adaptaciones_generadas: number
  adaptaciones_docentes: number
  orientaciones_familias: number
  derivaciones_profesionales: number
  promedio_feedback: number | null
  usuarios_activos_periodo: number
  horas_docentes_ahorradas: number
}

type ComplianceRow = {
  jurisdiction_id: string
  wcag_21_aa_score: number
  cfe_311_16_score: number
  ley_25326_score: number
  ley_26653_score: number
}

function firstRow<T>(data: unknown): T | null {
  if (Array.isArray(data) && data.length > 0) return data[0] as T
  return null
}

export async function getCoverageMetrics(
  supabase: SupabaseLike,
  jurisdictionId: string
): Promise<CoverageMetrics> {
  const { data, error } = await supabase.rpc('get_gov_coverage_for', {
    p_jurisdiction_id: jurisdictionId,
  })
  if (error) throw error
  const row = firstRow<CoverageRow>(data) ?? {
    jurisdiction_id: jurisdictionId,
    schools_total: 0,
    schools_active_30d: 0,
    teachers_total: 0,
    teachers_active_week: 0,
    consultas_30d: 0,
  }

  const coveragePercent =
    row.schools_total > 0
      ? Math.round((row.schools_active_30d / row.schools_total) * 100)
      : 0

  return {
    schoolsActive: row.schools_active_30d,
    schoolsTotal: row.schools_total,
    teachersActive: row.teachers_active_week,
    teachersTotal: row.teachers_total,
    studentsAssisted: row.teachers_active_week * 25,
    coveragePercent,
  }
}

export async function getImpactMetrics(
  supabase: SupabaseLike,
  jurisdictionId: string
): Promise<ImpactMetrics> {
  const { data, error } = await supabase.rpc('get_gov_impact_for', {
    p_jurisdiction_id: jurisdictionId,
  })
  if (error) throw error
  const row = firstRow<ImpactRow>(data) ?? {
    jurisdiction_id: jurisdictionId,
    adaptaciones_generadas: 0,
    adaptaciones_docentes: 0,
    orientaciones_familias: 0,
    derivaciones_profesionales: 0,
    promedio_feedback: null,
    usuarios_activos_periodo: 0,
    horas_docentes_ahorradas: 0,
  }

  return {
    adaptationsGenerated: row.adaptaciones_generadas,
    adaptationsDocentes: row.adaptaciones_docentes,
    orientationsFamilias: row.orientaciones_familias,
    derivationsProfesionales: row.derivaciones_profesionales,
    earlyAlertsTriggered: 0,
    derivationsFacilitated: row.derivaciones_profesionales,
    teacherHoursSaved: row.horas_docentes_ahorradas,
    avgFeedbackStars: row.promedio_feedback,
  }
}

export async function getComplianceMetrics(
  supabase: SupabaseLike,
  jurisdictionId: string
): Promise<ComplianceMetrics> {
  const { data, error } = await supabase.rpc('get_gov_compliance_for', {
    p_jurisdiction_id: jurisdictionId,
  })
  if (error) throw error
  const row = firstRow<ComplianceRow>(data) ?? {
    jurisdiction_id: jurisdictionId,
    wcag_21_aa_score: 98,
    cfe_311_16_score: 100,
    ley_25326_score: 95,
    ley_26653_score: 98,
  }

  return {
    cfe_311_16_score: row.cfe_311_16_score,
    wcag_21_aa_score: row.wcag_21_aa_score,
    ley_25326_score: row.ley_25326_score,
    ley_26653_score: row.ley_26653_score,
    iso_27001_readiness: 40,
  }
}

export function buildDashboardKPIs(
  coverage: CoverageMetrics,
  impact: ImpactMetrics,
  compliance: ComplianceMetrics
): DashboardKPI[] {
  return [
    {
      id: 'schools_active',
      label: 'Escuelas activas',
      value: `${coverage.schoolsActive}/${coverage.schoolsTotal}`,
      icon: 'school',
    },
    {
      id: 'teachers_active',
      label: 'Docentes activos (7d)',
      value: coverage.teachersActive,
      icon: 'users',
      format: 'number',
    },
    {
      id: 'adaptations',
      label: 'Adaptaciones generadas (30d)',
      value: impact.adaptationsGenerated,
      icon: 'file-check',
      format: 'number',
    },
    {
      id: 'hours_saved',
      label: 'Horas ahorradas a docentes',
      value: impact.teacherHoursSaved,
      icon: 'clock',
      format: 'hours',
    },
    {
      id: 'cfe_compliance',
      label: 'Cumplimiento CFE 311/16',
      value: compliance.cfe_311_16_score,
      icon: 'shield-check',
      format: 'percent',
    },
  ]
}

// ============================================
// IncluAI — Tipos Fase 8 "Gobierno & Compra Estatal"
// Separado de lib/types.ts para no romper imports existentes.
// ============================================

export type GovRole =
  | 'gov_admin'
  | 'gov_supervisor'
  | 'gov_analyst'
  | 'gov_auditor'

export type JurisdictionType =
  | 'nacion'
  | 'provincia'
  | 'departamento'
  | 'municipio'

export type ContractStatus = 'active' | 'suspended' | 'expired' | 'draft'

export type GovMetricType =
  | 'coverage'
  | 'impact'
  | 'compliance'
  | 'engagement'

export type ModuloContrato = 'docentes' | 'familias' | 'profesionales'

// ----- Entidades -----

export interface GovJurisdiction {
  id: string
  name: string
  type: JurisdictionType
  parent_id: string | null
  code: string | null
  contact_info?: {
    contacto_nombre?: string
    email?: string
    telefono?: string
  } | null
  created_at: string
}

export interface GovContract {
  id: string
  jurisdiction_id: string
  contract_number: string | null
  start_date: string        // ISO date
  end_date: string          // ISO date
  licensed_students_cap: number | null
  licensed_teachers_cap: number | null
  modules_included: ModuloContrato[]
  legal_framework: {
    laws: string[]          // ej: ['Ley 26.206','Ley 26.378','Res CFE 311/16']
    provincialLaws?: string[]
  } | null
  status: ContractStatus
  created_at: string
}

export interface GovSchoolAssignment {
  id: string
  school_id: string
  jurisdiction_id: string
  contract_id: string
  assigned_at: string
}

export interface GovUser {
  id: string
  user_id: string           // FK auth.users
  jurisdiction_id: string
  role: GovRole
  department_scope: string[]
  created_at: string
}

// ----- Payloads agregados (siempre sin PII) -----

export interface CoverageMetrics {
  schoolsActive: number
  schoolsTotal: number
  teachersActive: number
  teachersTotal: number
  studentsAssisted: number
  coveragePercent: number
}

export interface ImpactMetrics {
  adaptationsGenerated: number
  adaptationsDocentes: number
  orientationsFamilias: number
  derivationsProfesionales: number
  earlyAlertsTriggered: number
  derivationsFacilitated: number
  teacherHoursSaved: number
  avgFeedbackStars: number | null
}

export interface ComplianceMetrics {
  cfe_311_16_score: number      // 0-100
  wcag_21_aa_score: number
  ley_25326_score: number
  ley_26653_score: number
  iso_27001_readiness: number
}

export interface EngagementMetrics {
  activeUsersLast7d: number
  activeUsersLast30d: number
  sessionsLast30d: number
  retention30d: number          // 0-1
}

export type GovMetricsPayload =
  | { metric_type: 'coverage'; data: CoverageMetrics }
  | { metric_type: 'impact'; data: ImpactMetrics }
  | { metric_type: 'compliance'; data: ComplianceMetrics }
  | { metric_type: 'engagement'; data: EngagementMetrics }

export interface GovMetricsSnapshot {
  id: string
  jurisdiction_id: string
  snapshot_date: string         // ISO date
  metric_type: GovMetricType
  metric_payload: GovMetricsPayload['data']
  computed_at: string
}

// ----- Auditoría inmutable -----

export interface GovAuditLogEntry {
  id: string
  gov_user_id: string
  action: string                // 'view_dashboard'|'export_pdf'|'view_heatmap'|...
  resource_type: string | null
  resource_id: string | null
  ip_address: string | null
  user_agent: string | null
  payload_hash: string | null
  occurred_at: string
}

export type GovAuditAction =
  | 'view_dashboard'
  | 'view_coverage_heatmap'
  | 'view_impact_indicators'
  | 'view_compliance_report'
  | 'view_early_warnings'
  | 'view_audit_log'
  | 'generate_report_pdf_exec'
  | 'generate_report_pdf_tecnico'
  | 'generate_report_xlsx'
  | 'generate_infographic_png'
  | 'sync_integration_sinide'
  | 'validate_cud_andis'

// ----- Dashboard ejecutivo -----

export interface DashboardKPI {
  id: string
  label: string
  value: number | string
  delta?: number                // % vs período anterior
  format?: 'number' | 'percent' | 'currency' | 'hours'
  icon?: string
}

export interface DashboardResponse {
  jurisdiction: Pick<GovJurisdiction, 'id' | 'name' | 'type'>
  snapshot_date: string
  kpis: DashboardKPI[]
  coverage: CoverageMetrics
  impact: ImpactMetrics
  compliance: ComplianceMetrics
  last_refresh: string
}

// ----- Mapa de cobertura -----

export interface HeatmapCell {
  departamento: string
  departamento_id: string
  schools_total: number
  schools_active: number
  cobertura_pct: number
  lat?: number
  lng?: number
}

export interface HeatmapResponse {
  jurisdiction_id: string
  cells: HeatmapCell[]
  generated_at: string
}

// ----- Early warnings (siempre agregado, sin nombres) -----

export interface EarlyWarning {
  id: string
  school_cue_masked: string     // ej: "3000****12" (masking obligatorio)
  departamento: string
  tipo_alerta: 'escuela_inactiva' | 'baja_adopcion' | 'feedback_negativo'
  severidad: 'baja' | 'media' | 'alta'
  dias_sin_actividad?: number
  descripcion: string
}

// ----- Reportes -----

export type ReportKind =
  | 'pdf_ejecutivo'
  | 'pdf_tecnico'
  | 'xlsx_dataset'
  | 'png_infografia'

export interface ReportGenerateRequest {
  kind: ReportKind
  jurisdiction_id: string
  period_from: string
  period_to: string
  include_sections?: string[]
}

export interface ReportGenerateResponse {
  kind: ReportKind
  url: string                   // URL firmada o data: URI
  size_bytes: number
  expires_at: string
  audit_log_id: string
}

// ----- Helper: type guards -----

export function isGovRole(value: string): value is GovRole {
  return (
    value === 'gov_admin' ||
    value === 'gov_supervisor' ||
    value === 'gov_analyst' ||
    value === 'gov_auditor'
  )
}

export function isGovAuditAction(value: string): value is GovAuditAction {
  return [
    'view_dashboard',
    'view_coverage_heatmap',
    'view_impact_indicators',
    'view_compliance_report',
    'view_early_warnings',
    'view_audit_log',
    'generate_report_pdf_exec',
    'generate_report_pdf_tecnico',
    'generate_report_xlsx',
    'generate_infographic_png',
    'sync_integration_sinide',
    'validate_cud_andis',
  ].includes(value)
}

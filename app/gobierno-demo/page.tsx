import { KpiGrid } from '@/components/gov/KpiCard'
import type {
  CoverageMetrics,
  ImpactMetrics,
  ComplianceMetrics,
} from '@/lib/types/gobierno'
import { buildDashboardKPIs } from '@/lib/gov/metrics'

const coverage: CoverageMetrics = {
  schoolsActive: 312,
  schoolsTotal: 428,
  teachersActive: 2840,
  teachersTotal: 4120,
  studentsAssisted: 71000,
  coveragePercent: 73,
}

const impact: ImpactMetrics = {
  adaptationsGenerated: 14280,
  adaptationsDocentes: 9840,
  orientationsFamilias: 2880,
  derivationsProfesionales: 1560,
  earlyAlertsTriggered: 42,
  derivationsFacilitated: 1560,
  teacherHoursSaved: 7140,
  avgFeedbackStars: 4.6,
}

const compliance: ComplianceMetrics = {
  cfe_311_16_score: 96,
  wcag_21_aa_score: 94,
  ley_25326_score: 98,
  ley_26653_score: 96,
  iso_27001_readiness: 42,
}

export default function GovDemoDashboard() {
  const kpis = buildDashboardKPIs(coverage, impact, compliance)

  return (
    <>
      <h1 className="gov-page-title">Dashboard ejecutivo</h1>
      <p className="gov-page-subtitle">
        Vista de demostración con datos simulados — Provincia de Córdoba, período 30 días.
      </p>

      <KpiGrid kpis={kpis} />

      <section className="gov-card" aria-labelledby="resumen-titulo">
        <h2 id="resumen-titulo" className="gov-card__title">
          Resumen ejecutivo
        </h2>
        <p style={{ color: 'var(--gov-text-muted)', lineHeight: 1.6 }}>
          IncluAI está generando impacto pedagógico documentable en{' '}
          <strong>{coverage.schoolsActive} escuelas activas</strong> de Córdoba. En los últimos
          30 días se produjeron <strong>{impact.adaptationsGenerated.toLocaleString('es-AR')} adaptaciones
          curriculares</strong>, ahorrando aproximadamente{' '}
          <strong>{impact.teacherHoursSaved.toLocaleString('es-AR')} horas docentes</strong>.
          El cumplimiento con la Resolución CFE 311/16 es del{' '}
          <strong>{compliance.cfe_311_16_score}%</strong>.
        </p>
      </section>
    </>
  )
}

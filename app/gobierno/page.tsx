import { createClient } from '@/lib/supabase/server'
import {
  getCoverageMetrics,
  getImpactMetrics,
  getComplianceMetrics,
  buildDashboardKPIs,
} from '@/lib/gov/metrics'
import { KpiGrid } from '@/components/gov/KpiCard'

export const dynamic = 'force-dynamic'

export default async function GobiernoDashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data: govUser } = await supabase
    .from('gov_users')
    .select('jurisdiction_id')
    .eq('user_id', user.id)
    .single()

  if (!govUser) return null

  const [coverage, impact, compliance] = await Promise.all([
    getCoverageMetrics(supabase as never, govUser.jurisdiction_id),
    getImpactMetrics(supabase as never, govUser.jurisdiction_id),
    getComplianceMetrics(supabase as never, govUser.jurisdiction_id),
  ])

  const kpis = buildDashboardKPIs(coverage, impact, compliance)

  return (
    <>
      <h1 className="gov-page-title">Dashboard ejecutivo</h1>
      <p className="gov-page-subtitle">
        Métricas agregadas en tiempo real — sin datos individuales de estudiantes, familias ni
        docentes.
      </p>

      <KpiGrid kpis={kpis} />

      <section className="gov-card" aria-labelledby="resumen-titulo">
        <h2 id="resumen-titulo" className="gov-card__title">
          Resumen ejecutivo
        </h2>
        <p style={{ color: 'var(--gov-text-muted)', lineHeight: 1.6 }}>
          IncluAI está generando impacto pedagógico documentable en {coverage.schoolsActive}{' '}
          escuelas activas. En los últimos 30 días se produjeron{' '}
          <strong>{impact.adaptationsGenerated} adaptaciones curriculares</strong>, ahorrando
          aproximadamente <strong>{impact.teacherHoursSaved} horas docentes</strong>. El
          cumplimiento con la Resolución CFE 311/16 es del{' '}
          <strong>{compliance.cfe_311_16_score}%</strong>.
        </p>
      </section>
    </>
  )
}

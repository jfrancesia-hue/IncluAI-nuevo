import { createClient } from '@/lib/supabase/server'
import { getImpactMetrics } from '@/lib/gov/metrics'

export const dynamic = 'force-dynamic'

export default async function ImpactoPage() {
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

  const impact = await getImpactMetrics(supabase as never, govUser.jurisdiction_id)

  const total = impact.adaptationsGenerated || 1
  const pctDocentes = Math.round((impact.adaptationsDocentes / total) * 100)
  const pctFamilias = Math.round((impact.orientationsFamilias / total) * 100)
  const pctProfesionales = Math.round((impact.derivationsProfesionales / total) * 100)

  return (
    <>
      <h1 className="gov-page-title">Impacto pedagógico</h1>
      <p className="gov-page-subtitle">Indicadores agregados de los últimos 30 días.</p>

      <div className="gov-kpi-grid">
        <article className="gov-kpi">
          <div className="gov-kpi__label">Adaptaciones totales</div>
          <div className="gov-kpi__value">
            {new Intl.NumberFormat('es-AR').format(impact.adaptationsGenerated)}
          </div>
        </article>
        <article className="gov-kpi">
          <div className="gov-kpi__label">Horas docentes ahorradas</div>
          <div className="gov-kpi__value">{impact.teacherHoursSaved} h</div>
        </article>
        <article className="gov-kpi">
          <div className="gov-kpi__label">Feedback promedio</div>
          <div className="gov-kpi__value">
            {impact.avgFeedbackStars?.toFixed(1) ?? '—'} / 5
          </div>
        </article>
      </div>

      <section className="gov-card" aria-labelledby="distribucion">
        <h2 id="distribucion" className="gov-card__title">
          Distribución por módulo
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <BarRow label="Docentes" value={impact.adaptationsDocentes} pct={pctDocentes} color="#185FA5" />
          <BarRow label="Familias" value={impact.orientationsFamilias} pct={pctFamilias} color="#3B6D11" />
          <BarRow
            label="Profesionales"
            value={impact.derivationsProfesionales}
            pct={pctProfesionales}
            color="#534AB7"
          />
        </div>
      </section>
    </>
  )
}

function BarRow({
  label,
  value,
  pct,
  color,
}: {
  label: string
  value: number
  pct: number
  color: string
}) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 4 }}>
        <span style={{ fontWeight: 500 }}>{label}</span>
        <span style={{ color: 'var(--gov-text-muted)' }}>
          {value.toLocaleString('es-AR')} ({pct}%)
        </span>
      </div>
      <div
        style={{
          height: 8,
          borderRadius: 999,
          background: 'var(--gov-primary-soft)',
          overflow: 'hidden',
        }}
        aria-hidden="true"
      >
        <div
          style={{
            width: `${Math.min(pct, 100)}%`,
            height: '100%',
            background: color,
            transition: 'width 200ms ease',
          }}
        />
      </div>
    </div>
  )
}

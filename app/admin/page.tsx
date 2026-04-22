import { createClient } from '@/lib/supabase/server'
import { getBusinessMetrics } from '@/lib/admin/metricas'

export const dynamic = 'force-dynamic'

function fmtARS(v: number) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(v)
}

function fmtNum(v: number) {
  return new Intl.NumberFormat('es-AR').format(v)
}

export default async function AdminMetricasPage() {
  const supabase = await createClient()
  const m = await getBusinessMetrics(supabase)

  return (
    <>
      <h1 className="gov-page-title">Métricas de negocio</h1>
      <p className="gov-page-subtitle">
        Solo lectura. Datos directos desde Supabase, sin agregaciones diferidas.
      </p>

      <div className="gov-kpi-grid">
        <Kpi label="MRR" value={fmtARS(m.mrr_ars)} hint={`≈ USD ${fmtNum(m.mrr_usd_aprox)}`} />
        <Kpi label="ARR" value={fmtARS(m.arr_ars)} />
        <Kpi label="Usuarios totales" value={fmtNum(m.totalUsers)} />
        <Kpi label="Pro / Institucional" value={`${m.usersByPlan.pro} / ${m.usersByPlan.institucional}`} />
        <Kpi label="Consultas totales" value={fmtNum(m.total_consultas)} />
        <Kpi label="Consultas últimos 30d" value={fmtNum(m.consultas_30d)} />
        <Kpi label="Consultas últimos 7d" value={fmtNum(m.consultas_7d)} />
        <Kpi label="Activación" value={`${m.activation_rate.toFixed(1)}%`} />
        <Kpi label="Avg. consultas/user" value={m.avg_consultas_por_user.toFixed(2)} />
        <Kpi label="Feedback promedio" value={m.feedback_promedio?.toFixed(2) ?? '—'} hint="5 = mejor" />
        <Kpi label="NPS proxy" value={m.nps_aprox !== null ? `${m.nps_aprox}` : '—'} />
        <Kpi label="LTV estimado" value={fmtARS(m.ltv_estimado_ars)} hint="12m · 60% retención" />
      </div>

      <section className="gov-card">
        <h2 className="gov-card__title">Distribución por tipo de usuario</h2>
        <table className="gov-table">
          <thead>
            <tr>
              <th scope="col">Tipo</th>
              <th scope="col">Usuarios</th>
              <th scope="col">% del total</th>
            </tr>
          </thead>
          <tbody>
            <Row tipo="Docentes" count={m.usersByTipo.docente} total={m.totalUsers} />
            <Row tipo="Familias" count={m.usersByTipo.familia} total={m.totalUsers} />
            <Row tipo="Profesionales" count={m.usersByTipo.profesional} total={m.totalUsers} />
          </tbody>
        </table>
      </section>

      <section className="gov-card" style={{ marginTop: 16 }}>
        <h2 className="gov-card__title">Distribución por plan</h2>
        <table className="gov-table">
          <thead>
            <tr>
              <th scope="col">Plan</th>
              <th scope="col">Usuarios</th>
              <th scope="col">Revenue mensual</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Free</td>
              <td>{m.usersByPlan.free}</td>
              <td>—</td>
            </tr>
            <tr>
              <td>Pro</td>
              <td>{m.usersByPlan.pro}</td>
              <td>{fmtARS(m.usersByPlan.pro * 9900)}</td>
            </tr>
            <tr>
              <td>Institucional</td>
              <td>{m.usersByPlan.institucional}</td>
              <td>{fmtARS(m.usersByPlan.institucional * 29900)}</td>
            </tr>
          </tbody>
        </table>
      </section>
    </>
  )
}

function Kpi({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <article className="gov-kpi">
      <div className="gov-kpi__label">{label}</div>
      <div className="gov-kpi__value">{value}</div>
      {hint && <div style={{ color: 'var(--gov-text-muted)', fontSize: 12, marginTop: 6 }}>{hint}</div>}
    </article>
  )
}

function Row({ tipo, count, total }: { tipo: string; count: number; total: number }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0
  return (
    <tr>
      <td>{tipo}</td>
      <td>{count.toLocaleString('es-AR')}</td>
      <td>{pct}%</td>
    </tr>
  )
}

const mock = {
  totalUsers: 1842,
  usersByTipo: { docente: 1284, familia: 402, profesional: 156 },
  usersByPlan: { free: 1520, pro: 298, institucional: 24 },
  mrr_ars: 298 * 9900 + 24 * 29900,
  consultas_totales: 24180,
  consultas_30d: 6820,
  consultas_7d: 1840,
  feedback_promedio: 4.6,
  nps_aprox: 62,
  activation_rate: 74,
  avg_consultas_por_user: 13.1,
  ltv_ars: 9900 * 12 * 0.6,
}

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

export default function AdminDemoPage() {
  const m = mock
  const usdArs = 1150
  const mrrUsd = Math.round(m.mrr_ars / usdArs)

  return (
    <>
      <h1 className="gov-page-title">Métricas de negocio</h1>
      <p className="gov-page-subtitle">
        Vista admin interna — datos simulados para demo a inversores.
      </p>

      <div className="gov-kpi-grid">
        <Kpi label="MRR" value={fmtARS(m.mrr_ars)} hint={`≈ USD ${fmtNum(mrrUsd)}`} />
        <Kpi label="ARR" value={fmtARS(m.mrr_ars * 12)} />
        <Kpi label="Usuarios totales" value={fmtNum(m.totalUsers)} />
        <Kpi
          label="Pro / Institucional"
          value={`${m.usersByPlan.pro} / ${m.usersByPlan.institucional}`}
        />
        <Kpi label="Consultas totales" value={fmtNum(m.consultas_totales)} />
        <Kpi label="Consultas últimos 30d" value={fmtNum(m.consultas_30d)} />
        <Kpi label="Consultas últimos 7d" value={fmtNum(m.consultas_7d)} />
        <Kpi label="Activación" value={`${m.activation_rate}%`} />
        <Kpi label="Avg. consultas/user" value={m.avg_consultas_por_user.toFixed(2)} />
        <Kpi label="Feedback promedio" value={m.feedback_promedio.toFixed(2)} hint="5 = mejor" />
        <Kpi label="NPS proxy" value={`${m.nps_aprox}`} />
        <Kpi label="LTV estimado" value={fmtARS(m.ltv_ars)} hint="12m · 60% retención" />
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
              <td>{fmtNum(m.usersByPlan.free)}</td>
              <td>—</td>
            </tr>
            <tr>
              <td>Pro</td>
              <td>{fmtNum(m.usersByPlan.pro)}</td>
              <td>{fmtARS(m.usersByPlan.pro * 9900)}</td>
            </tr>
            <tr>
              <td>Institucional</td>
              <td>{fmtNum(m.usersByPlan.institucional)}</td>
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
      {hint && (
        <div style={{ color: 'var(--gov-text-muted)', fontSize: 12, marginTop: 6 }}>{hint}</div>
      )}
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

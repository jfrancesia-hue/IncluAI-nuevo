const DEPTOS = [
  { name: 'Capital', total: 128, active: 112 },
  { name: 'Colón', total: 62, active: 41 },
  { name: 'San Justo', total: 54, active: 28 },
  { name: 'Punilla', total: 38, active: 25 },
  { name: 'Río Cuarto', total: 46, active: 20 },
  { name: 'General San Martín', total: 32, active: 12 },
]

export default function CoberturaDemo() {
  return (
    <>
      <h1 className="gov-page-title">Cobertura territorial</h1>
      <p className="gov-page-subtitle">
        Actividad de escuelas asignadas, agrupada por departamento. Última ventana: 30 días.
      </p>

      <section className="gov-card">
        <h2 className="gov-card__title">Por departamento</h2>
        <table className="gov-table">
          <thead>
            <tr>
              <th scope="col">Departamento</th>
              <th scope="col">Escuelas asignadas</th>
              <th scope="col">Activas (30d)</th>
              <th scope="col">Cobertura</th>
              <th scope="col">Estado</th>
            </tr>
          </thead>
          <tbody>
            {DEPTOS.map((d) => {
              const pct = Math.round((d.active / d.total) * 100)
              const badge =
                pct >= 70 ? 'gov-badge--ok' : pct >= 40 ? 'gov-badge--warn' : 'gov-badge--crit'
              const label = pct >= 70 ? 'Óptimo' : pct >= 40 ? 'En riesgo' : 'Bajo'
              return (
                <tr key={d.name}>
                  <td>{d.name}</td>
                  <td>{d.total}</td>
                  <td>{d.active}</td>
                  <td>{pct}%</td>
                  <td>
                    <span className={`gov-badge ${badge}`}>{label}</span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </section>
    </>
  )
}

const NORMATIVA = [
  { label: 'Resolución CFE 311/16', score: 96, desc: 'Trayectorias educativas integrales con discapacidad.' },
  { label: 'WCAG 2.1 AA', score: 94, desc: 'Accesibilidad web — perceptible, operable, comprensible, robusto.' },
  { label: 'Ley 25.326', score: 98, desc: 'Protección de datos personales, consentimiento menores.' },
  { label: 'Ley 26.653', score: 96, desc: 'Accesibilidad sector público.' },
  { label: 'ISO 27001 (readiness)', score: 42, desc: 'Gestión seguridad — roadmap 12 meses.' },
]

export default function CumplimientoDemo() {
  return (
    <>
      <h1 className="gov-page-title">Cumplimiento normativo</h1>
      <p className="gov-page-subtitle">
        Evaluación automática contra marco normativo. Documentación de respaldo en /compliance/.
      </p>

      <section className="gov-card">
        <h2 className="gov-card__title">Checklist normativo</h2>
        <table className="gov-table">
          <thead>
            <tr>
              <th scope="col">Norma</th>
              <th scope="col">Alcance</th>
              <th scope="col">Score</th>
              <th scope="col">Estado</th>
            </tr>
          </thead>
          <tbody>
            {NORMATIVA.map((n) => {
              const badge =
                n.score >= 90 ? 'gov-badge--ok' : n.score >= 70 ? 'gov-badge--warn' : 'gov-badge--crit'
              const label = n.score >= 90 ? 'Conforme' : n.score >= 70 ? 'Parcial' : 'En roadmap'
              return (
                <tr key={n.label}>
                  <td style={{ fontWeight: 500 }}>{n.label}</td>
                  <td style={{ color: 'var(--gov-text-muted)' }}>{n.desc}</td>
                  <td>{n.score}%</td>
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

import fs from 'node:fs/promises'
import path from 'node:path'

export const dynamic = 'force-dynamic'

type EvalRun = {
  timestamp: string
  model: string
  avg_score: number
  cases: Array<{ id: string; score: number }>
}

async function latestRun(): Promise<EvalRun | null> {
  try {
    const dir = path.join(process.cwd(), 'evals', 'results')
    const files = await fs.readdir(dir)
    const runs = files.filter((f) => f.startsWith('run-') && f.endsWith('.json')).sort().reverse()
    if (runs.length === 0) return null
    const raw = await fs.readFile(path.join(dir, runs[0]), 'utf8')
    return JSON.parse(raw) as EvalRun
  } catch {
    return null
  }
}

export default async function AdminEvalsPage() {
  const run = await latestRun()

  return (
    <>
      <h1 className="gov-page-title">Evals del prompt Claude</h1>
      <p className="gov-page-subtitle">
        Resultados del último run de <code>npm run evals</code>. Dataset en <code>/evals/dataset.jsonl</code>.
      </p>

      {!run && (
        <section className="gov-card">
          <h2 className="gov-card__title">Todavía no hay runs</h2>
          <p style={{ color: 'var(--gov-text-muted)' }}>
            Corré <code>npm run evals</code> desde la raíz del proyecto para generar el primer
            reporte. Los resultados se guardan en <code>evals/results/</code>.
          </p>
        </section>
      )}

      {run && (
        <>
          <div className="gov-kpi-grid">
            <article className="gov-kpi">
              <div className="gov-kpi__label">Score promedio</div>
              <div className="gov-kpi__value">{run.avg_score.toFixed(1)}</div>
            </article>
            <article className="gov-kpi">
              <div className="gov-kpi__label">Casos evaluados</div>
              <div className="gov-kpi__value">{run.cases.length}</div>
            </article>
            <article className="gov-kpi">
              <div className="gov-kpi__label">Modelo</div>
              <div className="gov-kpi__value" style={{ fontSize: 16 }}>
                {run.model}
              </div>
            </article>
          </div>
          <section className="gov-card">
            <h2 className="gov-card__title">Detalle por caso</h2>
            <table className="gov-table">
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Score</th>
                </tr>
              </thead>
              <tbody>
                {run.cases.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <code>{c.id}</code>
                    </td>
                    <td>{c.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </>
      )}
    </>
  )
}

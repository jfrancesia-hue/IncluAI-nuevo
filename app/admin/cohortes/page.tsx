import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

type PerfilRow = { id: string; created_at: string }
type ConsultaRow = { user_id: string; created_at: string }

export default async function CohortesPage() {
  const supabase = await createClient()

  const { data: perfiles } = (await supabase
    .from('perfiles')
    .select('id, created_at')
    .order('created_at', { ascending: true })) as { data: PerfilRow[] | null }

  const { data: consultas } = (await supabase
    .from('consultas')
    .select('user_id, created_at')) as { data: ConsultaRow[] | null }

  const userActivity = new Map<string, Date[]>()
  for (const c of consultas ?? []) {
    const arr = userActivity.get(c.user_id) ?? []
    arr.push(new Date(c.created_at))
    userActivity.set(c.user_id, arr)
  }

  const cohortMap = new Map<string, { size: number; m1: number; m3: number; m6: number }>()
  for (const p of perfiles ?? []) {
    const created = new Date(p.created_at)
    const key = `${created.getUTCFullYear()}-${String(created.getUTCMonth() + 1).padStart(2, '0')}`
    const bucket = cohortMap.get(key) ?? { size: 0, m1: 0, m3: 0, m6: 0 }
    bucket.size += 1

    const activity = userActivity.get(p.id) ?? []
    const activeAt = (months: number) => {
      const windowStart = new Date(created.getTime() + (months - 1) * 30 * 24 * 60 * 60 * 1000)
      const windowEnd = new Date(windowStart.getTime() + 30 * 24 * 60 * 60 * 1000)
      return activity.some((d) => d >= windowStart && d < windowEnd)
    }
    if (activeAt(1)) bucket.m1 += 1
    if (activeAt(3)) bucket.m3 += 1
    if (activeAt(6)) bucket.m6 += 1
    cohortMap.set(key, bucket)
  }

  const cohorts = Array.from(cohortMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, b]) => ({
      cohort: key,
      size: b.size,
      m1_pct: b.size > 0 ? Math.round((b.m1 / b.size) * 100) : 0,
      m3_pct: b.size > 0 ? Math.round((b.m3 / b.size) * 100) : 0,
      m6_pct: b.size > 0 ? Math.round((b.m6 / b.size) * 100) : 0,
    }))

  return (
    <>
      <h1 className="gov-page-title">Cohortes de retención</h1>
      <p className="gov-page-subtitle">
        Usuarios agrupados por mes de alta y su actividad en M1, M3 y M6.
      </p>

      <section className="gov-card">
        <h2 className="gov-card__title">Tabla de cohortes</h2>
        <table className="gov-table">
          <thead>
            <tr>
              <th scope="col">Cohorte</th>
              <th scope="col">Tamaño</th>
              <th scope="col">M1</th>
              <th scope="col">M3</th>
              <th scope="col">M6</th>
            </tr>
          </thead>
          <tbody>
            {cohorts.length === 0 && (
              <tr>
                <td colSpan={5} style={{ color: 'var(--gov-text-muted)' }}>
                  Sin cohortes aún.
                </td>
              </tr>
            )}
            {cohorts.map((c) => (
              <tr key={c.cohort}>
                <td>
                  <code>{c.cohort}</code>
                </td>
                <td>{c.size}</td>
                <td>{c.m1_pct}%</td>
                <td>{c.m3_pct}%</td>
                <td>{c.m6_pct}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  )
}

import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

type AssignmentRow = {
  school_id: string
  jurisdiction_id: string
  schools: { cue: string | null; last_activity_at: string | null; departamento: string | null } | null
}

export default async function CoberturaPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data: govUser } = await supabase
    .from('gov_users')
    .select('jurisdiction_id, department_scope')
    .eq('user_id', user.id)
    .single()
  if (!govUser) return null

  const scope = (govUser.department_scope as string[] | null) ?? []
  let depQuery = supabase
    .from('gov_jurisdictions')
    .select('id, name')
    .eq('parent_id', govUser.jurisdiction_id)
    .eq('type', 'departamento')
    .order('name')
  if (scope.length > 0) depQuery = depQuery.in('id', scope)
  const { data: departamentos } = await depQuery

  const { data: rows } = (await supabase
    .from('gov_school_assignments')
    .select('school_id, jurisdiction_id, schools:school_id(cue, last_activity_at, departamento)')) as {
    data: AssignmentRow[] | null
  }

  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000
  const byDep = new Map<string, { total: number; active: number; name: string }>()

  for (const dep of departamentos ?? []) {
    byDep.set(dep.id as string, { total: 0, active: 0, name: dep.name as string })
  }

  for (const r of rows ?? []) {
    const agg = byDep.get(r.jurisdiction_id)
    if (!agg) continue
    agg.total += 1
    const ts = r.schools?.last_activity_at ? Date.parse(r.schools.last_activity_at) : 0
    if (ts >= thirtyDaysAgo) agg.active += 1
  }

  const cells = Array.from(byDep.entries()).map(([id, agg]) => ({
    id,
    ...agg,
    pct: agg.total > 0 ? Math.round((agg.active / agg.total) * 100) : 0,
  }))

  return (
    <>
      <h1 className="gov-page-title">Cobertura territorial</h1>
      <p className="gov-page-subtitle">
        Actividad de escuelas asignadas, agrupada por departamento. Última ventana: 30 días.
      </p>

      <section className="gov-card" aria-labelledby="tabla-cobertura">
        <h2 id="tabla-cobertura" className="gov-card__title">
          Por departamento
        </h2>
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
            {cells.length === 0 && (
              <tr>
                <td colSpan={5} style={{ color: 'var(--gov-text-muted)' }}>
                  No hay departamentos cargados en esta jurisdicción.
                </td>
              </tr>
            )}
            {cells.map((c) => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td>{c.total}</td>
                <td>{c.active}</td>
                <td>{c.pct}%</td>
                <td>
                  <span
                    className={
                      c.pct >= 70
                        ? 'gov-badge gov-badge--ok'
                        : c.pct >= 40
                          ? 'gov-badge gov-badge--warn'
                          : 'gov-badge gov-badge--crit'
                    }
                  >
                    {c.pct >= 70 ? 'Óptimo' : c.pct >= 40 ? 'En riesgo' : 'Bajo'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  )
}

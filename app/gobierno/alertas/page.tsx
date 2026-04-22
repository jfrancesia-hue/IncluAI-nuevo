import { createClient } from '@/lib/supabase/server'
import { maskCue } from '@/lib/gov/mask'
import type { EarlyWarning } from '@/lib/types/gobierno'

export const dynamic = 'force-dynamic'

export default async function AlertasPage() {
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
  let rowsQuery = supabase
    .from('gov_school_assignments')
    .select(
      'school_id, jurisdiction_id, schools:school_id(cue, last_activity_at, departamento)'
    )
  if (scope.length > 0) {
    rowsQuery = rowsQuery.in('jurisdiction_id', scope)
  } else {
    rowsQuery = rowsQuery.eq('jurisdiction_id', govUser.jurisdiction_id)
  }
  const { data: rows } = await rowsQuery

  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000
  const alerts: EarlyWarning[] = []

  for (const row of (rows ?? []) as unknown as Array<{
    school_id: string
    schools: { cue: string | null; last_activity_at: string | null; departamento: string | null } | null
  }>) {
    const last = row.schools?.last_activity_at
      ? Date.parse(row.schools.last_activity_at)
      : 0
    if (last < thirtyDaysAgo) {
      alerts.push({
        id: row.school_id,
        school_cue_masked: maskCue(row.schools?.cue ?? null),
        departamento: row.schools?.departamento ?? 'Sin asignar',
        tipo_alerta: 'escuela_inactiva',
        severidad: last === 0 ? 'alta' : 'media',
        dias_sin_actividad:
          last > 0 ? Math.floor((Date.now() - last) / (24 * 60 * 60 * 1000)) : undefined,
        descripcion: 'Escuela sin actividad en los últimos 30 días.',
      })
    }
  }

  return (
    <>
      <h1 className="gov-page-title">Alertas tempranas</h1>
      <p className="gov-page-subtitle">
        Señales agregadas para intervención preventiva. Los identificadores de escuela están
        parcialmente enmascarados — el detalle individual no es visible desde el panel gubernamental.
      </p>

      <section className="gov-card">
        <h2 className="gov-card__title">
          {alerts.length} alerta{alerts.length !== 1 ? 's' : ''} activa
          {alerts.length !== 1 ? 's' : ''}
        </h2>
        <table className="gov-table">
          <thead>
            <tr>
              <th scope="col">CUE (enmasc.)</th>
              <th scope="col">Departamento</th>
              <th scope="col">Tipo</th>
              <th scope="col">Severidad</th>
              <th scope="col">Días sin actividad</th>
            </tr>
          </thead>
          <tbody>
            {alerts.length === 0 && (
              <tr>
                <td colSpan={5} style={{ color: 'var(--gov-text-muted)' }}>
                  Sin alertas. Todas las escuelas asignadas están activas.
                </td>
              </tr>
            )}
            {alerts.map((a) => (
              <tr key={a.id}>
                <td>
                  <code>{a.school_cue_masked}</code>
                </td>
                <td>{a.departamento}</td>
                <td>{a.tipo_alerta.replace(/_/g, ' ')}</td>
                <td>
                  <span
                    className={
                      a.severidad === 'alta'
                        ? 'gov-badge gov-badge--crit'
                        : a.severidad === 'media'
                          ? 'gov-badge gov-badge--warn'
                          : 'gov-badge gov-badge--ok'
                    }
                  >
                    {a.severidad}
                  </span>
                </td>
                <td>{a.dias_sin_actividad ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  )
}

import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function AuditoriaPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data: govUser } = await supabase
    .from('gov_users')
    .select('id')
    .eq('user_id', user.id)
    .single()
  if (!govUser) return null

  const { data: entries } = await supabase
    .from('gov_audit_log')
    .select('id, action, resource_type, resource_id, ip_address, occurred_at')
    .eq('gov_user_id', govUser.id)
    .order('occurred_at', { ascending: false })
    .limit(200)

  return (
    <>
      <h1 className="gov-page-title">Auditoría — Mis acciones</h1>
      <p className="gov-page-subtitle">
        Transparencia completa: cada consulta que hacés al panel queda registrada de forma
        inmutable. Este log es tuyo; otras personas con acceso gubernamental no pueden verlo.
      </p>

      <section className="gov-card">
        <h2 className="gov-card__title">Últimas 200 acciones</h2>
        <table className="gov-table">
          <thead>
            <tr>
              <th scope="col">Fecha</th>
              <th scope="col">Acción</th>
              <th scope="col">Recurso</th>
              <th scope="col">IP</th>
            </tr>
          </thead>
          <tbody>
            {(entries ?? []).length === 0 && (
              <tr>
                <td colSpan={4} style={{ color: 'var(--gov-text-muted)' }}>
                  Sin registros aún.
                </td>
              </tr>
            )}
            {(entries ?? []).map((e) => (
              <tr key={e.id}>
                <td>
                  <time dateTime={e.occurred_at}>
                    {new Date(e.occurred_at).toLocaleString('es-AR')}
                  </time>
                </td>
                <td>
                  <code>{e.action}</code>
                </td>
                <td style={{ color: 'var(--gov-text-muted)' }}>
                  {e.resource_type ?? '—'}
                </td>
                <td style={{ color: 'var(--gov-text-muted)' }}>{e.ip_address ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  )
}

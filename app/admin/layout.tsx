import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { ReactNode } from 'react'

export const metadata = {
  title: 'IncluIA · Admin métricas',
  robots: { index: false, follow: false },
}

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login?next=/admin')

  const { data: perfil } = await supabase
    .from('perfiles')
    .select('rol, tipo_usuario, email')
    .eq('id', user.id)
    .single()

  if (perfil?.rol !== 'admin') redirect('/')

  return (
    <div className="gov-theme">
      <div className="gov-shell">
        <aside className="gov-sidebar" aria-label="Admin navegación">
          <div className="gov-cobranding">
            <div className="gov-cobranding__prov" aria-hidden="true">
              IA
            </div>
            <div className="gov-cobranding__app">
              IncluIA<span className="gov-cobranding__sep">·</span>Admin
            </div>
          </div>
          <nav className="gov-nav">
            <Link className="gov-nav__link" href="/admin">
              Métricas de negocio
            </Link>
            <Link className="gov-nav__link" href="/admin/cohortes">
              Cohortes
            </Link>
            <Link className="gov-nav__link" href="/admin/evals">
              Evals IA
            </Link>
          </nav>
          <div style={{ marginTop: 'auto', fontSize: 12, color: 'var(--gov-text-muted)' }}>
            {perfil?.email}
          </div>
        </aside>
        <main className="gov-main" role="main">
          {children}
        </main>
      </div>
    </div>
  )
}

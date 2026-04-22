import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'
import '../(gobierno)/globals-gov.css'

export const metadata = {
  title: 'IncluIA · Admin (DEMO)',
  robots: { index: false, follow: false },
}

export default function AdminDemoLayout({ children }: { children: ReactNode }) {
  if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_ENABLE_DEMO !== '1') {
    notFound()
  }
  return (
    <div className="gov-theme">
      <div className="gov-shell">
        <aside className="gov-sidebar" aria-label="Admin navegación">
          <div className="gov-cobranding">
            <div className="gov-cobranding__prov" aria-hidden="true">IA</div>
            <div className="gov-cobranding__app">
              IncluIA<span className="gov-cobranding__sep">·</span>Admin
            </div>
          </div>
          <nav className="gov-nav">
            <Link className="gov-nav__link" href="/admin-demo">
              Métricas de negocio
            </Link>
          </nav>
        </aside>
        <main className="gov-main" role="main">{children}</main>
      </div>
    </div>
  )
}

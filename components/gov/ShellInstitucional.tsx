import Link from 'next/link'
import type { ReactNode } from 'react'

type NavItem = {
  href: string
  label: string
  icon?: string
}

const NAV: NavItem[] = [
  { href: '/gobierno', label: 'Dashboard' },
  { href: '/gobierno/cobertura', label: 'Cobertura' },
  { href: '/gobierno/impacto', label: 'Impacto' },
  { href: '/gobierno/cumplimiento', label: 'Cumplimiento' },
  { href: '/gobierno/alertas', label: 'Alertas tempranas' },
  { href: '/gobierno/reportes', label: 'Reportes' },
  { href: '/gobierno/auditoria', label: 'Auditoría' },
]

export function ShellInstitucional({
  jurisdictionName,
  activePath,
  children,
}: {
  jurisdictionName: string
  activePath: string
  children: ReactNode
}) {
  return (
    <div className="gov-theme">
      <div className="gov-shell">
        <aside className="gov-sidebar" aria-label="Navegación gubernamental">
          <div className="gov-cobranding">
            <div className="gov-cobranding__prov" aria-hidden="true">
              {jurisdictionName.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="gov-cobranding__app">
                {jurisdictionName}
                <span className="gov-cobranding__sep">·</span>
                IncluAI
              </div>
            </div>
          </div>

          <nav className="gov-nav" aria-label="Secciones">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="gov-nav__link"
                aria-current={item.href === activePath ? 'page' : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="gov-main" role="main">
          {children}
        </main>
      </div>
    </div>
  )
}

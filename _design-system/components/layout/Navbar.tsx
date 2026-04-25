'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogoLockup } from '../branding/LogoLockup';

/**
 * Template de navbar sticky con gradient, active state animado y mobile
 * tabs debajo del header. Personalizá los NAV_LINKS y pasá props si querés
 * avatar + plan badges.
 *
 * Setup:
 * - Asegurate de tener las CSS vars --navbar-* en tu globals.css
 * - Para active state usa usePathname — necesita 'use client'
 */

interface Props {
  /** Links principales de la navegación */
  links?: Array<{ href: string; label: string }>;
  /** Contenido opcional a la derecha (avatar, plan badge, etc) */
  rightSlot?: React.ReactNode;
}

const DEFAULT_LINKS = [
  { href: '/inicio', label: 'Inicio' },
  { href: '/historial', label: 'Historial' },
  { href: '/recursos', label: 'Recursos' },
];

function isActive(pathname: string, href: string, rootPath: string): boolean {
  if (href === rootPath) return pathname === rootPath;
  return pathname.startsWith(href);
}

export function Navbar({ links = DEFAULT_LINKS, rightSlot }: Props) {
  const pathname = usePathname();
  const rootPath = links[0]?.href ?? '/';

  return (
    <header
      className="sticky top-0 z-30 border-b backdrop-blur-2xl"
      style={{
        background:
          'linear-gradient(90deg, var(--navbar-bg-1) 0%, var(--navbar-bg-2) 35%, var(--navbar-bg-3) 65%, var(--navbar-bg-4) 100%)',
        borderBottomColor: 'var(--navbar-border)',
        boxShadow: 'var(--navbar-shadow)',
      }}
    >
      {/* Hairline brillante debajo del border */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -bottom-px h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgba(255,255,255,0.5) 30%, rgba(255,255,255,0.6) 70%, transparent)',
        }}
      />
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <LogoLockup href={rootPath} size="md" tone="light" />

        <nav
          aria-label="Navegación principal"
          className="hidden items-center gap-1 md:flex"
        >
          {links.map((link) => {
            const active = isActive(pathname, link.href, rootPath);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? 'page' : undefined}
                className="relative rounded-[10px] px-3 py-2 text-sm font-bold transition"
                style={{
                  fontFamily: 'var(--font-display)',
                  letterSpacing: '-0.005em',
                  color: active
                    ? 'var(--navbar-text-active)'
                    : 'var(--navbar-text)',
                  background: active
                    ? 'var(--navbar-active-bg)'
                    : 'transparent',
                  textShadow: active
                    ? '0 1px 2px rgba(0, 0, 0, 0.3)'
                    : undefined,
                }}
              >
                {link.label}
                {active && (
                  <span
                    aria-hidden
                    className="absolute -bottom-[9px] left-1/2 h-[3px] w-8 -translate-x-1/2 rounded-full"
                    style={{
                      background: 'white',
                      boxShadow:
                        '0 0 12px rgba(255,255,255,0.8), 0 0 4px rgba(194,65,12,0.3)',
                    }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">{rightSlot}</div>
      </div>

      {/* Mobile tabs */}
      <nav
        aria-label="Navegación móvil"
        className="flex items-center justify-around border-t border-white/20 px-2 py-1.5 md:hidden"
        style={{
          background: 'rgba(0, 0, 0, 0.08)',
          backdropFilter: 'blur(12px)',
        }}
      >
        {links.map((link) => {
          const active = isActive(pathname, link.href, rootPath);
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={active ? 'page' : undefined}
              className="rounded-[10px] px-3 py-1.5 text-xs font-bold transition"
              style={{
                fontFamily: 'var(--font-display)',
                color: active
                  ? 'var(--navbar-text-active)'
                  : 'var(--navbar-text)',
                background: active
                  ? 'var(--navbar-active-bg)'
                  : 'transparent',
              }}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}

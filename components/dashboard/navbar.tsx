'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOutAction } from '@/app/(dashboard)/actions';
import type { Perfil } from '@/lib/types';
import { ThemeToggle } from '@/components/theme-toggle';
import { LogoLockup } from '@/components/branding/LogoLockup';

const TIPO_META: Record<
  'docente' | 'familia' | 'profesional',
  { icon: string; label: string; color: string; bg: string }
> = {
  docente: {
    icon: '📚',
    label: 'Docente',
    color: '#1F5F8A',
    bg: '#D7EAF6',
  },
  familia: {
    icon: '🏠',
    label: 'Familia',
    color: '#1e8449',
    bg: '#D6F0E0',
  },
  profesional: {
    icon: '⚕️',
    label: 'Profesional',
    color: '#6C3483',
    bg: '#EDE3F6',
  },
};

const NAV_LINKS: Array<{ href: string; label: string }> = [
  { href: '/inicio', label: 'Inicio' },
  { href: '/historial', label: 'Historial' },
  { href: '/recursos', label: 'Recursos' },
  { href: '/planes', label: 'Planes' },
];

function isActive(pathname: string, href: string): boolean {
  if (href === '/inicio') return pathname === '/inicio';
  return pathname.startsWith(href);
}

export function Navbar({ perfil }: { perfil: Perfil }) {
  const pathname = usePathname();
  const iniciales = `${perfil.nombre[0] ?? ''}${
    perfil.apellido[0] ?? ''
  }`.toUpperCase();
  const esPago = perfil.plan !== 'free';
  const tipo = TIPO_META[perfil.tipo_usuario] ?? TIPO_META.docente;
  const nombrePlan =
    perfil.plan === 'free'
      ? 'Gratuito'
      : perfil.plan === 'basico'
        ? 'Básico ✓'
        : perfil.plan === 'profesional'
          ? 'Profesional ✓'
          : 'Premium ✓';

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
        <LogoLockup href="/inicio" size="md" tone="light" />

        <nav
          aria-label="Navegación principal"
          className="hidden items-center gap-1 md:flex"
        >
          {NAV_LINKS.map((link) => {
            const active = isActive(pathname, link.href);
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

        <div className="flex items-center gap-2 sm:gap-3">
          <span
            className="hidden items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold sm:inline-flex"
            style={{
              fontFamily: 'var(--font-display)',
              color: tipo.color,
              background: tipo.bg,
              letterSpacing: '0.02em',
            }}
          >
            <span aria-hidden>{tipo.icon}</span> {tipo.label}
          </span>
          <span
            className="hidden rounded-full px-2.5 py-1 text-xs font-semibold sm:inline-flex"
            style={{
              fontFamily: 'var(--font-display)',
              letterSpacing: '0.02em',
              color: esPago ? '#0d7c3a' : '#1F5F8A',
              background: esPago ? '#D6F0E0' : '#D7EAF6',
            }}
          >
            {nombrePlan}
          </span>
          <Link
            href="/perfil"
            aria-current={pathname.startsWith('/perfil') ? 'page' : undefined}
            className="flex items-center gap-2 rounded-full border px-1.5 py-1 text-sm transition"
            style={{
              background: 'var(--navbar-pill-bg)',
              borderColor: 'var(--navbar-pill-border)',
            }}
          >
            <span
              aria-hidden
              className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#27AE60] to-[#2E86C1] text-xs font-bold text-white"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {iniciales || '·'}
            </span>
            <span
              className="hidden max-w-[100px] truncate pr-2 font-semibold md:inline"
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--navbar-pill-text)',
              }}
            >
              {perfil.nombre}
            </span>
          </Link>
          <ThemeToggle />
          <form action={signOutAction}>
            <button
              type="submit"
              className="text-xs font-bold transition"
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--navbar-text)',
              }}
            >
              Salir
            </button>
          </form>
        </div>
      </div>

      {/* Mobile nav: tabs abajo del header en mobile */}
      <nav
        aria-label="Navegación principal móvil"
        className="flex items-center justify-around border-t border-white/20 px-2 py-1.5 md:hidden"
        style={{
          background: 'rgba(0, 0, 0, 0.08)',
          backdropFilter: 'blur(12px)',
        }}
      >
        {NAV_LINKS.map((link) => {
          const active = isActive(pathname, link.href);
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

import type { ReactNode } from 'react';
import { LogoLockup } from '../branding/LogoLockup';

interface Props {
  /** Lado izquierdo: el form */
  children: ReactNode;
  /** Título del lado decorativo derecho */
  asideTitle?: ReactNode;
  /** Bullets de valor del aside */
  asideBullets?: string[];
  /** Stats inline abajo del aside (ej: "500+ usuarios") */
  asideStats?: string[];
  /** Si true, oculta el aside (para verificar-email, errores) */
  fullWidth?: boolean;
}

/**
 * Layout estandarizado para páginas auth (login, registro, verificar-email).
 * 2 cols en desktop: form a la izq + aside decorativo mesh a la der.
 * En mobile solo el form ocupa todo el ancho.
 */
export function AuthShell({
  children,
  asideTitle,
  asideBullets,
  asideStats,
  fullWidth = false,
}: Props) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Lado del form */}
      <div className="flex flex-col items-center justify-center bg-[var(--surface-subtle)] px-5 py-12 sm:px-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <LogoLockup href="/" size="md" tone="light" />
          </div>
          {children}
        </div>
      </div>

      {/* Lado decorativo */}
      {!fullWidth && (
        <aside
          className="relative hidden overflow-hidden lg:flex lg:flex-col lg:justify-center"
          style={{
            background:
              'linear-gradient(135deg, #061b34 0%, #0f2240 35%, #0e4f68 100%)',
          }}
        >
          {/* Mesh orbes */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{ filter: 'blur(70px)', opacity: 0.5 }}
          >
            <div
              style={{
                position: 'absolute',
                top: '0%',
                left: '0%',
                width: '60%',
                height: '60%',
                background:
                  'radial-gradient(circle, rgba(46,134,193,0.7), transparent 60%)',
                animation: 'mesh-orb-1 20s ease-in-out infinite',
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '-10%',
                right: '-5%',
                width: '60%',
                height: '70%',
                background:
                  'radial-gradient(circle, rgba(39,174,96,0.55), transparent 60%)',
                animation: 'mesh-orb-2 24s ease-in-out infinite',
              }}
            />
          </div>

          <div className="relative z-10 px-12 py-16 text-white">
            <LogoLockup
              size="md"
              tone="dark"
              logoVariant="white"
              gradientId="auth-aside-logo"
            />

            <h2
              className="mt-6 text-4xl font-extrabold lg:text-5xl"
              style={{
                fontFamily: 'var(--font-display)',
                letterSpacing: '-0.03em',
                lineHeight: 1.05,
              }}
            >
              {asideTitle}
            </h2>

            {asideBullets && asideBullets.length > 0 && (
              <ul className="mt-8 flex flex-col gap-4">
                {asideBullets.map((b) => (
                  <li
                    key={b}
                    className="flex items-start gap-3 text-base text-white/85"
                  >
                    <span
                      aria-hidden
                      className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-xs font-bold text-white"
                    >
                      ✓
                    </span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            )}

            {asideStats && asideStats.length > 0 && (
              <div className="mt-10 flex items-center gap-4 border-t border-white/10 pt-6 text-xs text-white/60">
                {asideStats.map((s, i) => (
                  <span key={s} className="flex items-center gap-3">
                    {i > 0 && <span aria-hidden>·</span>}
                    {s}
                  </span>
                ))}
              </div>
            )}
          </div>
        </aside>
      )}
    </div>
  );
}

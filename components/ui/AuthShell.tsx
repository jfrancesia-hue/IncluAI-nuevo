import type { ReactNode } from 'react';
import { LogoLockup } from '@/components/branding/LogoLockup';

interface Props {
  /** Lado izquierdo: el form */
  children: ReactNode;
  /** Título del lado decorativo */
  asideTitle?: ReactNode;
  /** Bullets/highlights del lado decorativo */
  asideBullets?: string[];
  /** Si true, esconde el aside decorativo (verificar-email) */
  fullWidth?: boolean;
}

/**
 * Layout estandarizado para páginas auth. Lado izquierdo: form simple.
 * Lado derecho: panel con mesh gradient + bullets de valor.
 * En mobile el aside no aparece — solo logo + form.
 */
export function AuthShell({
  children,
  asideTitle,
  asideBullets,
  fullWidth = false,
}: Props) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Lado del form */}
      <div className="flex flex-col items-center justify-center bg-[#FBF8F2] px-5 py-12 sm:px-8">
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
          {/* Mesh orbes — más sutiles que en landing */}
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
              {asideTitle ?? (
                <>
                  Educación inclusiva,{' '}
                  <span className="gradient-text">hecha en Argentina.</span>
                </>
              )}
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
                      className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#27AE60] text-xs font-bold text-white"
                    >
                      ✓
                    </span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-10 flex items-center gap-4 border-t border-white/10 pt-6 text-xs text-white/60">
              <span>500+ docentes</span>
              <span aria-hidden>·</span>
              <span>8 provincias</span>
              <span aria-hidden>·</span>
              <span>1.2k+ guías</span>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}

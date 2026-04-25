import Link from 'next/link';
import { LogoLockup } from '@/components/branding/LogoLockup';

interface Props {
  /**
   * 'full' = 5 columnas con redes, contacto y links — landing y páginas marketing
   * 'compact' = una sola fila con copyright + links esenciales — dashboard
   */
  variant?: 'full' | 'compact';
}

export function Footer({ variant = 'full' }: Props) {
  if (variant === 'compact') {
    return (
      <footer className="relative mt-16 border-t border-[rgba(31,46,61,0.08)] bg-white/40 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-4 py-6 text-xs sm:flex-row sm:items-center sm:px-6">
          <div
            className="flex items-center gap-3 text-[#3d4a5a]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            <LogoLockup size="sm" tone="light" gradientId="footer-compact-logo" />
            <span className="hidden text-[#4A5968] sm:inline">·</span>
            <span className="text-[#4A5968]">© 2026 Nativos Consultora</span>
          </div>

          <nav
            className="flex flex-wrap gap-x-5 gap-y-2 text-[#4A5968]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            <Link href="/sobre-nosotros" className="hover:text-[#2E86C1]">
              Nosotros
            </Link>
            <Link href="/recursos" className="hover:text-[#2E86C1]">
              Recursos
            </Link>
            <Link href="/status" className="hover:text-[#2E86C1]">
              Estado
            </Link>
            <Link href="/terminos" className="hover:text-[#2E86C1]">
              Términos
            </Link>
            <Link href="/privacidad" className="hover:text-[#2E86C1]">
              Privacidad
            </Link>
            <a
              href="mailto:contacto@nativosconsultora.com.ar"
              className="hover:text-[#27AE60]"
            >
              Contacto
            </a>
          </nav>
        </div>
      </footer>
    );
  }

  // variant === 'full' — landing y páginas marketing
  return (
    <footer className="bg-[#0a1a30] pb-[env(safe-area-inset-bottom)] text-white">
      <div className="mx-auto max-w-7xl px-5 pb-20 pt-14 sm:px-8 sm:pb-16 sm:pt-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-8">
          <div className="lg:col-span-2">
            <LogoLockup
              size="lg"
              tone="dark"
              logoVariant="white"
              gradientId="footer-full-logo"
            />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/75">
              Inteligencia artificial especializada en educación inclusiva.
              Guías pedagógicas concretas, estrategias basadas en evidencia y
              evaluaciones justas — pensadas para cada alumno de Argentina.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <p
                className="text-xs font-semibold uppercase tracking-[0.08em] text-white/60"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Próximamente en redes
              </p>
              <div className="flex gap-3" aria-hidden>
                <SocialPlaceholder label="Instagram" icon="📷" />
                <SocialPlaceholder label="LinkedIn" icon="in" />
                <SocialPlaceholder label="YouTube" icon="▶" />
                <SocialPlaceholder label="Twitter / X" icon="✖" />
              </div>
            </div>
          </div>

          <FooterColumn title="Producto">
            <FooterLink href="/registro">Crear cuenta</FooterLink>
            <FooterLink href="/login">Iniciar sesión</FooterLink>
            <FooterLink href="/#pricing">Planes y precios</FooterLink>
            <FooterLink href="/recursos">Recursos</FooterLink>
            <FooterLink href="/status">Estado del servicio</FooterLink>
          </FooterColumn>

          <FooterColumn title="Nosotros">
            <FooterLink href="/sobre-nosotros">Sobre IncluAI</FooterLink>
            <FooterLink href="/mision">Nuestra misión</FooterLink>
            <FooterLink href="/blog">Blog</FooterLink>
            <FooterLink href="/prensa">Prensa</FooterLink>
          </FooterColumn>

          <FooterColumn title="Contacto">
            <li className="text-sm text-white/75">
              <a
                href="mailto:contacto@nativosconsultora.com.ar"
                className="hover:text-[#27AE60]"
              >
                contacto@nativosconsultora.com.ar
              </a>
            </li>
            <li className="text-sm text-white/75">
              <a href="tel:+543813005807" className="hover:text-[#27AE60]">
                +54 381 300 5807
              </a>
            </li>
            <li className="text-sm text-white/75">
              San Fernando del Valle de Catamarca, Argentina
            </li>
          </FooterColumn>
        </div>

        <div className="mt-10 border-t border-white/10 pt-5">
          <div className="flex flex-col gap-4 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-1 sm:flex-row sm:gap-5">
              <span>© 2026 IncluAI. Todos los derechos reservados.</span>
              <span className="hidden sm:inline" aria-hidden>·</span>
              <span>
                Hecho con <span className="text-[#f87171]">❤️</span> en
                Argentina 🇦🇷
              </span>
            </div>
            <nav aria-label="Enlaces legales" className="flex gap-5">
              <Link href="/terminos" className="hover:text-white">
                Términos de uso
              </Link>
              <Link href="/privacidad" className="hover:text-white">
                Privacidad
              </Link>
              <Link href="/cookies" className="hover:text-white">
                Cookies
              </Link>
            </nav>
          </div>
          <p className="mt-4 text-[11px] text-white/75">
            IncluAI es un producto de{' '}
            <strong>Nativos Consultora Digital</strong> · Catamarca, Argentina
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3
        className="text-sm font-bold uppercase tracking-[0.08em] text-white"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {title}
      </h3>
      <ul className="mt-4 flex flex-col gap-2.5">{children}</ul>
    </div>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        className="text-sm text-white/75 transition hover:text-[#27AE60]"
      >
        {children}
      </Link>
    </li>
  );
}

function SocialPlaceholder({ label, icon }: { label: string; icon: string }) {
  return (
    <span
      role="img"
      aria-label={`${label} — próximamente`}
      title={`${label} — próximamente`}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-dashed border-white/20 bg-white/5 text-sm text-white/45"
    >
      <span aria-hidden>{icon}</span>
    </span>
  );
}

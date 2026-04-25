import Link from 'next/link';
import type { ReactNode } from 'react';
import { LogoLockup } from '@/components/branding/LogoLockup';

export default function InfoLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FBF8F2] text-[#1F2E3D]">
      {/* Navbar minimalista */}
      <header className="sticky top-0 z-30 border-b border-white/20 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <LogoLockup href="/" size="md" tone="light" gradientId="info-logo" />
          <nav className="flex gap-5 text-sm text-[#4A5968]">
            <Link
              href="/sobre-nosotros"
              className="hover:text-[#2E86C1]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Nosotros
            </Link>
            <Link
              href="/mision"
              className="hover:text-[#2E86C1]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Misión
            </Link>
            <Link
              href="/blog"
              className="hover:text-[#2E86C1]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Blog
            </Link>
            <Link
              href="/registro"
              className="hidden rounded-[10px] bg-[#27AE60] px-4 py-1.5 font-bold text-white hover:bg-[#0d7c3a] sm:inline-flex"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Probar gratis
            </Link>
          </nav>
        </div>
      </header>

      <main className="relative mx-auto max-w-4xl px-6 py-16 sm:py-20">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[300px]"
          style={{
            background:
              'radial-gradient(70% 60% at 50% 0%, rgba(46,134,193,0.08), transparent 70%)',
          }}
        />
        {children}
      </main>

      <footer className="border-t border-[rgba(31,46,61,0.08)] bg-white py-10">
        <div className="mx-auto max-w-4xl px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <LogoLockup href="/" size="sm" tone="light" gradientId="info-footer-logo" />
            </div>
            <nav
              className="flex flex-wrap gap-5 text-sm text-[#4A5968]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              <Link href="/" className="hover:text-[#2E86C1]">
                Home
              </Link>
              <Link href="#pricing" className="hover:text-[#2E86C1]">
                Planes
              </Link>
              <Link href="/recursos" className="hover:text-[#2E86C1]">
                Recursos
              </Link>
              <Link href="/terminos" className="hover:text-[#2E86C1]">
                Términos
              </Link>
              <Link href="/privacidad" className="hover:text-[#2E86C1]">
                Privacidad
              </Link>
              <Link href="/cookies" className="hover:text-[#2E86C1]">
                Cookies
              </Link>
            </nav>
          </div>
          <p className="mt-6 text-xs text-[#4A5968]">
            IncluAI es un producto de{' '}
            <strong>Nativos Consultora Digital</strong> · Catamarca, Argentina
            · © 2026
          </p>
        </div>
      </footer>
    </div>
  );
}

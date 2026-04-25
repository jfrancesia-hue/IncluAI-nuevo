import Link from 'next/link';
import type { ReactNode } from 'react';
import { LogoLockup } from '@/components/branding/LogoLockup';

export default function LegalLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FBF8F2] text-[#1F2E3D]">
      <header className="sticky top-0 z-30 border-b border-white/20 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <LogoLockup href="/" size="md" tone="light" gradientId="legal-logo" />
          <nav className="flex gap-5 text-sm text-[#4A5968]">
            <Link
              href="/terminos"
              className="hover:text-[#2E86C1]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Términos
            </Link>
            <Link
              href="/privacidad"
              className="hover:text-[#2E86C1]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Privacidad
            </Link>
            <Link
              href="/cookies"
              className="hover:text-[#2E86C1]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Cookies
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

      <footer className="border-t border-[rgba(31,46,61,0.08)] py-8">
        <div className="mx-auto max-w-4xl px-6 text-sm text-[#4A5968]">
          <p>
            IncluAI es un producto de{' '}
            <strong>Nativos Consultora Digital</strong> · Catamarca, Argentina ·
            © 2026
          </p>
          <p className="mt-2">
            Consultas legales:{' '}
            <a
              href="mailto:legales@nativosconsultora.com"
              className="font-semibold text-[#2E86C1] hover:underline"
            >
              legales@nativosconsultora.com
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

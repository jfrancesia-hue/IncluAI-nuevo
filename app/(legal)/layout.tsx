import Link from 'next/link';
import type { ReactNode } from 'react';

export default function LegalLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FBF8F2] text-[#1F2E3D]">
      <header className="border-b border-[rgba(31,46,61,0.08)] bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            IncluAI
          </Link>
          <nav className="flex gap-5 text-sm text-[#4A5968]">
            <Link href="/terminos" className="hover:text-[#1F2E3D]">
              Términos
            </Link>
            <Link href="/privacidad" className="hover:text-[#1F2E3D]">
              Privacidad
            </Link>
            <Link href="/cookies" className="hover:text-[#1F2E3D]">
              Cookies
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-12 sm:py-16">{children}</main>

      <footer className="border-t border-[rgba(31,46,61,0.08)] py-8">
        <div className="mx-auto max-w-4xl px-6 text-sm text-[#4A5968]">
          <p>
            IncluAI es un producto de <strong>Nativos Consultora Digital</strong> · Catamarca,
            Argentina · © 2026
          </p>
          <p className="mt-2">
            Consultas legales:{' '}
            <a
              href="mailto:legales@nativosconsultora.com"
              className="underline hover:text-[#1F2E3D]"
            >
              legales@nativosconsultora.com
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

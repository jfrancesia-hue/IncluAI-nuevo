import Link from 'next/link';
import { AuthShell } from '@/components/ui/AuthShell';

export const metadata = {
  title: 'Verificá tu email · IncluAI',
};

export default function VerificarEmailPage() {
  return (
    <AuthShell fullWidth>
      <div className="flex flex-col items-center text-center">
        <div
          className="flex h-20 w-20 items-center justify-center rounded-full bg-[#D7EAF6] text-4xl text-[#2E86C1]"
          style={{ animation: 'glow-pulse 3s ease-in-out infinite' }}
        >
          📬
        </div>
        <h1
          className="mt-6 text-3xl font-bold text-[#1F2E3D] sm:text-4xl"
          style={{
            fontFamily: 'var(--font-display)',
            letterSpacing: '-0.025em',
            lineHeight: 1.1,
          }}
        >
          Revisá tu email
        </h1>
        <p
          className="mt-3 text-base text-[#4A5968]"
          style={{ lineHeight: 1.65 }}
        >
          Te enviamos un correo con un link para confirmar tu cuenta. Hacé clic
          en el link y te llevamos al inicio.
        </p>
        <div className="mt-6 w-full rounded-[16px] border border-[#e2e8f0] bg-white p-5 text-left text-sm text-[#4A5968]">
          <p className="flex items-start gap-2">
            <span aria-hidden>💡</span>
            <span>
              ¿No lo ves? Revisá la carpeta de <strong>Spam</strong> o{' '}
              <strong>Promociones</strong>. El email viene de{' '}
              <code className="rounded bg-[#FBF8F2] px-1.5 py-0.5 text-xs">
                noreply@incluai.com.ar
              </code>
            </span>
          </p>
        </div>
        <Link
          href="/login"
          className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#2E86C1] hover:underline"
        >
          ← Volver al login
        </Link>
      </div>
    </AuthShell>
  );
}

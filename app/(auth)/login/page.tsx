import { Suspense } from 'react';
import Link from 'next/link';
import { AuthShell } from '@/components/ui/AuthShell';
import { LoginForm } from './login-form';

export const metadata = {
  title: 'Iniciá sesión · IncluAI',
};

export default function LoginPage() {
  return (
    <AuthShell
      asideTitle={
        <>
          ¡Qué bueno{' '}
          <span className="gradient-text">verte de nuevo!</span>
        </>
      }
      asideBullets={[
        'Tus guías y favoritos te esperan exactamente como las dejaste',
        'IA Claude Opus 4.7 disponible en plan Premium',
        'WCAG 2.1 AA, Ley 27.306, datos en Argentina',
      ]}
    >
      <h1
        className="text-3xl font-bold text-[#1F2E3D] sm:text-4xl"
        style={{
          fontFamily: 'var(--font-display)',
          letterSpacing: '-0.025em',
          lineHeight: 1.1,
        }}
      >
        Ingresá a tu cuenta
      </h1>
      <p className="mt-2 text-base text-[#4A5968]" style={{ lineHeight: 1.6 }}>
        Seguí planificando clases inclusivas.
      </p>
      <div className="mt-8">
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
      <p className="mt-8 text-sm text-[#4A5968]">
        ¿Todavía no tenés cuenta?{' '}
        <Link
          href="/registro"
          className="font-semibold text-[#2E86C1] hover:underline"
        >
          Creá una gratis
        </Link>
      </p>
    </AuthShell>
  );
}

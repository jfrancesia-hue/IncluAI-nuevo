import Link from 'next/link';
import { AuthShell } from '@/components/ui/AuthShell';
import { RegistroForm } from './registro-form';

export const metadata = {
  title: 'Unite a la comunidad · IncluAI',
};

export default function RegistroPage() {
  return (
    <AuthShell
      asideTitle={
        <>
          Educación inclusiva,{' '}
          <span className="gradient-text">hecha en Argentina.</span>
        </>
      }
      asideBullets={[
        '1 guía gratis por mes, para siempre — sin tarjeta',
        'Estrategias DUA, materiales adaptados, evaluaciones diferenciadas',
        'Respuestas en español rioplatense, citas a CFE 311/16',
        'Imprimibles para PPI con firma',
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
        Creá tu cuenta gratis
      </h1>
      <p className="mt-2 text-base text-[#4A5968]" style={{ lineHeight: 1.6 }}>
        30 segundos. Sin tarjeta. Empezá a generar guías ya.
      </p>
      <div className="mt-8">
        <RegistroForm />
      </div>
      <p className="mt-8 text-sm text-[#4A5968]">
        ¿Ya tenés cuenta?{' '}
        <Link
          href="/login"
          className="font-semibold text-[#2E86C1] hover:underline"
        >
          Iniciá sesión
        </Link>
      </p>
    </AuthShell>
  );
}

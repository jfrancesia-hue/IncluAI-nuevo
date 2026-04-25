import type { ReactNode } from 'react';
import { RevealOnScroll } from '@/components/landing/RevealOnScroll';

interface Props {
  /** Eyebrow/kicker arriba del título (ej: "DASHBOARD") */
  eyebrow?: string;
  /** Título principal de la página */
  title: ReactNode;
  /** Subtítulo descriptivo opcional */
  subtitle?: ReactNode;
  /** Acción principal (CTA) que va a la derecha del header */
  action?: ReactNode;
  /** Decoración de fondo opcional ('mesh' agrega orbes blur sutiles) */
  decoration?: 'none' | 'mesh' | 'soft';
  /** Color tema del eyebrow y los acentos: docentes/familias/profesionales/neutro */
  tone?: 'docentes' | 'familias' | 'profesionales' | 'neutro';
  /** Contenido principal */
  children: ReactNode;
  /** Si false, no envuelve children en RevealOnScroll (útil para páginas con sus propios reveals) */
  revealChildren?: boolean;
}

const TONES = {
  docentes: { color: '#2E86C1', bg: '#D7EAF6', dark: '#1F5F8A' },
  familias: { color: '#27AE60', bg: '#D6F0E0', dark: '#1E8449' },
  profesionales: { color: '#A569BD', bg: '#EDE3F6', dark: '#6C3483' },
  neutro: { color: '#4A5968', bg: '#F2ECE0', dark: '#1F2E3D' },
};

/**
 * Wrapper estandarizado para páginas internas (dashboard, ppi, gov, admin).
 * Provee header consistente con eyebrow + título + acción + subtítulo, y
 * opcional decoración de fondo (mesh blur sutil estilo Linear).
 */
export function PageShell({
  eyebrow,
  title,
  subtitle,
  action,
  decoration = 'soft',
  tone = 'docentes',
  children,
  revealChildren = true,
}: Props) {
  const t = TONES[tone];
  return (
    <div className="relative">
      {decoration === 'mesh' && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] overflow-hidden"
          style={{ filter: 'blur(60px)', opacity: 0.35 }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-15%',
              left: '-5%',
              width: '50%',
              height: '70%',
              background: `radial-gradient(circle, ${t.color}66, transparent 60%)`,
              animation: 'mesh-orb-1 20s ease-in-out infinite',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '10%',
              right: '-10%',
              width: '55%',
              height: '70%',
              background: `radial-gradient(circle, ${t.bg}cc, transparent 60%)`,
              animation: 'mesh-orb-2 24s ease-in-out infinite',
            }}
          />
        </div>
      )}
      {decoration === 'soft' && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[280px]"
          style={{
            background: `radial-gradient(80% 60% at 50% 0%, ${t.bg}88, transparent 70%)`,
          }}
        />
      )}

      <header className="mb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-2">
            {eyebrow && (
              <RevealOnScroll>
                <span
                  className="inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase"
                  style={{
                    fontFamily: 'var(--font-display)',
                    letterSpacing: '0.08em',
                    color: t.color,
                    background: t.bg,
                  }}
                >
                  {eyebrow}
                </span>
              </RevealOnScroll>
            )}
            <RevealOnScroll delay={60}>
              <h1
                className="text-3xl font-bold sm:text-4xl"
                style={{
                  fontFamily: 'var(--font-display)',
                  letterSpacing: '-0.025em',
                  lineHeight: 1.1,
                  color: t.dark,
                }}
              >
                {title}
              </h1>
            </RevealOnScroll>
            {subtitle && (
              <RevealOnScroll delay={120}>
                <p
                  className="max-w-2xl text-base text-[#4A5968]"
                  style={{ lineHeight: 1.65 }}
                >
                  {subtitle}
                </p>
              </RevealOnScroll>
            )}
          </div>
          {action && <RevealOnScroll delay={180}>{action}</RevealOnScroll>}
        </div>
      </header>

      {revealChildren ? (
        <RevealOnScroll delay={240}>{children}</RevealOnScroll>
      ) : (
        children
      )}
    </div>
  );
}

import type { ReactNode } from 'react';
import { RevealOnScroll } from '../effects/RevealOnScroll';

interface Props {
  /** Eyebrow chip arriba del título (ej: "📋 TU SECCIÓN") */
  eyebrow?: string;
  /** Título principal */
  title: ReactNode;
  /** Subtítulo descriptivo */
  subtitle?: ReactNode;
  /** Acción/CTA a la derecha del header */
  action?: ReactNode;
  /** Decoración de fondo: 'mesh' orbes blur, 'soft' radial suave, 'none' */
  decoration?: 'none' | 'mesh' | 'soft';
  /** Color tema del eyebrow y acentos */
  tone?: 'primary' | 'accent' | 'cta' | 'neutro';
  children: ReactNode;
  /** Si false, no envuelve children en RevealOnScroll */
  revealChildren?: boolean;
}

const TONES = {
  primary: { color: 'var(--primary)', bg: 'var(--primary-bg)', dark: 'var(--primary-dark)' },
  accent: { color: 'var(--accent)', bg: 'var(--accent-light)', dark: 'var(--accent-dark)' },
  cta: { color: 'var(--cta)', bg: '#fef3c7', dark: '#9a3412' },
  neutro: { color: 'var(--text-muted)', bg: 'var(--surface-subtle)', dark: 'var(--text-strong)' },
};

/**
 * Wrapper estandarizado para páginas internas.
 * Header con eyebrow + título gradient + subtítulo + action opcional.
 * Decoración de fondo opcional (mesh blur sutil).
 *
 * Uso:
 *   <PageShell
 *     eyebrow="📋 TU SECCIÓN"
 *     title={<>Título con <span className="gradient-text">acento</span></>}
 *     subtitle="Descripción"
 *     decoration="mesh"
 *     tone="primary"
 *   >
 *     {contenido}
 *   </PageShell>
 */
export function PageShell({
  eyebrow,
  title,
  subtitle,
  action,
  decoration = 'soft',
  tone = 'primary',
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
                  color: 'var(--text-strong)',
                }}
              >
                {title}
              </h1>
            </RevealOnScroll>
            {subtitle && (
              <RevealOnScroll delay={120}>
                <p
                  className="max-w-2xl text-base"
                  style={{
                    lineHeight: 1.65,
                    color: 'var(--text-medium)',
                  }}
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

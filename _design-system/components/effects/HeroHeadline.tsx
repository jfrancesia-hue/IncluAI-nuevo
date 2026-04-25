'use client';

import { useEffect, useState } from 'react';

interface Word {
  /** Texto de la palabra */
  text: string;
  /** Si true, se pinta en color accent con glow */
  accent?: boolean;
}

interface Props {
  /** Array de palabras con flag opcional para accent */
  words: Word[];
  /** Clase CSS extra para el h1 */
  className?: string;
  /** Color del accent (default verde) */
  accentColor?: string;
}

/**
 * Headline del hero con reveal animado por palabras al cargar.
 * Cada palabra hace fade-up con stagger 65ms. Palabras con accent=true
 * se pintan con color destacado + glow sutil.
 *
 * Uso:
 *   <HeroHeadline words={[
 *     { text: 'Cada' },
 *     { text: 'usuario' },
 *     { text: 'merece', accent: true },
 *     { text: 'respuesta', accent: true },
 *   ]} />
 */
export function HeroHeadline({
  words,
  className = '',
  accentColor = '#27AE60',
}: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(t);
  }, []);

  return (
    <h1
      className={`hero-headline ${className}`}
      style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(36px, 6vw, 68px)',
        fontWeight: 800,
        lineHeight: 1.05,
        letterSpacing: '-0.035em',
        color: 'currentColor',
        margin: 0,
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.18em 0.28em',
      }}
    >
      {words.map((w, i) => (
        <span
          key={i}
          style={{
            display: 'inline-block',
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(24px)',
            transition: `opacity 700ms cubic-bezier(0.22, 1, 0.36, 1) ${i * 65}ms, transform 700ms cubic-bezier(0.22, 1, 0.36, 1) ${i * 65}ms`,
            color: w.accent ? accentColor : 'inherit',
            textShadow: w.accent
              ? `0 0 40px ${accentColor}59`
              : undefined,
          }}
        >
          {w.text}
        </span>
      ))}
    </h1>
  );
}

'use client';

import { useEffect, useState } from 'react';

/**
 * Headline del hero con reveal animado por palabras al cargar.
 * El primer paint muestra todo invisible (opacity 0); luego cada palabra
 * fade-up con stagger. Si el usuario tiene prefers-reduced-motion,
 * todo aparece de una sin animación.
 */
export function HeroHeadline() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Trigger en el next tick para que el primer paint tenga opacity 0
    const t = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(t);
  }, []);

  // Cada chunk es {texto, accent}. accent=true se pinta verde/highlight.
  const palabras = [
    { t: 'Cada', a: false },
    { t: 'alumno', a: false },
    { t: 'merece', a: false },
    { t: 'una', a: false },
    { t: 'clase', a: false },
    { t: 'pensada', a: true },
    { t: 'para', a: true },
    { t: 'él', a: true },
  ];

  return (
    <h1
      className="hero-headline"
      style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(36px, 6vw, 68px)',
        fontWeight: 800,
        lineHeight: 1.05,
        letterSpacing: '-0.035em',
        color: 'white',
        margin: 0,
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.18em 0.28em',
      }}
    >
      {palabras.map((w, i) => (
        <span
          key={i}
          style={{
            display: 'inline-block',
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(24px)',
            transition: `opacity 700ms cubic-bezier(0.22, 1, 0.36, 1) ${i * 65}ms, transform 700ms cubic-bezier(0.22, 1, 0.36, 1) ${i * 65}ms`,
            color: w.a ? '#27AE60' : 'inherit',
            textShadow: w.a
              ? '0 0 40px rgba(39, 174, 96, 0.35)'
              : undefined,
          }}
        >
          {w.t}
        </span>
      ))}
    </h1>
  );
}

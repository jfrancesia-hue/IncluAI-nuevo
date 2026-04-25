'use client';

import { useEffect, useRef, useState } from 'react';

interface Props {
  /** Valor objetivo (entero o decimal). String permite formato libre tipo "1.2k" */
  value: number | string;
  /** Duración de la animación en ms */
  duration?: number;
  /** Sufijo opcional ('+', '%', 'k') */
  suffix?: string;
  /** Decimales a mostrar (solo si value es number) */
  decimals?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Cuenta de 0 al valor objetivo con easing al entrar al viewport.
 * Si prefers-reduced-motion está activo, muestra el valor final directo.
 */
export function AnimatedNumber({
  value,
  duration = 1400,
  suffix = '',
  decimals = 0,
  className = '',
  style,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState<string>(() =>
    typeof value === 'string' ? value : '0'
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Si reduce-motion, mostrar final
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (reduceMotion) {
      setDisplay(String(value));
      return;
    }

    // Si value es string (no numérico), mostrar directo
    if (typeof value === 'string') {
      setDisplay(value);
      return;
    }

    let raf: number;
    let startTime: number | null = null;
    let started = false;

    const observer = new IntersectionObserver(
      (entries) => {
        if (started) return;
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            started = true;
            const animate = (timestamp: number) => {
              if (startTime === null) startTime = timestamp;
              const elapsed = timestamp - startTime;
              const progress = Math.min(elapsed / duration, 1);
              // ease-out cubic
              const eased = 1 - Math.pow(1 - progress, 3);
              const current = value * eased;
              setDisplay(current.toFixed(decimals));
              if (progress < 1) {
                raf = requestAnimationFrame(animate);
              } else {
                setDisplay(value.toFixed(decimals));
              }
            };
            raf = requestAnimationFrame(animate);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );
    observer.observe(el);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [value, duration, decimals]);

  return (
    <span ref={ref} className={className} style={style}>
      {display}
      {suffix}
    </span>
  );
}

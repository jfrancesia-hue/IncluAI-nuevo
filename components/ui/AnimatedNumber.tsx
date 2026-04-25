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

function shouldSkipAnimation(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Cuenta de 0 al valor objetivo con easing al entrar al viewport.
 * Si prefers-reduced-motion está activo o el value es string, muestra
 * el valor final directo (sin animación).
 *
 * Implementación: dos componentes — uno estático (early return) para
 * casos no animables, otro animado para números. Esto evita el
 * setState-in-effect del approach monolítico.
 */
export function AnimatedNumber(props: Props) {
  const { value, suffix = '', decimals = 0, className, style } = props;
  const isString = typeof value === 'string';
  const [reducedMotion] = useState<boolean>(() => shouldSkipAnimation());

  // Caso 1: render estático (string o reduce-motion)
  if (isString || reducedMotion) {
    const text = isString ? value : (value as number).toFixed(decimals);
    return (
      <span className={className} style={style}>
        {text}
        {suffix}
      </span>
    );
  }

  // Caso 2: animación con observer (sub-componente, hooks legales)
  return <AnimatedCounter {...props} />;
}

function AnimatedCounter({
  value,
  duration = 1400,
  suffix = '',
  decimals = 0,
  className = '',
  style,
}: Props) {
  // value siempre es number acá (el wrapper se encargó del case string)
  const numericValue = value as number;
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState<string>('0');

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

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
              const eased = 1 - Math.pow(1 - progress, 3);
              const current = numericValue * eased;
              setDisplay(current.toFixed(decimals));
              if (progress < 1) {
                raf = requestAnimationFrame(animate);
              } else {
                setDisplay(numericValue.toFixed(decimals));
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
  }, [numericValue, duration, decimals]);

  return (
    <span ref={ref} className={className} style={style}>
      {display}
      {suffix}
    </span>
  );
}

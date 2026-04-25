'use client';

import { useEffect, useRef, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  /** Stagger delay en ms (60-300 ideal para listas) */
  delay?: number;
  /** Tag HTML del wrapper */
  as?: 'div' | 'section' | 'article' | 'li' | 'header';
  /** Extra className para mezclar con .reveal */
  className?: string;
  /** Si true, una vez visible no se oculta más. Default true. */
  once?: boolean;
}

/**
 * Wrapper que aplica la animación reveal-on-scroll del CSS (.reveal).
 * Usa IntersectionObserver para agregar la clase .in-view al entrar al
 * viewport. Respeta `prefers-reduced-motion` automáticamente via CSS.
 *
 * Ejemplos:
 *   <RevealOnScroll>Contenido</RevealOnScroll>
 *   <RevealOnScroll delay={120}>Contenido con retraso</RevealOnScroll>
 *   <RevealOnScroll as="li" delay={i * 60}>Item de lista</RevealOnScroll>
 */
export function RevealOnScroll({
  children,
  delay = 0,
  as = 'div',
  className = '',
  once = true,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      el.classList.add('in-view');
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add('in-view');
            if (once) observer.unobserve(el);
          } else if (!once) {
            el.classList.remove('in-view');
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -50px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [once]);

  const Tag = as;
  const style = delay > 0 ? { transitionDelay: `${delay}ms` } : undefined;

  return (
    // @ts-expect-error — Tag dinámico válido en runtime
    <Tag ref={ref} className={`reveal ${className}`} style={style}>
      {children}
    </Tag>
  );
}

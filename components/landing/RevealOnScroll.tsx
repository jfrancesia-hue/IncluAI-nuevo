'use client';

import { useEffect, useRef, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  /** Stagger delay en ms (60-300, ideal para listas) */
  delay?: number;
  /** Tag HTML del wrapper (div por default, section/article si aplica) */
  as?: 'div' | 'section' | 'article' | 'li' | 'header';
  /** Extra className para mezclar con .reveal */
  className?: string;
  /** Si true, una vez visible no se oculta más (default: true) */
  once?: boolean;
}

/**
 * Wrapper que aplica la animación reveal-on-scroll del globals.css.
 * Usa IntersectionObserver para agregar la clase .in-view cuando entra
 * al viewport. Costo CPU: una sola observer instance compartida no es
 * trivial, pero el costo por elemento es marginal.
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
    // Si el navegador no soporta IntersectionObserver (muy raro), revelar inmediato
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

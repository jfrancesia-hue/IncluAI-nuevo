'use client';

import { useEffect, useRef, type ReactNode } from 'react';

type Props = {
  children: ReactNode;
  /** 1-5 para escalonar entradas */
  delay?: 1 | 2 | 3 | 4 | 5;
  /** Una sola vez (default true) — más barato y evita flicker */
  once?: boolean;
  /** Margen extra desde el bottom del viewport para disparar antes */
  rootMargin?: string;
  /** Etiqueta HTML (default div). Usar 'section' cuando envuelve una sección completa */
  as?: 'div' | 'section' | 'article' | 'li';
  className?: string;
};

export function RevealOnScroll({
  children,
  delay,
  once = true,
  rootMargin = '0px 0px -80px 0px',
  as: Tag = 'div',
  className,
}: Props) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === 'undefined') {
      node.classList.add('in-view');
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            entry.target.classList.remove('in-view');
          }
        }
      },
      { rootMargin, threshold: 0.1 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [once, rootMargin]);

  const delayClass = delay ? `reveal-delay-${delay}` : '';
  const cls = ['reveal', delayClass, className].filter(Boolean).join(' ');

  // Narrow cast: el ref es una unión de HTMLElement válidos para las Tags soportadas.
  const Element = Tag as 'div';
  return (
    <Element ref={ref as React.RefObject<HTMLDivElement>} className={cls}>
      {children}
    </Element>
  );
}

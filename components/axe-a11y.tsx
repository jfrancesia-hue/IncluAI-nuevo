'use client';

import { useEffect } from 'react';

// Carga @axe-core/react en cliente solo en desarrollo.
// En producción el componente no se renderiza nada.
export function AxeA11y() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;
    let cancelled = false;
    (async () => {
      try {
        const [{ default: React }, { default: ReactDOM }, axe] = await Promise.all([
          import('react'),
          import('react-dom'),
          import('@axe-core/react'),
        ]);
        if (cancelled) return;
        axe.default(React, ReactDOM, 1000);
      } catch {
        // axe-core no disponible: no es crítico
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);
  return null;
}

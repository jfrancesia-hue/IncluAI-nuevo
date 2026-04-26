'use client';

import { useEffect } from 'react';
import { trackPixel } from '@/lib/pixel';

// Dispara ViewContent una sola vez al montar la home pública.
// El componente vive solo en app/page.tsx; si la home redirige a /inicio
// (usuario logueado), ni siquiera llega a renderizar.
export function HomeTracking() {
  useEffect(() => {
    trackPixel('ViewContent', {
      content_name: 'home',
      content_category: 'landing',
    });
  }, []);
  return null;
}

'use client';

import { Toaster as SonnerToaster } from 'sonner';

/**
 * Toaster global — wrapper de sonner con estilos del sistema.
 *
 * Instalación:
 *   npm install sonner
 *
 * Montaje (una sola vez en root layout):
 *   import { Toaster } from '@/components/ui/Toaster';
 *   // dentro del <body>
 *   <Toaster />
 *
 * Uso en cualquier client component:
 *   import { toast } from 'sonner';
 *   toast.success('Guardado');
 *   toast.error('Algo salió mal');
 *   toast.info('Info');
 *   toast.warning('Atención');
 */
export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      richColors
      closeButton
      duration={4000}
      toastOptions={{
        style: {
          fontFamily: 'var(--font-inter), system-ui, sans-serif',
          fontSize: 14,
          borderRadius: 14,
          padding: '14px 16px',
          boxShadow:
            '0 16px 48px -12px rgba(15, 34, 64, 0.25), 0 4px 12px -2px rgba(15, 34, 64, 0.1)',
        },
        classNames: {
          title: 'font-semibold',
        },
      }}
    />
  );
}

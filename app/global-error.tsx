'use client';

import { useEffect } from 'react';

// global-error.tsx reemplaza el root layout cuando falla el propio layout
// (por eso tiene que incluir <html> y <body>). Usa estilos inline porque
// globals.css puede no haber cargado todavía.

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Vercel Logs captura esto como JSON. Evitamos importar lib/errors.ts
    // acá porque es un Client Component y el helper vive en server-only.
    console.error(
      JSON.stringify({
        level: 'error',
        source: 'global-error',
        timestamp: new Date().toISOString(),
        digest: error.digest,
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack,
        },
      })
    );
  }, [error]);

  return (
    <html lang="es">
      <body
        style={{
          margin: 0,
          padding: '24px',
          background: '#FBF8F2',
          color: '#1F2E3D',
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: 480 }}>
          <div aria-hidden style={{ fontSize: 56, marginBottom: 16 }}>
            ⚠️
          </div>
          <h1
            style={{
              fontSize: 32,
              fontWeight: 700,
              margin: '0 0 12px',
              color: '#1F2E3D',
            }}
          >
            Algo salió mal
          </h1>
          <p style={{ fontSize: 15, lineHeight: 1.6, color: '#4A5968', margin: '0 0 24px' }}>
            La aplicación no pudo cargar correctamente. Probá recargar la
            página. Si el problema persiste, escribinos a{' '}
            <a href="mailto:soporte@incluai.com.ar" style={{ color: '#2E86C1' }}>
              soporte@incluai.com.ar
            </a>
            .
          </p>
          {error.digest && (
            <p style={{ fontSize: 12, color: '#4A5968', marginBottom: 20, fontFamily: 'monospace' }}>
              ref: {error.digest}
            </p>
          )}
          <button
            type="button"
            onClick={reset}
            style={{
              background: '#2E86C1',
              color: '#ffffff',
              border: 'none',
              padding: '12px 24px',
              borderRadius: 10,
              fontSize: 15,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Reintentar
          </button>
        </div>
      </body>
    </html>
  );
}

'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[global-error]', error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-1 flex-col items-center justify-center gap-4 px-4 text-center">
      <p aria-hidden className="text-6xl">⚠️</p>
      <h1 className="font-serif text-4xl font-bold text-primary">
        Algo salió mal
      </h1>
      <p className="max-w-md text-muted">
        Tuvimos un inconveniente procesando tu solicitud. Probá de nuevo en un
        momento. Si sigue fallando, escribinos a{' '}
        <a href="mailto:soporte@incluai.com.ar" className="text-accent hover:underline">
          soporte@incluai.com.ar
        </a>.
      </p>
      {error.digest && (
        <code className="rounded bg-background px-2 py-1 text-xs text-muted">
          ref: {error.digest}
        </code>
      )}
      <Button onClick={reset}>Intentar de nuevo</Button>
    </div>
  );
}

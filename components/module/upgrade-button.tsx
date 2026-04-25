'use client';

import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

type Props = {
  plan: 'basico' | 'profesional' | 'premium';
  children?: React.ReactNode;
};

export function UpgradeButton({ plan, children }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function subscribe() {
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch('/api/mercadopago/crear-preferencia', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ plan }),
        });
        const data = (await res.json()) as {
          init_point?: string;
          sandbox_init_point?: string;
          error?: string;
        };
        if (!res.ok) throw new Error(data.error ?? 'Error en Mercado Pago');
        const redirect =
          process.env.NODE_ENV === 'production'
            ? data.init_point
            : data.sandbox_init_point ?? data.init_point;
        if (!redirect) throw new Error('No se recibió URL de checkout');
        window.location.href = redirect;
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Error inesperado';
        setError(msg);
        toast.error(`Mercado Pago: ${msg}`);
      }
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <Button onClick={subscribe} disabled={isPending} size="lg" className="magnetic-btn">
        {isPending ? 'Redirigiendo…' : children ?? 'Suscribirme con Mercado Pago'}
      </Button>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

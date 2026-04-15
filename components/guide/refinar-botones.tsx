'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { consumirSSE } from '../wizards/sse';

type Instruccion = 'mas_corto' | 'mas_simple' | 'mas_ejemplos' | 'mas_tecnico';

const LABELS: Record<Instruccion, { icon: string; label: string }> = {
  mas_corto: { icon: '✂️', label: 'Más corto' },
  mas_simple: { icon: '💡', label: 'Más simple' },
  mas_ejemplos: { icon: '📝', label: 'Más ejemplos' },
  mas_tecnico: { icon: '🔬', label: 'Más técnico' },
};

export function RefinarBotones({ consultaId }: { consultaId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState<Instruccion | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function refinar(instruccion: Instruccion) {
    setLoading(instruccion);
    setError(null);
    try {
      const res = await fetch('/api/refinar-guia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ consulta_id: consultaId, instruccion }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? 'Error al refinar');
      }
      let newId: string | null = null;
      await consumirSSE(res, {
        onDelta: () => {},
        onDone: (id) => {
          newId = id;
        },
        onError: (msg) => {
          setError(msg);
        },
      });
      if (newId) router.push(`/resultado?id=${newId}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error inesperado');
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="flex flex-col gap-2" data-no-print>
      <p className="text-sm font-medium text-primary">¿Querés ajustar la guía?</p>
      <div className="flex flex-wrap gap-2">
        {(Object.keys(LABELS) as Instruccion[]).map((k) => (
          <Button
            key={k}
            variant="outline"
            size="sm"
            disabled={loading !== null}
            onClick={() => refinar(k)}
          >
            {loading === k ? 'Pensando…' : `${LABELS[k].icon} ${LABELS[k].label}`}
          </Button>
        ))}
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

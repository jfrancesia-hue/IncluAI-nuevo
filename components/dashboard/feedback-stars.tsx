'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

export function FeedbackStars({
  consultaId,
  initial = 0,
}: {
  consultaId: string;
  initial?: number;
}) {
  const [rating, setRating] = useState(initial);
  const [hover, setHover] = useState(0);
  const [saved, setSaved] = useState(initial > 0);
  const [error, setError] = useState<string | null>(null);

  async function enviar(value: number) {
    setRating(value);
    setError(null);
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ consulta_id: consultaId, estrellas: value }),
      });
      if (!res.ok) throw new Error('No se pudo guardar tu feedback');
      setSaved(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error');
    }
  }

  return (
    <div className="rounded-[14px] border border-orange-200 bg-orange-50/60 p-5">
      <p className="text-sm font-medium text-primary">¿Te fue útil esta guía?</p>
      <div className="mt-3 flex gap-1.5" role="radiogroup" aria-label="Valoración">
        {[1, 2, 3, 4, 5].map((n) => {
          const active = n <= (hover || rating);
          return (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={rating === n}
              aria-label={`${n} ${n === 1 ? 'estrella' : 'estrellas'}`}
              onMouseEnter={() => setHover(n)}
              onMouseLeave={() => setHover(0)}
              onClick={() => enviar(n)}
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-[10px] border text-xl transition',
                active
                  ? 'border-cta bg-cta text-white scale-105'
                  : 'border-border bg-card text-muted hover:bg-white'
              )}
            >
              ★
            </button>
          );
        })}
      </div>
      {saved && !error && (
        <p className="mt-2 text-xs text-accent">¡Gracias por tu feedback!</p>
      )}
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}

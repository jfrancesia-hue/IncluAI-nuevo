'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { consumirSSE } from '../wizards/sse';

export function RegenerarBanner({ consultaId }: { consultaId: string }) {
  const router = useRouter();
  const [status, setStatus] = useState<'idle' | 'streaming' | 'done'>('idle');
  const [streamText, setStreamText] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function regenerar() {
    setStatus('streaming');
    setStreamText('');
    setError(null);
    try {
      const res = await fetch('/api/regenerar-guia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ consulta_id: consultaId }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? 'No se pudo regenerar');
      }
      let accum = '';
      await consumirSSE(res, {
        onDelta: (t) => {
          accum += t;
          setStreamText(accum);
        },
        onDone: () => {
          setStatus('done');
          router.refresh();
        },
        onError: (msg) => {
          setError(msg);
          setStatus('idle');
        },
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error inesperado');
      setStatus('idle');
    }
  }

  if (status === 'streaming' || status === 'done') {
    return (
      <section
        aria-label="Regenerando guía"
        className="rounded-[20px] border-2 border-[#f59e0b] bg-[#fffbeb] p-6"
      >
        <p className="font-serif text-lg font-bold text-[#92400e]">
          {status === 'done'
            ? '✅ Guía regenerada — recargando…'
            : '⏳ Regenerando tu guía…'}
        </p>
        <p className="mt-1 text-xs text-[#92400e]/80">
          Esto puede tardar hasta 40 segundos. No cierres la pestaña.
        </p>
        {streamText && (
          <pre className="mt-4 max-h-60 overflow-auto whitespace-pre-wrap rounded-[12px] bg-white p-4 text-xs text-[#1F2E3D]">
            {streamText}
          </pre>
        )}
      </section>
    );
  }

  return (
    <section
      aria-label="Guía incompleta"
      data-no-print
      className="rounded-[20px] border-2 border-[#f59e0b] bg-[#fffbeb] p-6"
    >
      <p className="font-serif text-lg font-bold text-[#92400e]">
        ⚠️ Esta guía no se completó
      </p>
      <p className="mt-1 text-sm text-[#78350f]">
        El servidor o la conexión se cortaron antes de terminar la guía. Podés
        regenerarla <strong>sin consumir una consulta de tu plan</strong>.
      </p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={regenerar}
          className="inline-flex items-center justify-center rounded-[12px] bg-[#d97706] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#b45309]"
        >
          🔄 Regenerar guía (gratis)
        </button>
        {error && (
          <span role="alert" className="text-xs text-red-600">
            {error}
          </span>
        )}
      </div>
    </section>
  );
}

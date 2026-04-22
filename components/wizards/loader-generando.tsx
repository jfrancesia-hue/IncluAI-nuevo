'use client';

import { useEffect, useState } from 'react';
import { Alert } from '@/components/ui/alert';

// Tiempos ajustados por observación real en dev (~130-150s).
// En producción Vercel serán menores (~70-100s) por Opus más rápido y sin cold starts.
const PASOS_LOADER = [
  {
    emoji: '📝',
    titulo: 'Redactando tu guía',
    sub: 'Pensando estrategias, ejemplos y normativa aplicable…',
    duracion: 100,
  },
  {
    emoji: '🖼️',
    titulo: 'Buscando imágenes',
    sub: 'Eligiendo fotos reales para cada concepto clave…',
    duracion: 20,
  },
  {
    emoji: '✨',
    titulo: 'Preparando todo',
    sub: 'Armando la vista final y guardando tu guía…',
    duracion: 10,
  },
];

export function LoaderGenerando({
  error,
  onVolver,
}: {
  error: string | null;
  onVolver: () => void;
}) {
  const [segundos, setSegundos] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setSegundos((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  let acumulado = 0;
  let pasoActual = 0;
  for (let i = 0; i < PASOS_LOADER.length; i++) {
    acumulado += PASOS_LOADER[i].duracion;
    if (segundos < acumulado) {
      pasoActual = i;
      break;
    }
    pasoActual = i;
  }

  const total = PASOS_LOADER.reduce((s, p) => s + p.duracion, 0);
  const progreso = Math.min(95, Math.round((segundos / total) * 95));

  if (error) {
    return (
      <div className="flex flex-col gap-4 p-6">
        <Alert variant="error">{error}</Alert>
        <button
          type="button"
          onClick={onVolver}
          className="inline-flex items-center justify-center self-start rounded-[10px] bg-[#1e3a5f] px-5 py-3 text-sm font-semibold text-white"
        >
          ← Volver al formulario
        </button>
      </div>
    );
  }

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="flex flex-col items-center gap-8 rounded-[20px] bg-white p-8 text-center shadow-[0_4px_20px_rgba(15,34,64,0.06)] sm:p-12"
    >
      <div
        aria-hidden
        className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#15803d] to-[#0d9448] text-4xl text-white shadow-[0_8px_24px_rgba(22,163,74,0.3)]"
      >
        <span className="animate-pulse">{PASOS_LOADER[pasoActual].emoji}</span>
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="font-serif text-2xl font-bold text-[#1e3a5f] sm:text-3xl">
          {PASOS_LOADER[pasoActual].titulo}…
        </h1>
        <p className="text-sm text-[#5c6b7f]">
          {PASOS_LOADER[pasoActual].sub}
        </p>
      </div>

      <div className="w-full max-w-md">
        <div className="h-2 w-full overflow-hidden rounded-full bg-[#e2e8f0]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#15803d] to-[#0d9448] transition-all duration-500"
            style={{ width: `${progreso}%` }}
          />
        </div>
        <div className="mt-2 flex justify-between text-[11px] text-[#5c6b7f]">
          <span>
            Paso {pasoActual + 1} de {PASOS_LOADER.length}
          </span>
          <span>~{Math.max(0, total - segundos)}s restantes</span>
        </div>
      </div>

      <p className="text-xs text-[#5c6b7f]">
        Tu guía se está personalizando con imágenes reales y referencias específicas. No cierres la pestaña.
      </p>
    </div>
  );
}

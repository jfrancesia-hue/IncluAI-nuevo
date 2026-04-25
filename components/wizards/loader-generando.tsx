'use client';

import { useEffect, useState } from 'react';
import { Alert } from '@/components/ui/alert';
import { Logo } from '@/components/branding/Logo';

// Tiempos ajustados por observación real en dev (~130-150s).
// En producción Vercel ~70-100s por Opus más rápido sin cold starts.
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

// Las secciones que el usuario verá en la guía. Las "tickamos" en cascada
// según el progreso para dar sensación de progresión real.
const SECCIONES_GUIA = [
  'Vista rápida',
  'Conceptos clave',
  'Estrategias de enseñanza',
  'Planificación paso a paso',
  'Videos recomendados',
  'Materiales para hacer',
  'Grilla de evaluación',
  'Tips de comunicación',
  'Errores a evitar',
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

  // Cuántas secciones "completadas" mostrar como ticks. Distribución
  // proporcional al progreso, con la última siempre pendiente.
  const seccionesCompletadas = Math.min(
    SECCIONES_GUIA.length - 1,
    Math.floor((progreso / 100) * SECCIONES_GUIA.length)
  );

  if (error) {
    return (
      <div className="flex flex-col gap-4 p-6">
        <Alert variant="error">{error}</Alert>
        <button
          type="button"
          onClick={onVolver}
          className="magnetic-btn inline-flex items-center justify-center self-start rounded-[10px] bg-[#2E86C1] px-5 py-3 text-sm font-semibold text-white"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          ← Volver al formulario
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1fr]">
      {/* Lado izquierdo: estado actual */}
      <div
        role="status"
        aria-live="polite"
        aria-busy="true"
        className="relative flex flex-col items-start gap-8 overflow-hidden rounded-[24px] border border-[#e2e8f0] bg-white p-8 shadow-[0_4px_20px_rgba(15,34,64,0.06)] sm:p-10"
      >
        {/* Mesh sutil de fondo */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ filter: 'blur(70px)', opacity: 0.35 }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-15%',
              left: '-15%',
              width: '50%',
              height: '60%',
              background:
                'radial-gradient(circle, rgba(46,134,193,0.5), transparent 60%)',
              animation: 'mesh-orb-1 14s ease-in-out infinite',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '-20%',
              right: '-10%',
              width: '60%',
              height: '70%',
              background:
                'radial-gradient(circle, rgba(39,174,96,0.4), transparent 60%)',
              animation: 'mesh-orb-2 18s ease-in-out infinite',
            }}
          />
        </div>

        <div className="relative z-10 flex flex-col gap-8">
          {/* Logo con ring animado */}
          <div aria-hidden className="relative flex h-24 w-24 items-center justify-center">
            <div
              className="absolute inset-0 animate-ping rounded-2xl bg-[#27AE60]/20"
            />
            <div
              className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-[0_8px_28px_rgba(15,34,64,0.18)]"
              style={{ animation: 'glow-pulse 3s ease-in-out infinite' }}
            >
              <Logo size={48} variant="gradient" gradientId="loader-logo" />
            </div>
          </div>

          {/* Eyebrow + título */}
          <div className="flex flex-col gap-2">
            <span
              className="inline-flex w-fit items-center gap-2 rounded-full bg-[#D6F0E0] px-3 py-1 text-xs font-semibold uppercase text-[#1e8449]"
              style={{
                fontFamily: 'var(--font-display)',
                letterSpacing: '0.08em',
              }}
            >
              <span aria-hidden>{PASOS_LOADER[pasoActual].emoji}</span>
              Generando guía · paso {pasoActual + 1}/{PASOS_LOADER.length}
            </span>
            <h1
              className="text-3xl font-extrabold text-[#1F2E3D]"
              style={{
                fontFamily: 'var(--font-display)',
                letterSpacing: '-0.025em',
                lineHeight: 1.1,
              }}
            >
              {PASOS_LOADER[pasoActual].titulo}
            </h1>
            <p className="text-sm text-[#4A5968]" style={{ lineHeight: 1.6 }}>
              {PASOS_LOADER[pasoActual].sub}
            </p>
          </div>

          {/* Progress bar premium */}
          <div className="w-full">
            <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-[#e2e8f0]">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#27AE60] via-[#5DA9D8] to-[#2E86C1] transition-all duration-500"
                style={{ width: `${progreso}%` }}
              />
              {/* Shimmer overlay */}
              <div
                className="absolute inset-y-0 left-0 rounded-full opacity-60"
                style={{
                  width: `${progreso}%`,
                  background:
                    'linear-gradient(90deg, transparent 30%, rgba(255,255,255,0.5) 50%, transparent 70%)',
                  backgroundSize: '200% 100%',
                  animation: 'skeleton-shimmer 1.6s ease-in-out infinite',
                }}
              />
            </div>
            <div
              className="mt-2 flex justify-between text-[11px] text-[#4A5968]"
              style={{ fontFamily: 'var(--font-display)', fontVariantNumeric: 'tabular-nums' }}
            >
              <span>{progreso}%</span>
              <span>~{Math.max(0, total - segundos)}s restantes</span>
            </div>
          </div>

          <p className="text-xs text-[#4A5968]">
            Tu guía se está personalizando con imágenes reales y referencias
            específicas. No cierres la pestaña.
          </p>
        </div>
      </div>

      {/* Lado derecho: secciones que se van completando */}
      <div className="rounded-[24px] border border-[#e2e8f0] bg-white p-7 shadow-[0_2px_12px_rgba(15,34,64,0.04)] sm:p-8">
        <p
          className="text-xs font-semibold uppercase text-[#4A5968]"
          style={{
            fontFamily: 'var(--font-display)',
            letterSpacing: '0.08em',
          }}
        >
          📑 Tu guía incluirá
        </p>
        <ul className="mt-4 flex flex-col gap-1.5">
          {SECCIONES_GUIA.map((seccion, i) => {
            const completa = i < seccionesCompletadas;
            const enProgreso = i === seccionesCompletadas;
            return (
              <li
                key={seccion}
                className="flex items-center gap-3 rounded-[10px] px-3 py-2.5 transition-all"
                style={{
                  background: completa
                    ? 'rgba(39, 174, 96, 0.08)'
                    : enProgreso
                      ? 'rgba(46, 134, 193, 0.08)'
                      : 'transparent',
                }}
              >
                <span
                  aria-hidden
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all"
                  style={{
                    background: completa
                      ? '#27AE60'
                      : enProgreso
                        ? '#2E86C1'
                        : 'transparent',
                    border: completa
                      ? 'none'
                      : enProgreso
                        ? '2px solid #2E86C1'
                        : '2px solid #e2e8f0',
                    color: 'white',
                  }}
                >
                  {completa ? '✓' : enProgreso ? '' : ''}
                </span>
                <span
                  className="text-sm font-medium transition-colors"
                  style={{
                    fontFamily: 'var(--font-display)',
                    color: completa
                      ? '#0d7c3a'
                      : enProgreso
                        ? '#1F5F8A'
                        : '#4A5968',
                  }}
                >
                  {seccion}
                </span>
                {enProgreso && (
                  <span
                    aria-hidden
                    className="ml-auto h-1.5 w-1.5 rounded-full bg-[#2E86C1]"
                    style={{ animation: 'kpi-pulse 1.4s ease-in-out infinite' }}
                  />
                )}
              </li>
            );
          })}
        </ul>

        <div className="mt-6 rounded-[12px] border border-[#fcd34d]/40 bg-[#fef3c7]/60 p-3 text-xs text-[#854f0b]">
          💡 <strong style={{ fontFamily: 'var(--font-display)' }}>
            ¿Sabías?
          </strong>{' '}
          IncluAI cita normativa argentina (CFE 311/16, Ley 26.206) cuando
          corresponde para que puedas justificar tus adaptaciones ante
          supervisión.
        </div>
      </div>
    </div>
  );
}

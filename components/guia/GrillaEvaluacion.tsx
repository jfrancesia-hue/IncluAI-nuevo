'use client';

import { useGrillaProgreso } from '@/hooks/guia/useGrillaProgreso';
import type { CriterioEvaluacion } from '@/lib/schemas/guia-schema';

const NIVEL_LABELS: Record<string, { label: string; color: string }> = {
  inicial: { label: 'Inicial', color: 'var(--color-alerta)' },
  en_proceso: { label: 'En proceso', color: 'var(--color-pampa)' },
  consolidado: { label: 'Consolidado', color: 'var(--color-exito)' },
};

export function GrillaEvaluacion({
  criterios,
  guiaId,
}: {
  criterios: CriterioEvaluacion[];
  guiaId: string;
}) {
  const { progreso, marcar } = useGrillaProgreso(guiaId);
  const niveles = ['inicial', 'en_proceso', 'consolidado'] as const;

  return (
    <section aria-labelledby="h-evaluacion" style={{ marginBottom: 56 }}>
      <h2
        id="h-evaluacion"
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 26,
          fontWeight: 700,
          color: 'var(--color-docentes-dark)',
          marginBottom: 10,
          letterSpacing: '-0.01em',
        }}
      >
        📝 Grilla de evaluación
      </h2>
      <p
        style={{
          fontSize: 14,
          color: 'var(--color-texto-medio)',
          marginBottom: 16,
        }}
      >
        Marcá el nivel alcanzado — se guarda automáticamente en este dispositivo.
      </p>

      <div
        className="grilla-checks"
        style={{
          background: 'white',
          border: '1px solid var(--color-borde)',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
        }}
      >
        <div
          role="row"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr repeat(3, 100px)',
            background: 'var(--color-papel-alt)',
            padding: '10px 16px',
            fontSize: 11,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: 0.6,
            color: 'var(--color-texto-medio)',
          }}
        >
          <span>Criterio</span>
          {niveles.map((n) => (
            <span key={n} style={{ textAlign: 'center' }}>
              {NIVEL_LABELS[n].label}
            </span>
          ))}
        </div>

        {criterios.map((c, idx) => (
          <div
            role="row"
            key={idx}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr repeat(3, 100px)',
              padding: '14px 16px',
              borderTop: '1px solid var(--color-borde)',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span style={{ fontSize: 15, lineHeight: 1.4 }}>
              {c.criterio}
              <span
                style={{
                  display: 'block',
                  fontSize: 11,
                  color: 'var(--color-texto-medio)',
                  marginTop: 2,
                }}
              >
                Esperado: {NIVEL_LABELS[c.nivelEsperado]?.label ?? c.nivelEsperado}
              </span>
            </span>
            {niveles.map((nivel) => {
              const activo = progreso[idx] === nivel;
              return (
                <button
                  key={nivel}
                  type="button"
                  onClick={() => marcar(idx, nivel)}
                  aria-pressed={activo}
                  aria-label={`Marcar "${c.criterio}" como ${NIVEL_LABELS[nivel].label}`}
                  style={{
                    minWidth: 44,
                    minHeight: 44,
                    margin: '0 auto',
                    borderRadius: 'var(--radius-md)',
                    border: activo
                      ? `2px solid ${NIVEL_LABELS[nivel].color}`
                      : '1px solid var(--color-borde)',
                    background: activo ? NIVEL_LABELS[nivel].color : 'white',
                    color: activo ? 'white' : 'var(--color-texto-medio)',
                    cursor: 'pointer',
                    fontSize: 18,
                    fontWeight: 700,
                    transition: 'all 0.15s',
                  }}
                >
                  {activo ? '✓' : ''}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
}

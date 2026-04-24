import type { VistaRapida as VistaRapidaData } from '@/lib/schemas/guia-schema';

export function VistaRapida({ data }: { data: VistaRapidaData }) {
  return (
    <section
      aria-label="Vista rápida"
      style={{
        background: 'var(--color-papel-alt)',
        borderLeft: '4px solid var(--color-docentes-primary)',
        borderRadius: '0 var(--radius-lg) var(--radius-lg) 0',
        padding: '20px 24px',
        marginBottom: 40,
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 12,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          fontWeight: 600,
          color: 'var(--color-docentes-primary)',
          marginBottom: 8,
        }}
      >
        ⚡ Lo esencial en 30 segundos
      </div>
      <p
        style={{
          fontSize: 17,
          lineHeight: 1.7,
          color: 'var(--color-texto)',
          margin: 0,
          letterSpacing: '-0.006em',
        }}
      >
        {data.resumen}
      </p>
    </section>
  );
}

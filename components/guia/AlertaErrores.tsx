import type { ErrorComun } from '@/lib/schemas/guia-schema';

export function AlertaErrores({
  errores,
}: {
  errores: ErrorComun[];
}) {
  return (
    <section aria-labelledby="h-errores" style={{ marginBottom: 56 }}>
      <h2
        id="h-errores"
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 26,
          fontWeight: 700,
          color: 'var(--color-docentes-dark)',
          marginBottom: 20,
          letterSpacing: '-0.01em',
        }}
      >
        ⚠️ Errores comunes a evitar
      </h2>
      <div style={{ display: 'grid', gap: 12 }}>
        {errores.map((e, i) => (
          <article
            key={i}
            style={{
              background: 'var(--color-alerta-bg)',
              borderLeft: '4px solid var(--color-alerta)',
              borderRadius: '0 var(--radius-lg) var(--radius-lg) 0',
              padding: '16px 20px',
            }}
          >
            <h3
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: 'var(--color-alerta)',
                margin: '0 0 6px',
              }}
            >
              {e.titulo}
            </h3>
            <p
              style={{
                fontSize: 14,
                lineHeight: 1.55,
                color: 'var(--color-desierto-dark)',
                margin: 0,
              }}
            >
              {e.descripcion}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

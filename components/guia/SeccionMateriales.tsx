import { ImagenInteligente } from '@/components/ui/ImagenInteligente';
import type { Material } from '@/lib/schemas/guia-schema';

export function SeccionMateriales({
  materiales,
}: {
  materiales: Material[];
}) {
  return (
    <section aria-labelledby="h-materiales" style={{ marginBottom: 56 }}>
      <h2
        id="h-materiales"
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 26,
          fontWeight: 700,
          color: 'var(--color-docentes-dark)',
          marginBottom: 20,
          letterSpacing: '-0.01em',
        }}
      >
        🧰 Materiales para hacer
      </h2>
      <div
        style={{
          display: 'grid',
          gap: 16,
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        }}
      >
        {materiales.map((m, i) => (
          <article
            key={`${m.nombre}-${i}`}
            style={{
              background: 'white',
              border: '1px solid var(--color-borde)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
            }}
          >
            {m.imagenReferencia && (
              <ImagenInteligente
                imagen={m.imagenReferencia}
                aspectRatio="16 / 10"
              />
            )}
            <div style={{ padding: 18 }}>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 18,
                  fontWeight: 600,
                  margin: '0 0 6px',
                  color: 'var(--color-texto)',
                }}
              >
                {m.nombre}
              </h3>
              <p
                style={{
                  fontSize: 14,
                  lineHeight: 1.5,
                  color: 'var(--color-texto-medio)',
                  margin: '0 0 10px',
                }}
              >
                {m.descripcion}
              </p>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  fontSize: 12,
                  fontWeight: 600,
                  color: 'var(--color-docentes-primary)',
                  background: 'var(--color-docentes-bg)',
                  padding: '4px 10px',
                  borderRadius: 999,
                }}
              >
                ⏱ {m.tiempoPreparacion}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

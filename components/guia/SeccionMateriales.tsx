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
            {m.imagenReferencia ? (
              <ImagenInteligente
                imagen={m.imagenReferencia}
                aspectRatio="16 / 10"
              />
            ) : (
              <MaterialPlaceholder nombre={m.nombre} indice={i} />
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
                  fontSize: 15,
                  lineHeight: 1.65,
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

// Fallback visual cuando Claude no generó imagenReferencia para el material.
// Gradiente rotado por índice + emoji contextual. No intenta ser bonito,
// solo evitar el hueco blanco que quedaba antes.
const GRADIENTES_MATERIAL = [
  'linear-gradient(135deg, #D7EAF6, #2E86C1)',
  'linear-gradient(135deg, #D6F0E0, #27AE60)',
  'linear-gradient(135deg, #fef3c7, #E67E22)',
  'linear-gradient(135deg, #ede9fe, #8b5cf6)',
  'linear-gradient(135deg, #fce7f3, #ec4899)',
];

function MaterialPlaceholder({ nombre, indice }: { nombre: string; indice: number }) {
  const gradiente = GRADIENTES_MATERIAL[indice % GRADIENTES_MATERIAL.length];
  return (
    <div
      role="img"
      aria-label={nombre}
      style={{
        width: '100%',
        aspectRatio: '16 / 10',
        background: gradiente,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: 48,
        fontWeight: 700,
        textShadow: '0 2px 12px rgba(0,0,0,0.25)',
      }}
    >
      <span aria-hidden>🧰</span>
    </div>
  );
}

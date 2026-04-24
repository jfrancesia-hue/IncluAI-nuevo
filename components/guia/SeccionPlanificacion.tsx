import type { Planificacion } from '@/lib/schemas/guia-schema';

// Gradientes rotados por índice para dar variedad visual a la timeline
// sin depender de que Claude nombre los momentos de forma específica.
const GRADIENTES = [
  'linear-gradient(135deg, #2E86C1, #0e4f68)', // azul
  'linear-gradient(135deg, #27AE60, #0d7c3a)', // verde
  'linear-gradient(135deg, #E67E22, #9c4a0e)', // naranja
  'linear-gradient(135deg, #8b5cf6, #5b21b6)', // violeta
  'linear-gradient(135deg, #ec4899, #9f1239)', // rosa
];

export function SeccionPlanificacion({ data }: { data: Planificacion }) {
  return (
    <section
      aria-labelledby="h-planificacion"
      style={{ marginBottom: 56 }}
      className="seccion-planificacion"
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          gap: 16,
          marginBottom: 20,
          flexWrap: 'wrap',
        }}
      >
        <h2
          id="h-planificacion"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 26,
            fontWeight: 700,
            color: 'var(--color-docentes-dark)',
            letterSpacing: '-0.01em',
            margin: 0,
          }}
        >
          🗓️ {data.titulo}
        </h2>
        {data.duracionTotal && (
          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--color-docentes-primary)',
              background: 'var(--color-docentes-bg)',
              padding: '5px 12px',
              borderRadius: 999,
            }}
          >
            ⏱ Total: {data.duracionTotal}
          </span>
        )}
      </div>

      <ol
        style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
        }}
      >
        {data.momentos.map((m, i) => (
          <li
            key={`${m.nombre}-${i}`}
            style={{
              background: 'white',
              border: '1px solid var(--color-borde)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              display: 'grid',
              gridTemplateColumns: '72px 1fr',
            }}
          >
            <div
              style={{
                background: GRADIENTES[i % GRADIENTES.length],
                color: 'white',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '16px 8px',
                fontFamily: 'var(--font-display)',
              }}
              aria-hidden
            >
              <span style={{ fontSize: 28, fontWeight: 800, lineHeight: 1 }}>
                {i + 1}
              </span>
              <span
                style={{
                  fontSize: 10,
                  textTransform: 'uppercase',
                  letterSpacing: 0.8,
                  marginTop: 4,
                  opacity: 0.9,
                }}
              >
                paso
              </span>
            </div>

            <div style={{ padding: '16px 18px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  justifyContent: 'space-between',
                  gap: 12,
                  flexWrap: 'wrap',
                  marginBottom: 10,
                }}
              >
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 17,
                    fontWeight: 700,
                    margin: 0,
                    color: 'var(--color-texto)',
                  }}
                >
                  {m.nombre}
                </h3>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: 'var(--color-texto-medio)',
                    background: 'var(--color-papel-alt, #FBF8F2)',
                    padding: '3px 10px',
                    borderRadius: 999,
                    whiteSpace: 'nowrap',
                  }}
                >
                  ⏱ {m.duracion}
                </span>
              </div>

              <ol
                style={{
                  listStyle: 'decimal',
                  paddingLeft: 20,
                  margin: '0 0 12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                }}
              >
                {m.pasos.map((p, j) => (
                  <li
                    key={j}
                    style={{
                      fontSize: 14,
                      lineHeight: 1.55,
                      color: 'var(--color-texto)',
                    }}
                  >
                    {p}
                  </li>
                ))}
              </ol>

              {m.ajusteInclusivo && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 10,
                    background: 'var(--color-docentes-bg)',
                    borderLeft: '3px solid var(--color-docentes-primary)',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    marginTop: 8,
                  }}
                >
                  <span aria-hidden style={{ fontSize: 16, lineHeight: 1.4 }}>
                    ♿
                  </span>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 13,
                      lineHeight: 1.5,
                      color: 'var(--color-docentes-dark)',
                    }}
                  >
                    <strong style={{ fontWeight: 700 }}>Ajuste inclusivo: </strong>
                    {m.ajusteInclusivo}
                  </p>
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

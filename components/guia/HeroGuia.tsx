import type { VistaRapida } from '@/lib/schemas/guia-schema';

type Metadata = {
  id?: string;
  materia?: string | null;
  nivel?: string | null;
  anio_grado?: string | null;
  cantidad_alumnos?: number | null;
  discapacidades?: string[];
};

interface Props {
  vistaRapida: VistaRapida;
  metadata: Metadata;
}

export function HeroGuia({ vistaRapida, metadata }: Props) {
  const chips = [
    metadata.materia,
    metadata.nivel,
    metadata.anio_grado,
    metadata.cantidad_alumnos
      ? `${metadata.cantidad_alumnos} alumno${metadata.cantidad_alumnos === 1 ? '' : 's'}`
      : null,
  ].filter(Boolean) as string[];

  return (
    <header
      style={{
        background:
          'linear-gradient(135deg, var(--color-docentes-bg) 0%, white 100%)',
        borderBottom: '1px solid var(--color-borde)',
        padding: '48px 24px 40px',
      }}
    >
      <div
        style={{
          maxWidth: 900,
          margin: '0 auto',
        }}
      >
        <div
          style={{
            fontSize: 12,
            textTransform: 'uppercase',
            letterSpacing: 0.8,
            fontWeight: 700,
            color: 'var(--color-docentes-primary)',
            marginBottom: 10,
          }}
        >
          🧩 Guía IncluIA
        </div>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(28px, 5vw, 42px)',
            fontWeight: 700,
            lineHeight: 1.15,
            color: 'var(--color-docentes-dark)',
            marginBottom: 16,
            letterSpacing: '-0.01em',
          }}
        >
          {vistaRapida.titulo}
        </h1>
        {chips.length > 0 && (
          <div
            style={{
              display: 'flex',
              gap: 8,
              flexWrap: 'wrap',
              marginTop: 8,
            }}
          >
            {chips.map((chip) => (
              <span
                key={chip}
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  background: 'white',
                  border: '1px solid var(--color-borde)',
                  padding: '4px 10px',
                  borderRadius: 999,
                  color: 'var(--color-texto-medio)',
                }}
              >
                {chip}
              </span>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}

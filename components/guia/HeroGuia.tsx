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
        position: 'relative',
        overflow: 'hidden',
        background:
          'linear-gradient(135deg, var(--color-docentes-bg) 0%, white 100%)',
        borderBottom: '1px solid var(--color-borde)',
        padding: '56px 24px 48px',
      }}
    >
      {/* Mesh gradient sutil para dar tech feel sin saturar */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          filter: 'blur(70px)',
          opacity: 0.4,
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-30%',
            left: '-10%',
            width: '60%',
            height: '120%',
            background:
              'radial-gradient(circle, rgba(46,134,193,0.4), transparent 60%)',
            animation: 'mesh-orb-1 24s ease-in-out infinite',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '-10%',
            right: '-15%',
            width: '50%',
            height: '120%',
            background:
              'radial-gradient(circle, rgba(39,174,96,0.3), transparent 60%)',
            animation: 'mesh-orb-2 28s ease-in-out infinite',
          }}
        />
      </div>

      <div
        style={{
          position: 'relative',
          maxWidth: 900,
          margin: '0 auto',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontFamily: 'var(--font-display)',
            fontSize: 12,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            fontWeight: 600,
            color: 'var(--color-docentes-primary)',
            marginBottom: 12,
            background: 'rgba(46, 134, 193, 0.1)',
            padding: '5px 12px',
            borderRadius: 999,
          }}
        >
          <span
            aria-hidden
            style={{
              width: 6,
              height: 6,
              borderRadius: 999,
              background: 'var(--color-docentes-primary)',
              boxShadow: '0 0 8px rgba(46, 134, 193, 0.6)',
            }}
          />
          🧩 Guía IncluAI
        </div>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(32px, 5.5vw, 48px)',
            fontWeight: 800,
            lineHeight: 1.1,
            color: 'var(--color-docentes-dark)',
            marginBottom: 16,
            letterSpacing: '-0.035em',
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
              marginTop: 12,
            }}
          >
            {chips.map((chip) => (
              <span
                key={chip}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 12,
                  fontWeight: 600,
                  background: 'white',
                  border: '1px solid var(--color-borde)',
                  padding: '5px 12px',
                  borderRadius: 999,
                  color: 'var(--color-texto-medio)',
                  boxShadow: '0 2px 6px rgba(15,34,64,0.04)',
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

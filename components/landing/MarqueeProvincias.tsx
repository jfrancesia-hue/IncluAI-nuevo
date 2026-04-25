/**
 * Carrusel infinito de nombres de provincias. Loop CSS puro (sin JS).
 * Trick: duplicamos el contenido y movemos el container -50%.
 */
const PROVINCIAS = [
  'Buenos Aires',
  'Catamarca',
  'Córdoba',
  'Mendoza',
  'Salta',
  'Tucumán',
  'Santa Fe',
  'Misiones',
  'Neuquén',
  'Río Negro',
  'San Juan',
  'Entre Ríos',
];

export function MarqueeProvincias() {
  const items = [...PROVINCIAS, ...PROVINCIAS]; // duplicado para loop suave

  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        maskImage:
          'linear-gradient(90deg, transparent, black 12%, black 88%, transparent)',
        WebkitMaskImage:
          'linear-gradient(90deg, transparent, black 12%, black 88%, transparent)',
      }}
    >
      <div
        className="marquee-track"
        style={{
          display: 'flex',
          gap: 48,
          width: 'max-content',
          paddingBlock: 8,
          animation: 'marquee 38s linear infinite',
        }}
      >
        {items.map((p, i) => (
          <span
            key={`${p}-${i}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 14,
              fontWeight: 600,
              color: 'rgba(31, 46, 61, 0.55)',
              whiteSpace: 'nowrap',
              fontFamily: 'var(--font-display)',
              letterSpacing: '-0.01em',
            }}
          >
            <span
              aria-hidden
              style={{
                width: 6,
                height: 6,
                borderRadius: 999,
                background: '#27AE60',
                boxShadow: '0 0 8px rgba(39, 174, 96, 0.5)',
              }}
            />
            {p}
          </span>
        ))}
      </div>
    </div>
  );
}

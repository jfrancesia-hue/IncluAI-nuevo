import type { TipComunicacion } from '@/lib/schemas/guia-schema';

const TITULOS_POR_MODULO: Record<string, string> = {
  docentes: '💬 Comunicación en el aula',
  familias: '💬 Comunicación en casa',
  profesionales: '💬 Comunicación con paciente y familia',
};

export function TipsComunicacion({
  tips,
  modulo = 'docentes',
}: {
  tips: TipComunicacion[];
  modulo?: string;
}) {
  return (
    <section aria-labelledby="h-comunicacion" style={{ marginBottom: 56 }}>
      <h2
        id="h-comunicacion"
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 26,
          fontWeight: 700,
          color: 'var(--color-docentes-dark)',
          marginBottom: 20,
          letterSpacing: '-0.01em',
        }}
      >
        {TITULOS_POR_MODULO[modulo] ?? TITULOS_POR_MODULO.docentes}
      </h2>
      <div style={{ display: 'grid', gap: 12 }}>
        {tips.map((t, i) => (
          <div
            key={i}
            style={{
              display: 'grid',
              gap: 0,
              gridTemplateColumns: '1fr 1fr',
              background: 'white',
              border: '1px solid var(--color-borde)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: 16,
                background: 'var(--color-exito-bg)',
                borderRight: '1px solid var(--color-borde)',
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  textTransform: 'uppercase',
                  letterSpacing: 0.6,
                  fontWeight: 700,
                  color: 'var(--color-exito)',
                  marginBottom: 6,
                }}
              >
                ✅ Usar
              </div>
              <div style={{ fontSize: 14, lineHeight: 1.5 }}>{t.usar}</div>
            </div>
            <div
              style={{
                padding: 16,
                background: '#FDECEA',
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  textTransform: 'uppercase',
                  letterSpacing: 0.6,
                  fontWeight: 700,
                  color: '#B3261E',
                  marginBottom: 6,
                }}
              >
                ❌ Evitar
              </div>
              <div style={{ fontSize: 14, lineHeight: 1.5 }}>{t.evitar}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

import { TarjetaConcepto } from './TarjetaConcepto';
import type { ConceptoClave } from '@/lib/schemas/guia-schema';

export function SeccionConceptosClave({
  conceptos,
}: {
  conceptos: ConceptoClave[];
}) {
  return (
    <section
      aria-labelledby="h-conceptos"
      style={{ marginBottom: 56 }}
    >
      <h2
        id="h-conceptos"
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 26,
          fontWeight: 700,
          color: 'var(--color-docentes-dark)',
          marginBottom: 20,
          letterSpacing: '-0.01em',
        }}
      >
        📚 Conceptos clave
      </h2>
      <div
        style={{
          display: 'grid',
          gap: 20,
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        }}
      >
        {conceptos.map((c, i) => (
          <TarjetaConcepto key={`${c.nombre}-${i}`} concepto={c} />
        ))}
      </div>
    </section>
  );
}

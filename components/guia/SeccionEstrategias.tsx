import { EstrategiaAcordeon } from './EstrategiaAcordeon';
import type { Estrategia } from '@/lib/schemas/guia-schema';

export function SeccionEstrategias({
  estrategias,
}: {
  estrategias: Estrategia[];
}) {
  return (
    <section aria-labelledby="h-estrategias" style={{ marginBottom: 56 }}>
      <h2
        id="h-estrategias"
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 26,
          fontWeight: 700,
          color: 'var(--color-docentes-dark)',
          marginBottom: 20,
          letterSpacing: '-0.01em',
        }}
      >
        🎯 Estrategias de enseñanza
      </h2>
      {estrategias.map((e, i) => (
        <EstrategiaAcordeon
          key={`${e.numero}-${i}`}
          estrategia={e}
          abiertaPorDefecto={i === 0}
        />
      ))}
    </section>
  );
}

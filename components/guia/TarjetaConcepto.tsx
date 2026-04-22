import { ImagenInteligente } from '@/components/ui/ImagenInteligente';
import type { ConceptoClave } from '@/lib/schemas/guia-schema';

const coloresPorTipo: Record<
  ConceptoClave['color'],
  { bg: string; texto: string; emoji: string }
> = {
  selva: { bg: 'var(--color-selva-bg)', texto: 'var(--color-selva-dark)', emoji: '🌿' },
  desierto: {
    bg: 'var(--color-desierto-bg)',
    texto: 'var(--color-desierto-dark)',
    emoji: '🌵',
  },
  pampa: { bg: '#FFF8E8', texto: '#633806', emoji: '🌾' },
  oceano: {
    bg: 'var(--color-docentes-bg)',
    texto: 'var(--color-docentes-dark)',
    emoji: '🌊',
  },
  montana: { bg: '#F1EFE8', texto: '#2C2C2A', emoji: '⛰️' },
  neutro: { bg: 'var(--color-papel-alt)', texto: 'var(--color-texto)', emoji: '✦' },
};

export function TarjetaConcepto({ concepto }: { concepto: ConceptoClave }) {
  const estilo = coloresPorTipo[concepto.color] ?? coloresPorTipo.neutro;

  return (
    <article
      style={{
        background: 'white',
        border: '1px solid var(--color-borde)',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
      }}
    >
      <ImagenInteligente
        imagen={concepto.imagen}
        colorFallback={estilo.bg}
        aspectRatio="4 / 3"
      />
      <div style={{ padding: 20 }}>
        <div
          style={{
            fontSize: 11,
            textTransform: 'uppercase',
            letterSpacing: 0.8,
            fontWeight: 700,
            color: estilo.texto,
            marginBottom: 6,
          }}
        >
          {estilo.emoji} {concepto.nombre.toUpperCase()}
        </div>
        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 22,
            fontWeight: 600,
            marginBottom: 8,
            color: estilo.texto,
            lineHeight: 1.2,
          }}
        >
          {concepto.nombre}
        </h3>
        <p
          style={{
            fontSize: 15,
            color: 'var(--color-texto-medio)',
            lineHeight: 1.5,
            margin: 0,
          }}
        >
          {concepto.descripcionCorta}
        </p>
      </div>
    </article>
  );
}

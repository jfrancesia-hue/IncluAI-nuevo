import type { ReactNode } from 'react';

interface Props {
  /** Items a deslizar (se duplican internamente para loop seamless) */
  items: string[];
  /** Duración completa del loop en segundos */
  duration?: number;
  /** Render custom de cada item (default: texto con dot verde) */
  renderItem?: (item: string) => ReactNode;
  /** Color del dot (si no usás renderItem custom) */
  dotColor?: string;
}

/**
 * Carrusel infinito de items. Loop CSS puro — duplica los items y mueve
 * el container -50% con @keyframes marquee.
 *
 * Uso:
 *   <MarqueeItems items={['Item 1', 'Item 2', 'Item 3']} />
 *   <MarqueeItems items={logos} duration={30} renderItem={(src) => <img src={src} />} />
 */
export function MarqueeItems({
  items,
  duration = 38,
  renderItem,
  dotColor = '#27AE60',
}: Props) {
  const duplicated = [...items, ...items];

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
          animation: `marquee ${duration}s linear infinite`,
        }}
      >
        {duplicated.map((item, i) => (
          <span
            key={`${item}-${i}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 14,
              fontWeight: 600,
              color: 'var(--text-muted)',
              whiteSpace: 'nowrap',
              fontFamily: 'var(--font-display)',
              letterSpacing: '-0.01em',
            }}
          >
            {renderItem ? (
              renderItem(item)
            ) : (
              <>
                <span
                  aria-hidden
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 999,
                    background: dotColor,
                    boxShadow: `0 0 8px ${dotColor}80`,
                  }}
                />
                {item}
              </>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}

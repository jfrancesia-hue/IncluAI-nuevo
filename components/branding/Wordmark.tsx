import type { CSSProperties } from 'react';

interface Props {
  /** Tamaño del texto (px) — el resto se calcula proporcional */
  size?: number;
  /** 'light' para fondos claros, 'dark' para fondos oscuros */
  tone?: 'light' | 'dark';
  /** Resalta "AI" con gradient — solo visible si tone='light' */
  accentAI?: boolean;
  className?: string;
  style?: CSSProperties;
}

/**
 * Wordmark "IncluAI" en Plus Jakarta Sans peso 800.
 * Si accentAI=true (default), las letras "AI" tienen gradient
 * verde→azul, dando peso visual a la "IA" del producto sin caer en
 * mayúsculas/colores groseros.
 */
export function Wordmark({
  size = 22,
  tone = 'light',
  accentAI = true,
  className,
  style,
}: Props) {
  const baseColor = tone === 'dark' ? 'white' : '#1F2E3D';

  return (
    <span
      className={className}
      style={{
        fontFamily: 'var(--font-display)',
        fontSize: size,
        fontWeight: 800,
        letterSpacing: '-0.035em',
        lineHeight: 1,
        color: baseColor,
        display: 'inline-flex',
        alignItems: 'baseline',
        ...style,
      }}
    >
      Inclu
      {accentAI ? (
        <span
          className="gradient-text"
          style={{
            // gradient-text usa background-clip — funciona aunque el padre tenga color
            display: 'inline',
          }}
        >
          AI
        </span>
      ) : (
        <span>AI</span>
      )}
    </span>
  );
}

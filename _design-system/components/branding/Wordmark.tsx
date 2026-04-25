import type { CSSProperties } from 'react';

interface Props {
  /** Tamaño del texto en px */
  size?: number;
  /** 'light' = fondos claros, 'dark' = fondos oscuros */
  tone?: 'light' | 'dark';
  /** Resalta las últimas letras con gradient (ej: "AI" en IncluAI) */
  accentSuffix?: boolean;
  /** Texto base del wordmark — partido en 2 partes */
  brandBase?: string;
  /** Sufijo con accent (se pinta gradient) */
  brandAccent?: string;
  className?: string;
  style?: CSSProperties;
}

/**
 * Wordmark del producto en Plus Jakarta Sans peso 800.
 * Si accentSuffix=true, las letras del brandAccent tienen gradient
 * verde→azul para dar peso visual a una parte del nombre.
 *
 * CÓMO PERSONALIZAR:
 *   Cambiá los defaults de brandBase y brandAccent por tu marca.
 *
 * Ejemplos:
 *   <Wordmark brandBase="Inclu" brandAccent="AI" accentSuffix />
 *   <Wordmark brandBase="My" brandAccent="App" accentSuffix />
 *   <Wordmark brandBase="Acme" accentSuffix={false} />
 */
export function Wordmark({
  size = 22,
  tone = 'light',
  accentSuffix = true,
  brandBase = 'Inclu',
  brandAccent = 'AI',
  className,
  style,
}: Props) {
  const baseColor = tone === 'dark' ? 'white' : 'var(--text-strong)';

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
      {brandBase}
      {accentSuffix ? (
        <span className="gradient-text" style={{ display: 'inline' }}>
          {brandAccent}
        </span>
      ) : (
        <span>{brandAccent}</span>
      )}
    </span>
  );
}

import type { CSSProperties } from 'react';

interface Props {
  /** Tamaño del icono en px (default 32) */
  size?: number;
  /**
   * Variantes — el emoji 🧩 no cambia entre variantes (siempre se ve igual);
   * el prop existe para compatibilidad con la API de Logo.
   */
  variant?: 'gradient' | 'solid' | 'white' | 'currentColor';
  className?: string;
  style?: CSSProperties;
  /** Mantiene la firma para no romper imports — no se usa con emoji */
  gradientId?: string;
  /** Mantiene la firma — no se usa con emoji */
  color?: string;
}

/**
 * Logo IncluAI — emoji puzzle 🧩 (logo original).
 *
 * Renderiza como <span> con el emoji a tamaño dado.
 * Para variantes 'white' aplica filtro CSS para blanquear (sirve sobre
 * fondos oscuros donde queremos un puzzle más blanco).
 */
export function Logo({
  size = 32,
  variant = 'gradient',
  className,
  style,
}: Props) {
  // Para fondos oscuros, levantamos un poco la luminosidad
  const filter =
    variant === 'white'
      ? 'brightness(0) invert(1) drop-shadow(0 1px 4px rgba(0,0,0,0.3))'
      : undefined;

  return (
    <span
      role="img"
      aria-label="IncluAI"
      className={className}
      style={{
        fontSize: size,
        lineHeight: 1,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        filter,
        ...style,
      }}
    >
      🧩
    </span>
  );
}

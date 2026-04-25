import type { CSSProperties } from 'react';

interface Props {
  /** Tamaño del SVG en px (default 32) */
  size?: number;
  /** Variante de color: 'gradient' | 'solid' | 'white' | 'currentColor' */
  variant?: 'gradient' | 'solid' | 'white' | 'currentColor';
  /** Color sólido (solo si variant='solid') */
  color?: string;
  className?: string;
  style?: CSSProperties;
  /** ID único — necesario si hay >1 logo gradient en la misma página */
  gradientId?: string;
}

/**
 * Logo IncluAI — pieza de puzzle modernizada.
 *
 * Mantiene el concepto original (puzzle = inclusión, encastre, partes
 * que conectan) pero con geometría moderna: cuadrado de esquinas
 * redondeadas con una protrusión circular a la derecha y una concavidad
 * arriba. Reconocible a 16x16 (favicon), escala limpio a 256+.
 *
 * Variantes:
 * - gradient: relleno azul→verde (default — landing, hero, auth)
 * - solid: un solo color custom
 * - white: blanco sólido (para fondos oscuros sin gradient)
 * - currentColor: hereda color del padre (uso flexible en navbar)
 */
export function Logo({
  size = 32,
  variant = 'gradient',
  color = '#2E86C1',
  className,
  style,
  gradientId = 'incluai-logo-gradient',
}: Props) {
  // Path de la pieza de puzzle moderna.
  // ViewBox 32x32. Esquinas redondeadas (r=5), protrusión circular en
  // lado derecho (r=4 en y=16), concavidad circular arriba (r=4 en x=16).
  const path =
    'M 5 0 H 12 A 4 4 0 0 0 20 0 H 27 A 5 5 0 0 1 32 5 V 12 A 4 4 0 0 1 32 20 V 27 A 5 5 0 0 1 27 32 H 5 A 5 5 0 0 1 0 27 V 5 A 5 5 0 0 1 5 0 Z';

  let fill: string;
  if (variant === 'gradient') {
    fill = `url(#${gradientId})`;
  } else if (variant === 'white') {
    fill = 'white';
  } else if (variant === 'currentColor') {
    fill = 'currentColor';
  } else {
    fill = color;
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="IncluAI"
      className={className}
      style={style}
    >
      {variant === 'gradient' && (
        <defs>
          <linearGradient
            id={gradientId}
            x1="0"
            y1="0"
            x2="32"
            y2="32"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#27AE60" />
            <stop offset="1" stopColor="#2E86C1" />
          </linearGradient>
        </defs>
      )}
      <path d={path} fill={fill} />
      {/* Detalle: pequeño dot blanco interior — añade carácter sin
          afectar legibilidad a tamaños chicos */}
      <circle cx="22" cy="22" r="2" fill="white" fillOpacity="0.9" />
    </svg>
  );
}

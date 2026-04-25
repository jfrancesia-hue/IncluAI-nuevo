import type { CSSProperties } from 'react';

interface Props {
  /** Tamaño del icono en px */
  size?: number;
  /** Variante — white aplica invert filter para fondos oscuros */
  variant?: 'gradient' | 'solid' | 'white' | 'currentColor';
  className?: string;
  style?: CSSProperties;
  /** No se usa con emoji — preservado para compat con API SVG */
  gradientId?: string;
  color?: string;
}

/**
 * Logo del proyecto — template con emoji.
 *
 * CÓMO PERSONALIZAR:
 * 1) Reemplazá el emoji 🧩 por el que represente tu producto
 *    (Ideas: 📚 education, 💼 business, 🛠️ tools, 🌱 startup)
 * 2) O reemplazá el span por un SVG custom — mantené la API igual
 *    para que LogoLockup siga funcionando
 *
 * La variante 'white' aplica filter brightness(0) invert(1) para
 * blanquear el emoji sobre fondos oscuros.
 */
export function Logo({
  size = 32,
  variant = 'gradient',
  className,
  style,
}: Props) {
  const filter =
    variant === 'white'
      ? 'brightness(0) invert(1) drop-shadow(0 1px 4px rgba(0,0,0,0.3))'
      : undefined;

  return (
    <span
      role="img"
      aria-label="Logo"
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
      {/* 👇 REEMPLAZÁ este emoji por el tuyo */}
      🧩
    </span>
  );
}

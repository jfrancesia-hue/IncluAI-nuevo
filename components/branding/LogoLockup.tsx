import Link from 'next/link';
import type { CSSProperties } from 'react';
import { Logo } from './Logo';
import { Wordmark } from './Wordmark';

interface Props {
  /** Tamaño del logo (px). El wordmark se escala proporcional */
  size?: 'sm' | 'md' | 'lg';
  /** Tono — afecta wordmark color */
  tone?: 'light' | 'dark';
  /** Variante del SVG del logo */
  logoVariant?: 'gradient' | 'solid' | 'white' | 'currentColor';
  /** Color sólido si logoVariant='solid' */
  logoColor?: string;
  /** Si se pasa, envuelve el lockup en un Link a esa ruta */
  href?: string;
  /** ID único del gradient (necesario si hay 2+ lockups gradient en la misma page) */
  gradientId?: string;
  className?: string;
  style?: CSSProperties;
}

const SIZES = {
  sm: { logo: 24, text: 16, gap: 6 },
  md: { logo: 30, text: 22, gap: 8 },
  lg: { logo: 40, text: 32, gap: 10 },
};

/**
 * Combinación marca + wordmark, alineados verticalmente.
 * Reemplaza al `🧩 IncluAI` que estaba en navbar/auth/footer/etc.
 */
export function LogoLockup({
  size = 'md',
  tone = 'light',
  logoVariant = 'gradient',
  logoColor,
  href,
  gradientId,
  className,
  style,
}: Props) {
  const s = SIZES[size];
  const content = (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: s.gap,
        ...style,
      }}
    >
      <Logo
        size={s.logo}
        variant={logoVariant}
        color={logoColor}
        gradientId={gradientId}
      />
      <Wordmark size={s.text} tone={tone} accentAI={tone === 'light'} />
    </span>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="transition hover:opacity-80"
        aria-label="IncluAI — Ir al inicio"
      >
        {content}
      </Link>
    );
  }
  return content;
}

import Link from 'next/link';
import type { CSSProperties } from 'react';
import { Logo } from './Logo';
import { Wordmark } from './Wordmark';

interface Props {
  size?: 'sm' | 'md' | 'lg';
  tone?: 'light' | 'dark';
  /** Variante del logo — útil para 'white' sobre fondos oscuros */
  logoVariant?: 'gradient' | 'solid' | 'white' | 'currentColor';
  logoColor?: string;
  href?: string;
  /** Mantiene la firma anterior aunque ya no se use con emoji */
  gradientId?: string;
  className?: string;
  style?: CSSProperties;
}

const SIZES = {
  sm: { logo: 22, text: 16, gap: 6 },
  md: { logo: 28, text: 22, gap: 7 },
  lg: { logo: 38, text: 32, gap: 9 },
};

/**
 * Combinación marca + wordmark — usa el emoji puzzle 🧩 original
 * con el wordmark "IncluAI" en font-display.
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

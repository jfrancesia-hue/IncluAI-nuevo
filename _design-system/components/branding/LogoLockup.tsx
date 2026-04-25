import Link from 'next/link';
import type { CSSProperties } from 'react';
import { Logo } from './Logo';
import { Wordmark } from './Wordmark';

interface Props {
  size?: 'sm' | 'md' | 'lg';
  tone?: 'light' | 'dark';
  logoVariant?: 'gradient' | 'solid' | 'white' | 'currentColor';
  logoColor?: string;
  /** Si se pasa, envuelve el lockup en un Link */
  href?: string;
  gradientId?: string;
  /** Texto base del wordmark */
  brandBase?: string;
  /** Sufijo con gradient accent */
  brandAccent?: string;
  className?: string;
  style?: CSSProperties;
}

const SIZES = {
  sm: { logo: 22, text: 16, gap: 6 },
  md: { logo: 28, text: 22, gap: 7 },
  lg: { logo: 38, text: 32, gap: 9 },
};

/**
 * Combinación logo + wordmark horizontal. Reemplaza al típico `🧩 MyBrand`
 * de los navbar/footer.
 *
 * CÓMO PERSONALIZAR:
 *   1) Editá Logo.tsx para cambiar el icono
 *   2) Pasá brandBase + brandAccent o editá los defaults en Wordmark.tsx
 *
 * Uso:
 *   <LogoLockup href="/" size="md" />
 *   <LogoLockup size="lg" tone="dark" logoVariant="white" />
 *   <LogoLockup brandBase="My" brandAccent="App" />
 */
export function LogoLockup({
  size = 'md',
  tone = 'light',
  logoVariant = 'gradient',
  logoColor,
  href,
  gradientId,
  brandBase,
  brandAccent,
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
      <Wordmark
        size={s.text}
        tone={tone}
        accentSuffix={tone === 'light'}
        brandBase={brandBase}
        brandAccent={brandAccent}
      />
    </span>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="transition hover:opacity-80"
        aria-label="Ir al inicio"
      >
        {content}
      </Link>
    );
  }
  return content;
}

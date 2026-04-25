import type { ReactNode, CSSProperties } from 'react';

interface Props {
  children: ReactNode;
  /** Variante visual */
  variant?: 'white' | 'glass' | 'dark' | 'tinted';
  /** Tono del tinted */
  tone?: 'primary' | 'accent' | 'cta' | 'amber';
  /** Padding interno */
  padding?: 'sm' | 'md' | 'lg';
  /** Clase .bento-card para hover lift + mesh */
  hover?: boolean;
  /** Clase .spotlight-card para gradient sigue-mouse */
  spotlight?: boolean;
  className?: string;
  style?: CSSProperties;
  as?: 'div' | 'article' | 'section' | 'a' | 'li';
  href?: string;
}

const TINTS = {
  primary: {
    bg: 'linear-gradient(135deg, var(--primary-dark), var(--primary))',
    text: 'white',
    border: 'rgba(255,255,255,0.12)',
  },
  accent: {
    bg: 'linear-gradient(135deg, var(--accent-dark), var(--accent))',
    text: 'white',
    border: 'rgba(255,255,255,0.12)',
  },
  cta: {
    bg: 'linear-gradient(135deg, #9a3412, var(--cta))',
    text: 'white',
    border: 'rgba(255,255,255,0.12)',
  },
  amber: {
    bg: 'linear-gradient(135deg, #fef3c7, #fcd34d)',
    text: 'var(--text-strong)',
    border: 'rgba(146, 64, 14, 0.18)',
  },
};

const PADDINGS = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

/**
 * Card con variantes visuales y hover configurable.
 *
 * Uso:
 *   <GlassCard hover>Card básica con lift</GlassCard>
 *   <GlassCard variant="tinted" tone="accent" hover>Card verde</GlassCard>
 *   <GlassCard variant="glass" hover spotlight>Card translúcida con spotlight</GlassCard>
 */
export function GlassCard({
  children,
  variant = 'white',
  tone = 'primary',
  padding = 'md',
  hover = false,
  spotlight = false,
  className = '',
  style,
  as = 'article',
  href,
}: Props) {
  const baseClasses = `relative rounded-[20px] ${PADDINGS[padding]} ${className}`;
  const classNames = [baseClasses];
  if (hover) classNames.push('bento-card');
  if (spotlight) classNames.push('spotlight-card');

  let inlineStyle: CSSProperties = { ...style };

  if (variant === 'white') {
    classNames.push(
      'border border-[var(--border-soft)] bg-[var(--surface)] shadow-[0_2px_12px_rgba(15,34,64,0.05)]'
    );
  } else if (variant === 'glass') {
    classNames.push(
      'border border-white/15 bg-white/5 backdrop-blur ring-1 ring-white/5'
    );
  } else if (variant === 'dark') {
    classNames.push(
      'border border-white/10 bg-[#0a1a30] text-white ring-1 ring-white/5'
    );
  } else if (variant === 'tinted') {
    const t = TINTS[tone];
    inlineStyle = {
      ...inlineStyle,
      background: t.bg,
      borderColor: t.border,
      color: t.text,
    };
    classNames.push('border ring-1 ring-white/5');
  }

  const finalClass = classNames.join(' ');

  if (as === 'a' && href) {
    return (
      <a href={href} className={finalClass} style={inlineStyle}>
        {children}
      </a>
    );
  }

  const Tag = as as 'div' | 'article' | 'section' | 'li';
  return (
    <Tag className={finalClass} style={inlineStyle}>
      {children}
    </Tag>
  );
}

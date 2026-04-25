import type { ReactNode, CSSProperties } from 'react';

interface Props {
  children: ReactNode;
  /** Variante visual: white (default) | glass (translúcida) | dark | tinted */
  variant?: 'white' | 'glass' | 'dark' | 'tinted';
  /** Tono del tinted: solo aplica a variant="tinted" */
  tone?: 'docentes' | 'familias' | 'profesionales' | 'amber' | 'verde';
  /** Padding interno (sm | md | lg) */
  padding?: 'sm' | 'md' | 'lg';
  /** Si true, agrega clase .bento-card (lift + shadow al hover) */
  hover?: boolean;
  /** Si true, agrega clase .spotlight-card (gradient sigue al mouse) */
  spotlight?: boolean;
  className?: string;
  style?: CSSProperties;
  as?: 'div' | 'article' | 'section' | 'a' | 'li';
  href?: string;
}

const TINTS = {
  docentes: {
    bg: 'linear-gradient(135deg, #1F5F8A, #2E86C1)',
    text: 'white',
    border: 'rgba(255,255,255,0.12)',
  },
  familias: {
    bg: 'linear-gradient(135deg, #0d7c3a, #1e8449)',
    text: 'white',
    border: 'rgba(255,255,255,0.12)',
  },
  profesionales: {
    bg: 'linear-gradient(135deg, #5b21b6, #A569BD)',
    text: 'white',
    border: 'rgba(255,255,255,0.12)',
  },
  amber: {
    bg: 'linear-gradient(135deg, #fef3c7, #fcd34d)',
    text: '#1F2E3D',
    border: 'rgba(146, 64, 14, 0.18)',
  },
  verde: {
    bg: 'linear-gradient(135deg, #D6F0E0, #b6dec5)',
    text: '#1F2E3D',
    border: 'rgba(39, 174, 96, 0.2)',
  },
};

const PADDINGS = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export function GlassCard({
  children,
  variant = 'white',
  tone = 'docentes',
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
    classNames.push('border border-[#e2e8f0] bg-white shadow-[0_2px_12px_rgba(15,34,64,0.05)]');
  } else if (variant === 'glass') {
    classNames.push('border border-white/15 bg-white/5 backdrop-blur ring-1 ring-white/5');
  } else if (variant === 'dark') {
    classNames.push('border border-white/10 bg-[#0a1a30] text-white ring-1 ring-white/5');
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

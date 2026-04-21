import type { StrategyIllustrationId } from '@/lib/guide-schema';

type P = { className?: string };

export function StrategyIllustration({
  id,
  className,
}: {
  id: StrategyIllustrationId;
  className?: string;
}) {
  const cls = className ?? 'h-full w-full';
  switch (id) {
    case 'agenda-pictografica':
      return <AgendaIllustration className={cls} />;
    case 'tiras-fracciones':
    case 'material-manipulativo':
      return <MaterialIllustration className={cls} />;
    case 'reloj-pausa':
      return <RelojPausaIllustration className={cls} />;
    case 'pareja-roles':
    case 'trabajo-grupal':
      return <ParejaIllustration className={cls} />;
    case 'rutina-visual':
      return <RutinaIllustration className={cls} />;
    case 'recurso-digital':
      return <RecursoDigitalIllustration className={cls} />;
    default:
      return <GenericIllustration className={cls} />;
  }
}

function AgendaIllustration({ className }: P) {
  return (
    <svg viewBox="0 0 280 160" className={className} aria-hidden>
      <rect x="70" y="20" width="140" height="120" rx="10" fill="white" stroke="#15803d" strokeWidth="2.5" />
      <rect x="85" y="35" width="110" height="12" rx="3" fill="#15803d" />
      <g>
        <rect x="85" y="55" width="24" height="24" rx="4" fill="#fde68a" />
        <circle cx="97" cy="67" r="6" fill="#c2410c" />
      </g>
      <g>
        <rect x="113" y="55" width="24" height="24" rx="4" fill="#bfdbfe" />
        <path d="M118 72 L125 60 L131 70 L137 63" stroke="#1e3a5f" strokeWidth="2" fill="none" />
      </g>
      <g>
        <rect x="141" y="55" width="24" height="24" rx="4" fill="#fecaca" />
        <rect x="147" y="61" width="12" height="12" fill="#c2410c" />
      </g>
      <g>
        <rect x="169" y="55" width="24" height="24" rx="4" fill="#c4b5fd" />
        <circle cx="181" cy="67" r="7" stroke="#1e3a5f" strokeWidth="2" fill="none" />
      </g>
      <rect x="85" y="90" width="16" height="16" rx="3" fill="#15803d" />
      <path d="M88 98 L92 102 L98 94" stroke="white" strokeWidth="2.5" fill="none" />
      <rect x="105" y="90" width="16" height="16" rx="3" fill="#15803d" />
      <path d="M108 98 L112 102 L118 94" stroke="white" strokeWidth="2.5" fill="none" />
      <rect x="125" y="90" width="16" height="16" rx="3" fill="none" stroke="#cbd5e1" strokeWidth="2" />
      <rect x="145" y="90" width="16" height="16" rx="3" fill="none" stroke="#cbd5e1" strokeWidth="2" />
      <rect x="85" y="116" width="100" height="6" rx="2" fill="#e2e8f0" />
    </svg>
  );
}

function MaterialIllustration({ className }: P) {
  return (
    <svg viewBox="0 0 280 160" className={className} aria-hidden>
      <rect x="30" y="25" width="220" height="110" rx="8" fill="#1e3a5f" />
      <rect x="50" y="45" width="180" height="14" rx="3" fill="#c2410c" />
      <text x="140" y="56" fontSize="10" fill="white" textAnchor="middle" fontFamily="DM Sans">1 entero</text>
      <rect x="50" y="65" width="87" height="14" rx="3" fill="#15803d" />
      <rect x="140" y="65" width="87" height="14" rx="3" fill="#15803d" />
      <text x="94" y="76" fontSize="9" fill="white" textAnchor="middle">1/2</text>
      <text x="185" y="76" fontSize="9" fill="white" textAnchor="middle">1/2</text>
      <rect x="50" y="85" width="42" height="14" rx="3" fill="#fbbf24" />
      <rect x="95" y="85" width="42" height="14" rx="3" fill="#fbbf24" />
      <rect x="140" y="85" width="42" height="14" rx="3" fill="#fbbf24" />
      <rect x="185" y="85" width="42" height="14" rx="3" fill="#fbbf24" />
      <rect x="50" y="105" width="20" height="14" rx="3" fill="#f87171" />
      <rect x="72" y="105" width="20" height="14" rx="3" fill="#f87171" />
      <rect x="95" y="105" width="20" height="14" rx="3" fill="#f87171" />
      <rect x="118" y="105" width="20" height="14" rx="3" fill="#f87171" />
      <rect x="140" y="105" width="20" height="14" rx="3" fill="#f87171" />
      <rect x="163" y="105" width="20" height="14" rx="3" fill="#f87171" />
      <rect x="185" y="105" width="20" height="14" rx="3" fill="#f87171" />
      <rect x="208" y="105" width="20" height="14" rx="3" fill="#f87171" />
      <text x="140" y="140" fontSize="13" fill="#fbbf24" textAnchor="middle" fontFamily="Fraunces" fontWeight="700">
        1/2 = 2/4 = 4/8
      </text>
    </svg>
  );
}

function RelojPausaIllustration({ className }: P) {
  return (
    <svg viewBox="0 0 280 160" className={className} aria-hidden>
      <circle cx="110" cy="80" r="52" fill="white" stroke="#1e3a5f" strokeWidth="3" />
      <circle cx="110" cy="80" r="4" fill="#1e3a5f" />
      <path d="M110 80 L110 42" stroke="#1e3a5f" strokeWidth="3" />
      <path d="M110 80 L140 92" stroke="#15803d" strokeWidth="3" />
      <g stroke="#1e3a5f" strokeWidth="2">
        <line x1="110" y1="32" x2="110" y2="38" />
        <line x1="158" y1="80" x2="152" y2="80" />
        <line x1="110" y1="128" x2="110" y2="122" />
        <line x1="62" y1="80" x2="68" y2="80" />
      </g>
      <path d="M110 80 L110 28 A52 52 0 0 1 162 80 Z" fill="#15803d" opacity=".2" />
      <g transform="translate(195,55)">
        <circle cx="30" cy="30" r="30" fill="#c2410c" />
        <rect x="20" y="17" width="7" height="26" rx="2" fill="white" />
        <rect x="33" y="17" width="7" height="26" rx="2" fill="white" />
      </g>
      <text x="225" y="115" fontSize="11" fill="#1e3a5f" textAnchor="middle" fontWeight="600">
        +50% tiempo
      </text>
    </svg>
  );
}

function ParejaIllustration({ className }: P) {
  return (
    <svg viewBox="0 0 280 160" className={className} aria-hidden>
      <g>
        <circle cx="105" cy="72" r="22" fill="#fde68a" />
        <rect x="85" y="94" width="40" height="45" rx="10" fill="#15803d" />
        <text x="105" y="135" fontSize="9" fill="white" fontWeight="700" textAnchor="middle">
          ARMADOR
        </text>
      </g>
      <g>
        <circle cx="180" cy="72" r="22" fill="#c4b5fd" />
        <rect x="160" y="94" width="40" height="45" rx="10" fill="#c2410c" />
        <text x="180" y="135" fontSize="9" fill="white" fontWeight="700" textAnchor="middle">
          NARRADOR
        </text>
      </g>
      <rect x="120" y="100" width="45" height="18" rx="4" fill="#fbf7f0" stroke="#1e3a5f" strokeWidth="2" />
      <rect x="128" y="104" width="12" height="10" rx="2" fill="#c2410c" />
      <rect x="142" y="104" width="12" height="10" rx="2" fill="#c2410c" />
      <path d="M130 50 Q142 30 155 50" stroke="#1e3a5f" strokeWidth="2.5" fill="none" markerEnd="url(#ill-ar)" />
      <defs>
        <marker id="ill-ar" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#1e3a5f" />
        </marker>
      </defs>
    </svg>
  );
}

function RutinaIllustration({ className }: P) {
  return (
    <svg viewBox="0 0 280 160" className={className} aria-hidden>
      <circle cx="60" cy="80" r="22" fill="#fde68a" stroke="#c2410c" strokeWidth="2.5" />
      <text x="60" y="85" fontSize="11" fontWeight="700" fill="#78350f" textAnchor="middle">1</text>
      <path d="M82 80 h26" stroke="#c2410c" strokeWidth="3" strokeDasharray="4 3" />
      <circle cx="130" cy="80" r="22" fill="#bfdbfe" stroke="#1e3a5f" strokeWidth="2.5" />
      <text x="130" y="85" fontSize="11" fontWeight="700" fill="#1e3a5f" textAnchor="middle">2</text>
      <path d="M152 80 h26" stroke="#c2410c" strokeWidth="3" strokeDasharray="4 3" />
      <circle cx="200" cy="80" r="22" fill="#dcfce7" stroke="#15803d" strokeWidth="2.5" />
      <text x="200" y="85" fontSize="11" fontWeight="700" fill="#14532d" textAnchor="middle">3</text>
      <path d="M60 120 l0 12" stroke="#15803d" strokeWidth="2" />
      <path d="M130 120 l0 12" stroke="#15803d" strokeWidth="2" />
      <path d="M200 120 l0 12" stroke="#15803d" strokeWidth="2" />
    </svg>
  );
}

function RecursoDigitalIllustration({ className }: P) {
  return (
    <svg viewBox="0 0 280 160" className={className} aria-hidden>
      <rect x="60" y="30" width="160" height="100" rx="8" fill="white" stroke="#1e3a5f" strokeWidth="3" />
      <rect x="60" y="30" width="160" height="18" rx="8" fill="#1e3a5f" />
      <circle cx="72" cy="39" r="3" fill="#f87171" />
      <circle cx="82" cy="39" r="3" fill="#fbbf24" />
      <circle cx="92" cy="39" r="3" fill="#86efac" />
      <rect x="75" y="60" width="130" height="10" rx="2" fill="#e2e8f0" />
      <rect x="75" y="78" width="90" height="10" rx="2" fill="#15803d" />
      <rect x="75" y="96" width="110" height="10" rx="2" fill="#e2e8f0" />
      <rect x="75" y="114" width="60" height="10" rx="2" fill="#c2410c" />
    </svg>
  );
}

function GenericIllustration({ className }: P) {
  return (
    <svg viewBox="0 0 280 160" className={className} aria-hidden>
      <circle cx="140" cy="80" r="50" fill="#dcfce7" />
      <path d="M120 80 l12 12 l28 -28" stroke="#15803d" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="60" cy="40" r="4" fill="#fbbf24" />
      <circle cx="230" cy="60" r="3" fill="#c2410c" />
      <circle cx="210" cy="120" r="5" fill="#60a5fa" />
      <circle cx="70" cy="120" r="3" fill="#f87171" />
    </svg>
  );
}

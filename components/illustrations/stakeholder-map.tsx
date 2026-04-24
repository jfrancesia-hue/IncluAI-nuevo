import type { Stakeholder } from '@/lib/guide-schema';

const TONE: Record<
  Stakeholder['color'],
  { fill: string; stroke: string; text: string; sub: string }
> = {
  amber: { fill: '#fef3c7', stroke: '#E67E22', text: '#78350f', sub: '#92400e' },
  blue: { fill: '#dbeafe', stroke: '#2E86C1', text: '#2E86C1', sub: '#1e40af' },
  pink: { fill: '#fce7f3', stroke: '#be185d', text: '#9f1239', sub: '#9f1239' },
  green: { fill: '#D6F0E0', stroke: '#27AE60', text: '#14532d', sub: '#166534' },
};

const POSITIONS: { x: number; y: number }[] = [
  { x: 150, y: 90 },
  { x: 570, y: 90 },
  { x: 150, y: 350 },
  { x: 570, y: 350 },
];

export function StakeholderMap({
  centerLabel,
  centerSublabel,
  stakeholders,
}: {
  centerLabel: string;
  centerSublabel?: string;
  stakeholders: Stakeholder[];
}) {
  const items = stakeholders.slice(0, 4);
  return (
    <svg
      viewBox="0 0 720 440"
      className="h-auto w-full"
      aria-label="Mapa de actores de coordinación"
    >
      <g stroke="#27AE60" strokeWidth="2" strokeDasharray="4 4" opacity=".5">
        {items.map((_, i) => {
          const p = POSITIONS[i];
          return <line key={i} x1="360" y1="220" x2={p.x} y2={p.y} />;
        })}
      </g>
      <g>
        <circle cx="360" cy="220" r="80" fill="none" stroke="#27AE60" strokeWidth="2" strokeDasharray="3 3" opacity=".4" />
        <circle cx="360" cy="220" r="70" fill="#27AE60" />
        <text x="360" y="210" fontSize="13" fill="white" textAnchor="middle" fontFamily="DM Sans" fontWeight="700">
          {centerLabel}
        </text>
        {centerSublabel && (
          <text x="360" y="232" fontSize="10" fill="#D6F0E0" textAnchor="middle">
            {centerSublabel}
          </text>
        )}
      </g>
      {items.map((s, i) => {
        const p = POSITIONS[i];
        const tone = TONE[s.color];
        return (
          <g key={s.id}>
            <circle cx={p.x} cy={p.y} r="46" fill={tone.fill} stroke={tone.stroke} strokeWidth="2.5" />
            <text
              x={p.x}
              y={s.sublabel ? p.y - 4 : p.y + 4}
              fontSize="11"
              fill={tone.text}
              textAnchor="middle"
              fontWeight="700"
            >
              {s.label}
            </text>
            {s.sublabel && (
              <text x={p.x} y={p.y + 12} fontSize="9" fill={tone.sub} textAnchor="middle">
                {s.sublabel}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

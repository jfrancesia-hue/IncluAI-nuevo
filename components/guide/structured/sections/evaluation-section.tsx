import type { GuideSection, RubricItem } from '@/lib/guide-schema';
import { IconCheck } from '@/components/illustrations/guide-icons';

type EvaluationSectionData = Extract<GuideSection, { kind: 'evaluation' }>;

export function EvaluationSection({
  section,
  anchorId,
  index,
}: {
  section: EvaluationSectionData;
  anchorId: string;
  index: number;
}) {
  return (
    <section id={anchorId}>
      <div className="mb-6 flex items-center gap-3">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#c4b5fd] font-serif text-sm font-bold text-[#4c1d95]">
          {String(index).padStart(2, '0')}
        </span>
        <h2 className="font-serif text-2xl font-bold text-[#1e3a5f] sm:text-3xl">
          {section.title}
        </h2>
      </div>
      {section.intro && (
        <p className="mb-8 max-w-2xl text-sm text-[#5c6b7f]">{section.intro}</p>
      )}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="rounded-[16px] border border-[#e2e8f0] bg-white p-6 shadow-[0_2px_12px_rgba(15,34,64,0.06)]">
          <div className="mb-4 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e2e8f0] text-[#475569]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M4 6h16M4 12h16M4 18h16" stroke="#475569" strokeWidth="2" />
              </svg>
            </span>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#5c6b7f]">
              Evaluación tradicional
            </p>
          </div>
          <ul className="flex flex-col gap-3 text-sm">
            {section.traditional.map((t, i) => (
              <li key={i} className="flex gap-2 text-[#1a2332]">
                <span className="text-[#94a3b8]">○</span> {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative rounded-[16px] border-2 border-[#15803d] bg-[#dcfce7]/30 p-6">
          {section.adaptedRibbon && (
            <span className="absolute -top-3 left-6 rounded-full bg-[#15803d] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
              {section.adaptedRibbon}
            </span>
          )}
          <div className="mb-4 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#15803d] text-white">
              <IconCheck width={16} height={16} stroke="white" strokeWidth={2.5} />
            </span>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#15803d]">
              Evaluación adaptada
            </p>
          </div>
          <ul className="flex flex-col gap-3 text-sm">
            {section.adapted.map((a, i) => (
              <li key={i} className="flex gap-2 text-[#1a2332]">
                <span className="font-bold text-[#15803d]">{i + 1}.</span>
                <span>{a}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {section.rubric && <Rubric rubric={section.rubric} />}
    </section>
  );
}

function Rubric({
  rubric,
}: {
  rubric: NonNullable<EvaluationSectionData['rubric']>;
}) {
  return (
    <div className="mt-6 rounded-[16px] border border-[#e2e8f0] bg-white p-6 shadow-[0_2px_12px_rgba(15,34,64,0.06)]">
      <div className="mb-4 flex items-center justify-between">
        <p className="font-serif text-lg font-bold text-[#1e3a5f]">
          Mini rúbrica{rubric.subjectName ? ` — ${rubric.subjectName}` : ''}
        </p>
        <span className="text-xs text-[#5c6b7f]">{rubric.scaleNote ?? 'escala 0-4'}</span>
      </div>
      <div className="flex flex-col gap-4">
        {rubric.items.map((it, i) => (
          <RubricBar key={i} item={it} />
        ))}
      </div>
    </div>
  );
}

function RubricBar({ item }: { item: RubricItem }) {
  const pct = Math.round((Math.min(Math.max(item.score, 0), 4) / 4) * 100);
  const barColor =
    item.tone === 'success'
      ? '#15803d'
      : item.tone === 'warn'
        ? '#c2410c'
        : '#94a3b8';
  const labelTone =
    item.tone === 'success'
      ? 'text-[#15803d]'
      : item.tone === 'warn'
        ? 'text-[#c2410c]'
        : 'text-[#475569]';
  return (
    <div>
      <div className="mb-1.5 flex justify-between text-sm">
        <span className="text-[#1e3a5f]">{item.criterion}</span>
        <span className={`font-bold ${labelTone}`}>
          {item.scoreLabel ?? `${item.score} / 4`}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-[#e2e8f0]">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: barColor }} />
      </div>
    </div>
  );
}

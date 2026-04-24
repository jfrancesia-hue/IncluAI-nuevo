import type { GuideSection } from '@/lib/guide-schema';
import { IconCheck, IconInfo } from '@/components/illustrations/guide-icons';

type TimelineSectionData = Extract<GuideSection, { kind: 'timeline' }>;

export function TimelineSection({
  section,
  anchorId,
  index,
}: {
  section: TimelineSectionData;
  anchorId: string;
  index: number;
}) {
  return (
    <section id={anchorId}>
      <div className="mb-6 flex items-center gap-3">
        <NumberChip index={index} tone="leaf" />
        <h2 className="font-serif text-2xl font-bold text-[#2E86C1] sm:text-3xl">
          {section.title}
        </h2>
      </div>
      {section.intro && (
        <p className="mb-8 max-w-2xl text-sm text-[#4A5968]">{section.intro}</p>
      )}

      <ol className="relative flex flex-col gap-5 border-l-[3px] border-dashed border-[#27AE60]/40 pl-6">
        {section.items.map((item, i) => {
          const isLegal = !!item.legalRef;
          return (
            <li key={i} className="relative">
              <span
                className={`absolute -left-[34px] top-1 flex h-7 w-7 items-center justify-center rounded-full border-[3px] bg-white ${
                  isLegal ? 'border-[#E67E22]' : 'border-[#27AE60]'
                }`}
              >
                {isLegal ? (
                  <IconInfo width={14} height={14} stroke="#E67E22" />
                ) : (
                  <IconCheck width={14} height={14} stroke="#27AE60" strokeWidth={3} />
                )}
              </span>
              <div
                className={`rounded-[14px] p-5 ${
                  isLegal
                    ? 'border-l-[4px] border-[#E67E22] bg-[#fef3c7]/40'
                    : 'border border-[#e2e8f0] bg-white shadow-[0_2px_12px_rgba(15,34,64,0.06)]'
                }`}
              >
                <p
                  className={`text-xs font-semibold uppercase tracking-wider ${
                    isLegal ? 'text-[#E67E22]' : 'text-[#27AE60]'
                  }`}
                >
                  {isLegal ? 'Marco legal aplicado' : `Prioridad ${item.prioridad}`}
                </p>
                <p className="font-serif mt-1 text-lg font-bold text-[#2E86C1]">{item.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-[#4A5968]">{item.body}</p>
                {item.note && !isLegal && (
                  <div className="mt-3 inline-flex items-center gap-2 rounded-[8px] bg-[#fef3c7] px-3 py-1.5 text-xs text-[#78350f]">
                    <IconInfo width={12} height={12} stroke="#78350f" />
                    {item.note}
                  </div>
                )}
                {isLegal && item.legalRef && (
                  <p className="mt-2 text-xs font-semibold text-[#78350f]">{item.legalRef}</p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function NumberChip({ index, tone }: { index: number; tone: 'leaf' | 'navy' | 'amber' }) {
  const bg =
    tone === 'leaf'
      ? 'bg-[#D6F0E0] text-[#27AE60]'
      : tone === 'navy'
        ? 'bg-[#2E86C1] text-white'
        : 'bg-[#E67E22] text-white';
  return (
    <span
      className={`inline-flex h-7 w-7 items-center justify-center rounded-full font-serif text-sm font-bold ${bg}`}
    >
      {String(index).padStart(2, '0')}
    </span>
  );
}

import type { GuideSection, Quote } from '@/lib/guide-schema';

type CommunicationSectionData = Extract<GuideSection, { kind: 'communication' }>;

export function CommunicationSection({
  section,
  anchorId,
  index,
}: {
  section: CommunicationSectionData;
  anchorId: string;
  index: number;
}) {
  return (
    <section id={anchorId}>
      <div className="mb-6 flex items-center gap-3">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#fde68a] font-serif text-sm font-bold text-[#78350f]">
          {String(index).padStart(2, '0')}
        </span>
        <h2 className="font-serif text-2xl font-bold text-[#2E86C1] sm:text-3xl">
          {section.title}
        </h2>
      </div>
      {section.intro && (
        <p className="mb-8 max-w-2xl text-sm text-[#4A5968]">{section.intro}</p>
      )}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#D6F0E0] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#27AE60]">
            ✓ Sí decí
          </p>
          <div className="flex flex-col gap-3">
            {section.sayThis.map((q, i) => (
              <QuoteCard key={i} quote={q} tone="good" />
            ))}
          </div>
        </div>
        <div>
          <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#fee2e2] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#b91c1c]">
            ✗ Evitá
          </p>
          <div className="flex flex-col gap-3">
            {section.avoid.map((q, i) => (
              <QuoteCard key={i} quote={q} tone="bad" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function QuoteCard({ quote, tone }: { quote: Quote; tone: 'good' | 'bad' }) {
  if (tone === 'good') {
    return (
      <blockquote className="relative rounded-[14px] border-l-[3px] border-[#27AE60] bg-white p-4 shadow-[0_2px_12px_rgba(15,34,64,0.06)]">
        <p className="text-sm italic leading-relaxed text-[#2E86C1]">“{quote.text}”</p>
        {quote.tag && (
          <p className="mt-2 text-[11px] font-semibold uppercase tracking-wider text-[#27AE60]">
            {quote.tag}
          </p>
        )}
      </blockquote>
    );
  }
  return (
    <blockquote className="relative rounded-[14px] border-l-[3px] border-[#f87171] bg-white p-4 shadow-[0_2px_12px_rgba(15,34,64,0.06)]">
      <p className="text-sm italic leading-relaxed text-[#64748b] line-through decoration-[#f87171]/60">
        “{quote.text}”
      </p>
      {quote.tag && (
        <p className="mt-2 text-[11px] font-semibold uppercase tracking-wider text-[#b91c1c]">
          {quote.tag}
        </p>
      )}
    </blockquote>
  );
}

import type { GuideSection, Resource } from '@/lib/guide-schema';
import { IconPrinter, IconCloud, IconHome } from '@/components/illustrations/guide-icons';
import { RevealOnScroll } from '../reveal-on-scroll';

type ResourcesSectionData = Extract<GuideSection, { kind: 'resources' }>;

const KIND_META: Record<
  Resource['kind'],
  { tagLabel: string; tagClass: string; bg: string; iconColor: string }
> = {
  imprimible: {
    tagLabel: 'Imprimible',
    tagClass: 'bg-[#fef3c7] text-[#c2410c]',
    bg: 'bg-[#fef3c7]',
    iconColor: '#c2410c',
  },
  digital: {
    tagLabel: 'Digital gratuito',
    tagClass: 'bg-[#dbeafe] text-[#1e3a5f]',
    bg: 'bg-[#dbeafe]',
    iconColor: '#1e3a5f',
  },
  casa: {
    tagLabel: 'De la casa',
    tagClass: 'bg-[#dcfce7] text-[#15803d]',
    bg: 'bg-[#dcfce7]',
    iconColor: '#15803d',
  },
};

export function ResourcesSection({
  section,
  anchorId,
  index,
}: {
  section: ResourcesSectionData;
  anchorId: string;
  index: number;
}) {
  return (
    <section id={anchorId}>
      <div className="mb-6 flex items-center gap-3">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#c2410c] font-serif text-sm font-bold text-white">
          {String(index).padStart(2, '0')}
        </span>
        <h2 className="font-serif text-2xl font-bold text-[#1e3a5f] sm:text-3xl">
          {section.title}
        </h2>
      </div>
      {section.intro && (
        <p className="mb-8 max-w-2xl text-sm text-[#5c6b7f]">{section.intro}</p>
      )}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {section.resources.map((r, i) => {
          const meta = KIND_META[r.kind];
          const Icon =
            r.kind === 'imprimible' ? IconPrinter : r.kind === 'digital' ? IconCloud : IconHome;
          const d = (((i % 3) + 1) as 1 | 2 | 3);
          return (
            <RevealOnScroll
              key={i}
              delay={d}
              as="article"
              className="flex flex-col overflow-hidden rounded-[16px] border border-[#e2e8f0] bg-white shadow-[0_2px_12px_rgba(15,34,64,0.06)]"
            >
              <div className={`flex h-32 items-center justify-center ${meta.bg}`}>
                <Icon width={64} height={64} stroke={meta.iconColor} strokeWidth={2.5} />
              </div>
              <div className="flex flex-1 flex-col gap-3 p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ${meta.tagClass}`}
                  >
                    {meta.tagLabel}
                  </span>
                  {r.extraTag && (
                    <span className="rounded-md bg-[#dcfce7] px-2 py-0.5 text-[10px] font-bold uppercase text-[#15803d]">
                      {r.extraTag}
                    </span>
                  )}
                </div>
                <p className="font-serif text-base font-bold text-[#1e3a5f]">{r.title}</p>
                <p className="text-xs text-[#5c6b7f]">{r.description}</p>
                <a
                  href={r.href ?? '#'}
                  target={r.href ? '_blank' : undefined}
                  rel={r.href ? 'noopener noreferrer' : undefined}
                  className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-[#15803d] hover:underline"
                >
                  {r.ctaLabel} <span>→</span>
                </a>
              </div>
            </RevealOnScroll>
          );
        })}
      </div>
    </section>
  );
}

import type { GuideSection } from '@/lib/guide-schema';
import { IconAlertTriangle } from '@/components/illustrations/guide-icons';

type AvoidSectionData = Extract<GuideSection, { kind: 'avoid' }>;

export function AvoidSection({
  section,
  anchorId,
  index,
}: {
  section: AvoidSectionData;
  anchorId: string;
  index: number;
}) {
  return (
    <section id={anchorId}>
      <div className="mb-6 flex items-center gap-3">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#fecaca] font-serif text-sm font-bold text-[#991b1b]">
          {String(index).padStart(2, '0')}
        </span>
        <h2 className="font-serif text-2xl font-bold text-[#1e3a5f] sm:text-3xl">
          {section.title}
        </h2>
      </div>

      <div className="overflow-hidden rounded-[18px] border-[1.5px] border-[#fca5a5] bg-gradient-to-br from-[#fef2f2] to-[#fee2e2]">
        <div className="flex items-center gap-3 border-b border-[#fca5a5]/60 bg-white/50 px-6 py-4">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#b91c1c] text-white">
            <IconAlertTriangle width={16} height={16} stroke="white" />
          </span>
          <p className="font-serif text-lg font-bold text-[#7f1d1d]">
            {section.intro ?? 'Errores comunes que parecen inclusivos pero no lo son'}
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-2">
          {section.warnings.map((w, i) => (
            <div key={i} className="flex items-start gap-3 rounded-[12px] bg-white/70 p-4">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#b91c1c] text-xs font-bold text-white">
                {i + 1}
              </span>
              <div>
                <p className="text-sm font-semibold text-[#7f1d1d]">{w.title}</p>
                <p className="mt-0.5 text-xs text-[#9f1239]">{w.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

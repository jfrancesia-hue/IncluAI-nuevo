import Image from 'next/image';
import type { GuideSection, Stakeholder } from '@/lib/guide-schema';
import { PHOTOS } from '@/lib/photos';
import { StakeholderMap } from '@/components/illustrations/stakeholder-map';

type CoordinationSectionData = Extract<GuideSection, { kind: 'coordination' }>;

const COLOR_TITLE: Record<Stakeholder['color'], string> = {
  amber: 'text-[#c2410c]',
  blue: 'text-[#1e3a5f]',
  pink: 'text-[#9f1239]',
  green: 'text-[#15803d]',
};

const COLOR_LABEL: Record<Stakeholder['id'], string> = {
  familia: 'Familia',
  eoe: 'EOE',
  'equipo-docente': 'Equipo docente',
  especialistas: 'Especialistas',
  otro: 'Otros',
};

export function CoordinationSection({
  section,
  anchorId,
  index,
}: {
  section: CoordinationSectionData;
  anchorId: string;
  index: number;
}) {
  return (
    <section id={anchorId}>
      <div className="mb-6 flex items-center gap-3">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#bfdbfe] font-serif text-sm font-bold text-[#1e3a5f]">
          {String(index).padStart(2, '0')}
        </span>
        <h2 className="font-serif text-2xl font-bold text-[#1e3a5f] sm:text-3xl">
          {section.title}
        </h2>
      </div>
      {section.intro && (
        <p className="mb-8 max-w-2xl text-sm text-[#5c6b7f]">{section.intro}</p>
      )}

      <div className="relative overflow-hidden rounded-[18px] border border-[#e2e8f0] bg-white p-6 shadow-[0_2px_12px_rgba(15,34,64,0.06)]">
        <div aria-hidden className="absolute inset-0 opacity-[0.04]">
          <Image src={PHOTOS.coordinacionBackdrop} alt="" fill sizes="100vw" className="object-cover" />
        </div>
        <div className="relative mx-auto max-w-[720px]">
          <StakeholderMap
            centerLabel={section.centerLabel}
            centerSublabel={section.centerSublabel}
            stakeholders={section.stakeholders}
          />
        </div>

        <div className="relative mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {section.stakeholders.slice(0, 4).map((s) => (
            <div key={s.id} className="rounded-[12px] border border-[#e2e8f0] bg-[#fbf7f0] p-4">
              <p className={`font-serif mb-2 text-sm font-bold ${COLOR_TITLE[s.color]}`}>
                {s.label || COLOR_LABEL[s.id]}
              </p>
              <ul className="flex flex-col gap-1.5 text-xs text-[#5c6b7f]">
                {s.actions.map((a, i) => (
                  <li key={i}>• {a}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

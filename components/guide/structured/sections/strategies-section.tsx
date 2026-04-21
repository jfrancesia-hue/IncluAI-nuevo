import Image from 'next/image';
import type { GuideSection, Strategy, StrategyIllustrationId } from '@/lib/guide-schema';
import { PHOTOS } from '@/lib/photos';
import { StrategyIllustration } from '@/components/illustrations/strategy-illustrations';
import { RevealOnScroll } from '../reveal-on-scroll';

type StrategiesSectionData = Extract<GuideSection, { kind: 'strategies' }>;

const DUA_LABEL: Record<Strategy['dua'], { label: string; bg: string; text: string }> = {
  representacion: { label: 'DUA · Representación', bg: 'bg-white/90', text: 'text-[#15803d]' },
  accion: { label: 'DUA · Acción', bg: 'bg-white/90', text: 'text-[#c2410c]' },
  motivacion: { label: 'DUA · Motivación', bg: 'bg-white/90', text: 'text-[#1e3a5f]' },
  colaboracion: { label: 'DUA · Colaboración', bg: 'bg-white/90', text: 'text-[#9f1239]' },
};

const HEADER_BG: Record<Strategy['dua'], string> = {
  representacion: 'bg-gradient-to-br from-[#dcfce7] to-[#bbf7d0]',
  accion: 'bg-gradient-to-br from-[#fef3c7] to-[#fde68a]',
  motivacion: 'bg-gradient-to-br from-[#bfdbfe] to-[#c4b5fd]',
  colaboracion: 'bg-gradient-to-br from-[#fecaca] to-[#fca5a5]',
};

// Combina ilustración SVG con una foto real semi-transparente por DUA,
// dando profundidad sin ocultar la claridad del svg.
const PHOTO_BY_ILLUSTRATION: Partial<Record<StrategyIllustrationId, keyof typeof PHOTOS>> = {
  'agenda-pictografica': 'strategyAgenda',
  'tiras-fracciones': 'strategyManipulativo',
  'material-manipulativo': 'strategyManipulativo',
  'reloj-pausa': 'strategyRitmo',
  'pareja-roles': 'strategyColaboracion',
  'trabajo-grupal': 'strategyColaboracion',
  'rutina-visual': 'strategyGenerica',
  'recurso-digital': 'strategyGenerica',
  generic: 'strategyGenerica',
};

export function StrategiesSection({
  section,
  anchorId,
  index,
}: {
  section: StrategiesSectionData;
  anchorId: string;
  index: number;
}) {
  return (
    <section id={anchorId}>
      <div className="mb-6 flex items-center gap-3">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#1e3a5f] font-serif text-sm font-bold text-white">
          {String(index).padStart(2, '0')}
        </span>
        <h2 className="font-serif text-2xl font-bold text-[#1e3a5f] sm:text-3xl">
          {section.title}
        </h2>
      </div>
      {section.intro && (
        <p className="mb-8 max-w-2xl text-sm text-[#5c6b7f]">{section.intro}</p>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {section.strategies.map((s, i) => {
          const d = (((i % 4) + 1) as 1 | 2 | 3 | 4);
          return (
            <RevealOnScroll key={i} delay={d} as="div">
              <StrategyCard strategy={s} />
            </RevealOnScroll>
          );
        })}
      </div>

      {section.tip && (
        <div className="mt-6 flex items-start gap-4 rounded-[16px] border-l-[4px] border-[#15803d] bg-[#dcfce7]/40 p-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#15803d] text-white">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2v2m0 16v2M4 12H2m20 0h-2M6 6L4.5 4.5M19.5 19.5L18 18M6 18l-1.5 1.5M19.5 4.5L18 6"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="12" cy="12" r="4" stroke="white" strokeWidth="2" />
            </svg>
          </div>
          <div>
            <p className="font-serif text-base font-bold text-[#1e3a5f]">Tip de docente</p>
            <p className="mt-1 text-sm text-[#1a2332]">{section.tip}</p>
          </div>
        </div>
      )}
    </section>
  );
}

function StrategyCard({ strategy }: { strategy: Strategy }) {
  const duaMeta = DUA_LABEL[strategy.dua];
  const headerBg = HEADER_BG[strategy.dua];
  const photoKey = PHOTO_BY_ILLUSTRATION[strategy.illustration] ?? 'strategyGenerica';
  const photoSrc = PHOTOS[photoKey];

  return (
    <article className="group flex flex-col overflow-hidden rounded-[18px] border border-[#e2e8f0] bg-white shadow-[0_2px_12px_rgba(15,34,64,0.06)] transition hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(15,34,64,0.12)]">
      <div className={`relative h-44 overflow-hidden ${headerBg}`}>
        {/* Foto real muy sutil de fondo */}
        <div aria-hidden className="absolute inset-0 opacity-30 mix-blend-multiply">
          <Image
            src={photoSrc}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, 400px"
            className="object-cover"
          />
        </div>
        <div className="relative h-full w-full">
          <StrategyIllustration id={strategy.illustration} />
        </div>
        <span
          className={`absolute left-4 top-4 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${duaMeta.bg} ${duaMeta.text}`}
        >
          {duaMeta.label}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-2">
          <p className="font-serif text-lg font-bold text-[#1e3a5f]">{strategy.title}</p>
          {strategy.disabilityTag && (
            <span className="shrink-0 rounded-md bg-[#dcfce7] px-2 py-0.5 text-[11px] font-bold text-[#15803d]">
              {strategy.disabilityTag}
            </span>
          )}
        </div>
        <p className="text-sm leading-relaxed text-[#5c6b7f]">{strategy.body}</p>
        {(strategy.prepTime || strategy.externalLink) && (
          <div className="mt-auto flex items-center justify-between border-t border-[#e2e8f0] pt-3 text-xs">
            <span className="text-[#5c6b7f]">{strategy.prepTime ?? ''}</span>
            {strategy.externalLink && (
              <a
                href={strategy.externalLink.href ?? '#'}
                className="font-semibold text-[#15803d] hover:underline"
                target={strategy.externalLink.href ? '_blank' : undefined}
                rel={strategy.externalLink.href ? 'noopener noreferrer' : undefined}
              >
                {strategy.externalLink.label} →
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

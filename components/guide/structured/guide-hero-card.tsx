import Image from 'next/image';
import type { GuideChip, StructuredGuide } from '@/lib/guide-schema';
import { PHOTOS } from '@/lib/photos';
import { HeroSceneIllustration } from '@/components/illustrations/hero-scene';
import { GuideHeroActions } from './guide-hero-actions';

const TONE_STYLES: Record<GuideChip['tone'], string> = {
  neutral: 'border-white/20 bg-white/5 text-white/90',
  info: 'border-white/20 bg-white/10 text-[#bfdbfe]',
  success: 'border-[#86efac]/40 bg-[#15803d]/25 text-[#bbf7d0]',
  warn: 'border-[#fed7aa]/40 bg-[#c2410c]/25 text-[#fed7aa]',
  danger: 'border-[#fecaca]/40 bg-[#b91c1c]/25 text-[#fecaca]',
};

export function GuideHeroCard({
  guide,
  markdown,
  createdAtIso,
}: {
  guide: StructuredGuide;
  markdown: string;
  createdAtIso: string;
}) {
  const relativeTime = getRelativeTime(createdAtIso);

  return (
    <article className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#0f2240] via-[#1e3a5f] to-[#0e4f68] p-8 text-white shadow-[0_12px_40px_rgba(15,34,64,0.25)] sm:p-12">
      <div aria-hidden className="absolute inset-0 opacity-20 mix-blend-luminosity">
        <Image
          src={PHOTOS.guideHeroBackdrop}
          alt=""
          fill
          sizes="(max-width: 1280px) 100vw, 1280px"
          className="object-cover"
        />
      </div>

      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.12]"
        style={{
          background:
            'radial-gradient(ellipse at 20% 30%, rgba(22,163,74,.55), transparent 55%), radial-gradient(ellipse at 80% 70%, rgba(234,88,12,.40), transparent 55%)',
        }}
      />
      <div
        aria-hidden
        className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/5 blur-3xl"
      />

      <div className="relative grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
        <div className="flex flex-col gap-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#15803d]/30 px-3 py-1 text-xs font-semibold text-[#bbf7d0]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M5 13l4 4L19 7" stroke="#86efac" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Guía generada · {relativeTime}
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium">
              Lectura ~{guide.header.readTimeMin} min
            </span>
          </div>

          <h1 className="font-serif text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-[54px]">
            {guide.header.topic}
          </h1>

          {guide.header.subtitle && (
            <p className="max-w-xl text-[15px] leading-relaxed text-white/85">
              {guide.header.subtitle}
            </p>
          )}

          {guide.header.chips.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {guide.header.chips.map((chip, i) => (
                <span
                  key={`${chip.label}-${i}`}
                  className={`inline-flex items-center gap-2 rounded-[10px] border px-3 py-1.5 text-xs backdrop-blur ${TONE_STYLES[chip.tone]}`}
                >
                  {chip.label}
                </span>
              ))}
            </div>
          )}

          <GuideHeroActions markdown={markdown} />
        </div>

        <div className="relative">
          <div className="absolute inset-0 -z-10 rounded-[24px] bg-white/5 backdrop-blur-sm" />
          <HeroSceneIllustration />
        </div>
      </div>
    </article>
  );
}

function getRelativeTime(iso: string): string {
  try {
    const then = new Date(iso).getTime();
    if (Number.isNaN(then)) return 'recién';
    const diffMin = Math.round((Date.now() - then) / 60000);
    if (diffMin < 1) return 'hace un momento';
    if (diffMin < 60) return `hace ${diffMin} min`;
    const diffH = Math.round(diffMin / 60);
    if (diffH < 24) return `hace ${diffH} h`;
    const diffD = Math.round(diffH / 24);
    return `hace ${diffD} d`;
  } catch {
    return 'recién';
  }
}

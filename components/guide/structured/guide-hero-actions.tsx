'use client';

import { useState } from 'react';
import { track } from '@vercel/analytics';
import {
  IconDownload,
  IconCopy,
  IconSparkle,
  IconBookmark,
} from '@/components/illustrations/guide-icons';

type Props = {
  markdown: string;
  onRefinar?: () => void;
  onFavorita?: () => void;
};

export function GuideHeroActions({ markdown, onRefinar, onFavorita }: Props) {
  const [copied, setCopied] = useState(false);
  const [fav, setFav] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* noop */
    }
  }

  function handlePrint() {
    if (typeof window === 'undefined') return;
    track('pdf_downloaded', { source: 'guide_hero' });
    window.print();
  }

  function handleRefinar() {
    if (onRefinar) return onRefinar();
    const section = document.querySelector('[data-section="refinar"]');
    section?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function handleFav() {
    setFav((v) => !v);
    onFavorita?.();
  }

  return (
    <div className="mt-2 flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={handlePrint}
        className="inline-flex items-center gap-2 rounded-[12px] bg-[#27AE60] px-5 py-3 text-sm font-bold shadow-[0_6px_18px_rgba(22,163,74,.45)] transition hover:bg-[#16a34a]"
      >
        <IconDownload width={16} height={16} stroke="white" />
        Descargar PDF
      </button>
      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex items-center gap-2 rounded-[12px] bg-white/10 px-5 py-3 text-sm font-semibold backdrop-blur transition hover:bg-white/20"
      >
        <IconCopy width={16} height={16} stroke="white" />
        {copied ? 'Copiado ✓' : 'Copiar'}
      </button>
      <button
        type="button"
        onClick={handleRefinar}
        className="inline-flex items-center gap-2 rounded-[12px] bg-[#E67E22] px-5 py-3 text-sm font-bold shadow-[0_6px_18px_rgba(194,65,12,.45)] transition hover:bg-[#9a3412]"
      >
        <IconSparkle width={16} height={16} stroke="white" />
        Refinar con IA
      </button>
      <button
        type="button"
        onClick={handleFav}
        aria-pressed={fav}
        className={`inline-flex items-center gap-2 rounded-[12px] px-4 py-3 text-sm transition ${fav ? 'bg-white/20 text-white' : 'text-white/80 hover:bg-white/10 hover:text-white'}`}
      >
        <IconBookmark width={16} height={16} stroke={fav ? '#fde68a' : 'white'} />
        {fav ? 'Guardada' : 'Favorita'}
      </button>
    </div>
  );
}

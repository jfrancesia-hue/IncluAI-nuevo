'use client';

import { useEffect, useMemo, useState } from 'react';
import type { GuideSection } from '@/lib/guide-schema';
import { IconSparkle } from '@/components/illustrations/guide-icons';

const LABELS: Record<GuideSection['kind'], string> = {
  timeline: 'Contenidos prioritarios',
  strategies: 'Estrategias de enseñanza',
  resources: 'Materiales y recursos',
  evaluation: 'Evaluación diferenciada',
  communication: 'Comunicación en el aula',
  avoid: 'Qué evitar',
  coordination: 'Coordinación con otros',
};

type Item = {
  id: string;
  label: string;
};

export function GuideSidebar({ sections }: { sections: GuideSection[] }) {
  const items = useMemo<Item[]>(
    () =>
      sections.map((s, i) => ({
        id: `s-${i + 1}`,
        label: s.title || LABELS[s.kind],
      })),
    [sections]
  );

  const [activeId, setActiveId] = useState<string | null>(items[0]?.id ?? null);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (a.target as HTMLElement).offsetTop - (b.target as HTMLElement).offsetTop);
        const first = visible[0];
        if (first) setActiveId(first.target.id);
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0.1 }
    );
    items.forEach((it) => {
      const el = document.getElementById(it.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [items]);

  const activeIdx = Math.max(
    items.findIndex((it) => it.id === activeId),
    0
  );
  const progress = items.length > 0 ? Math.round(((activeIdx + 1) / items.length) * 100) : 0;

  return (
    <aside aria-label="Índice de la guía" className="order-2 lg:order-1">
      <div className="sticky top-24">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-[#5c6b7f]">
          Contenido de la guía
        </p>
        <div className="mb-5 flex items-center gap-2">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#e2e8f0]">
            <div
              className="h-full rounded-full bg-[#15803d] transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs font-semibold text-[#15803d]">{progress}%</span>
        </div>
        <nav aria-label="Tabla de contenido de la guía" className="flex flex-col gap-1">
          {items.map((it, i) => {
            const isActive = it.id === activeId;
            const isDone = i < activeIdx;
            return (
              <a
                key={it.id}
                href={`#${it.id}`}
                className={`flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-sm transition ${
                  isActive
                    ? 'bg-[#dcfce7] font-semibold text-[#15803d]'
                    : isDone
                      ? 'text-[#1e3a5f] hover:bg-white'
                      : 'text-[#5c6b7f] hover:bg-white hover:text-[#1e3a5f]'
                }`}
              >
                <span
                  className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                    isActive
                      ? 'bg-[#15803d] ring-4 ring-[#dcfce7]'
                      : isDone
                        ? 'bg-[#15803d]'
                        : 'bg-[#cbd5e1]'
                  }`}
                />
                <span className="truncate">{it.label}</span>
              </a>
            );
          })}
        </nav>

        <div className="mt-8 rounded-[14px] border border-[#e2e8f0] bg-white p-4 shadow-[0_2px_12px_rgba(15,34,64,0.06)]">
          <p className="font-serif text-sm font-bold text-[#1e3a5f]">
            ¿Necesitás ajustar la guía?
          </p>
          <p className="mt-1 text-xs text-[#5c6b7f]">
            Refinala con IA: más breve, más actividades, enfoque lúdico.
          </p>
          <a
            href="#refinar"
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-[10px] bg-[#c2410c] px-3 py-2 text-xs font-bold text-white hover:bg-[#9a3412]"
          >
            <IconSparkle width={14} height={14} stroke="white" />
            Refinar con IA
          </a>
        </div>
      </div>
    </aside>
  );
}

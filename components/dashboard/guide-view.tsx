'use client';

import { useMemo } from 'react';
import { cn } from '@/lib/utils';

type Props = {
  markdown: string;
  className?: string;
};

type Section = { heading: string; body: string };

// Parser minimalista de markdown:
// - `## título` abre una sección nueva
// - `**negrita**` → <strong>
// - Líneas que empiezan con `- ` → lista
// - El resto se renderiza como párrafo
export function GuideView({ markdown, className }: Props) {
  const sections = useMemo(() => parseSections(markdown), [markdown]);

  if (sections.length === 0 && markdown.trim()) {
    return (
      <article className={cn('prose-inclua', className)}>
        {renderBody(markdown)}
      </article>
    );
  }

  return (
    <article className={cn('prose-inclua flex flex-col gap-8', className)}>
      {sections.map((s, i) => (
        <section key={i} className="rounded-[14px] border border-border bg-card p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
          <h2 className="mb-4 border-b-2 border-primary/20 pb-2 font-serif text-xl font-bold text-primary">
            {s.heading}
          </h2>
          <div className="flex flex-col gap-3 text-sm leading-relaxed text-foreground">
            {renderBody(s.body)}
          </div>
        </section>
      ))}
    </article>
  );
}

function parseSections(md: string): Section[] {
  const lines = md.split('\n');
  const sections: Section[] = [];
  let current: Section | null = null;

  for (const line of lines) {
    const match = /^##\s+(.*)/.exec(line);
    if (match) {
      if (current) sections.push(current);
      current = { heading: match[1].trim(), body: '' };
    } else if (current) {
      current.body += line + '\n';
    }
  }
  if (current) sections.push(current);
  return sections;
}

function renderBody(text: string) {
  const blocks = text.split(/\n{2,}/).filter((b) => b.trim().length > 0);
  return blocks.map((block, idx) => {
    const lines = block.split('\n');
    const isList = lines.every((l) => l.trim().startsWith('- ') || l.trim() === '');
    if (isList) {
      return (
        <ul key={idx} className="flex flex-col gap-1.5 pl-5 marker:text-accent list-disc">
          {lines
            .filter((l) => l.trim().startsWith('- '))
            .map((l, j) => (
              <li key={j}>{renderInline(l.trim().slice(2))}</li>
            ))}
        </ul>
      );
    }
    return (
      <p key={idx} className="whitespace-pre-wrap">
        {renderInline(block)}
      </p>
    );
  });
}

function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith('**') && p.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-primary">
          {p.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{p}</span>;
  });
}

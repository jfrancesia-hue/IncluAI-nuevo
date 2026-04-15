import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { TipoUsuario } from '@/lib/types';

type ModuleCardProps = {
  href: string;
  icon: string;
  illustration: string;
  title: string;
  desc: string;
  highlight?: boolean;
};

export function ModuleSelector({ tipoUsuario }: { tipoUsuario: TipoUsuario }) {
  const cards: ({ key: TipoUsuario } & ModuleCardProps)[] = [
    {
      key: 'docente',
      href: '/nueva-consulta',
      icon: '📚',
      illustration: '👨‍🏫',
      title: 'Módulo Docente',
      desc: 'Accedé a recursos y guías para el aula.',
      highlight: tipoUsuario === 'docente',
    },
    {
      key: 'familia',
      href: '/familias/nueva-consulta',
      icon: '🏠',
      illustration: '👨‍👩‍👧',
      title: 'Módulo Familia',
      desc: 'Herramientas y consejos para el hogar.',
      highlight: tipoUsuario === 'familia',
    },
    {
      key: 'profesional',
      href: '/profesionales/nueva-consulta',
      icon: '⚕️',
      illustration: '🩺',
      title: 'Módulo Profesional',
      desc: 'Recursos especializados y consulta.',
      highlight: tipoUsuario === 'profesional',
    },
  ];

  return (
    <section aria-labelledby="selector-title" className="flex flex-col gap-3">
      <h2 id="selector-title" className="font-serif text-lg font-bold text-primary">
        Módulo selector
      </h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.key}
            href={c.href}
            className={cn(
              'group flex flex-col items-start gap-2 rounded-[16px] border-2 p-5 transition-all',
              c.highlight
                ? 'border-accent bg-accent-light shadow-[0_4px_16px_rgba(22,163,74,0.15)]'
                : 'border-border bg-card hover:border-accent hover:shadow-[0_2px_12px_rgba(0,0,0,0.06)]'
            )}
          >
            <div className="flex items-center gap-2">
              <span className="text-3xl" aria-hidden>
                {c.illustration}
              </span>
              <span className="text-xl" aria-hidden>
                {c.icon}
              </span>
            </div>
            <p className="font-serif text-lg font-bold text-primary">{c.title}</p>
            <p className="text-xs text-muted leading-relaxed">{c.desc}</p>
            <span
              className={cn(
                'mt-auto pt-2 text-sm font-semibold',
                c.highlight ? 'text-accent' : 'text-primary group-hover:text-accent'
              )}
            >
              Ir al módulo →
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { TipoUsuario } from '@/lib/types';

type ModuleCardProps = {
  href: string;
  icon: string;
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
      title: 'Soy Docente',
      desc: 'Guías para planificar clases inclusivas.',
      highlight: tipoUsuario === 'docente',
    },
    {
      key: 'familia',
      href: '/familias/nueva-consulta',
      icon: '🏠',
      title: 'Soy Familia',
      desc: 'Guías para acompañar a tu hijo/a en casa.',
      highlight: tipoUsuario === 'familia',
    },
    {
      key: 'profesional',
      href: '/profesionales/nueva-consulta',
      icon: '⚕️',
      title: 'Soy Profesional',
      desc: 'Guías clínicas para atender pacientes con discapacidad.',
      highlight: tipoUsuario === 'profesional',
    },
  ];

  return (
    <section aria-labelledby="selector-title" className="flex flex-col gap-3">
      <h2 id="selector-title" className="font-serif text-lg text-primary">
        ¿Qué tipo de guía necesitás hoy?
      </h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.key}
            href={c.href}
            className={cn(
              'group flex flex-col gap-1 rounded-[14px] border bg-card p-5 transition-colors',
              c.highlight
                ? 'border-accent bg-accent-light'
                : 'border-border hover:border-accent'
            )}
          >
            <span className="text-3xl" aria-hidden>
              {c.icon}
            </span>
            <p className="mt-1 font-serif text-lg font-bold text-primary">{c.title}</p>
            <p className="text-xs text-muted">{c.desc}</p>
            <span
              className={cn(
                'mt-2 text-sm font-medium',
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

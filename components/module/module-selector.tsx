import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import type { TipoUsuario } from '@/lib/types';
import { PHOTOS } from '@/lib/photos';

type ModuleCardProps = {
  href: string;
  icon: string;
  photo: string;
  photoAlt: string;
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
      photo: PHOTOS.moduloDocente,
      photoAlt: 'Docente con niños en el aula',
      title: 'Módulo Docente',
      desc: 'Accedé a recursos y guías para el aula.',
      highlight: tipoUsuario === 'docente',
    },
    {
      key: 'familia',
      href: '/familias/nueva-consulta',
      icon: '🏠',
      photo: PHOTOS.moduloFamilia,
      photoAlt: 'Familia leyendo juntos',
      title: 'Módulo Familia',
      desc: 'Herramientas y consejos para el hogar.',
      highlight: tipoUsuario === 'familia',
    },
    {
      key: 'profesional',
      href: '/profesionales/nueva-consulta',
      icon: '⚕️',
      photo: PHOTOS.moduloProfesional,
      photoAlt: 'Profesional ayudando a estudiante',
      title: 'Módulo Profesional',
      desc: 'Recursos especializados y consulta.',
      highlight: tipoUsuario === 'profesional',
    },
  ];

  return (
    <section aria-labelledby="selector-title" className="flex flex-col gap-4">
      <h2
        id="selector-title"
        className="text-2xl font-bold text-[#1F2E3D]"
        style={{
          fontFamily: 'var(--font-display)',
          letterSpacing: '-0.02em',
        }}
      >
        Cambiá de módulo
      </h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.key}
            href={c.href}
            className={cn(
              'bento-card group flex flex-col items-start gap-3 rounded-[18px] border-2 p-5 transition-all',
              c.highlight
                ? 'border-[#27AE60] bg-white shadow-[0_8px_24px_rgba(22,163,74,0.18)]'
                : 'border-[rgba(31,46,61,0.12)] bg-white hover:border-[#27AE60]'
            )}
          >
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full shadow-sm">
                <Image
                  src={c.photo}
                  alt={c.photoAlt}
                  width={96}
                  height={96}
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="text-xl" aria-hidden>
                {c.icon}
              </span>
            </div>
            <p
              className="text-lg font-bold text-[#1F2E3D]"
              style={{
                fontFamily: 'var(--font-display)',
                letterSpacing: '-0.02em',
              }}
            >
              {c.title}
            </p>
            <p
              className="text-sm font-medium text-[#3d4a5a]"
              style={{ lineHeight: 1.55 }}
            >
              {c.desc}
            </p>
            <span
              className={cn(
                'mt-auto inline-flex items-center gap-1 pt-2 text-sm font-bold transition-colors',
                c.highlight
                  ? 'text-[#0d7c3a]'
                  : 'text-[#1F2E3D] group-hover:text-[#0d7c3a]'
              )}
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Ir al módulo <span aria-hidden>→</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

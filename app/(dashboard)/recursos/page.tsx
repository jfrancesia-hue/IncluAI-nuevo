import Link from 'next/link';
import Image from 'next/image';
import { RECURSOS_AR, filtrarRecursos, type Recurso, type PublicoRecurso } from '@/data/recursos-ar';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { PHOTOS } from '@/lib/photos';

export const metadata = { title: 'Biblioteca · IncluIA' };

type SP = Promise<{ publico?: string; tipo?: string }>;

const TIPOS: { id: Recurso['tipo']; label: string; icon: string }[] = [
  { id: 'portal', label: 'Portales', icon: '🌐' },
  { id: 'ley', label: 'Normativa', icon: '⚖️' },
  { id: 'tramite', label: 'Trámites', icon: '📋' },
  { id: 'herramienta', label: 'Herramientas', icon: '🧰' },
];

const PUBLICOS: { id: PublicoRecurso; label: string; icon: string }[] = [
  { id: 'docente', label: 'Docentes', icon: '📚' },
  { id: 'familia', label: 'Familias', icon: '🏠' },
  { id: 'profesional', label: 'Profesionales', icon: '⚕️' },
];

export default async function RecursosPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;

  const publico = PUBLICOS.some((p) => p.id === sp.publico)
    ? (sp.publico as PublicoRecurso)
    : undefined;
  const tipo = TIPOS.some((t) => t.id === sp.tipo) ? (sp.tipo as Recurso['tipo']) : undefined;

  const lista = filtrarRecursos({ publico, tipo });

  return (
    <div className="flex flex-col gap-6">
      <header className="relative overflow-hidden rounded-[20px] bg-white shadow-[0_2px_12px_rgba(15,34,64,0.05)]">
        <div className="relative h-32 w-full overflow-hidden sm:h-40">
          <Image
            src={PHOTOS.recursosHeader}
            alt="Docente y niños aprendiendo juntos"
            width={1200}
            height={400}
            className="h-full w-full object-cover"
          />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-white/80 via-white/30 to-transparent" />
        </div>
        <div className="px-6 pb-5 pt-3 text-center">
          <h1 className="font-serif text-3xl font-bold text-primary sm:text-4xl">
            Biblioteca de recursos
          </h1>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-muted">
            Recursos oficiales y comunitarios de Argentina — portales, normativa,
            trámites y herramientas curadas por tipo de discapacidad y público.
          </p>
        </div>
      </header>

      <section className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-wide text-muted">Público</p>
        <div className="flex flex-wrap gap-2">
          <Chip href="/recursos" active={!publico}>Todos</Chip>
          {PUBLICOS.map((p) => (
            <Chip
              key={p.id}
              href={`/recursos?publico=${p.id}${tipo ? `&tipo=${tipo}` : ''}`}
              active={publico === p.id}
            >
              {p.icon} {p.label}
            </Chip>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-wide text-muted">Tipo</p>
        <div className="flex flex-wrap gap-2">
          <Chip href={publico ? `/recursos?publico=${publico}` : '/recursos'} active={!tipo}>
            Todos
          </Chip>
          {TIPOS.map((t) => (
            <Chip
              key={t.id}
              href={`/recursos?tipo=${t.id}${publico ? `&publico=${publico}` : ''}`}
              active={tipo === t.id}
            >
              {t.icon} {t.label}
            </Chip>
          ))}
        </div>
      </section>

      <p className="text-xs text-muted">
        {lista.length} de {RECURSOS_AR.length} recursos
      </p>

      <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {lista.map((r) => (
          <li key={r.url}>
            <a href={r.url} target="_blank" rel="noopener noreferrer">
              <Card className="h-full transition-colors hover:border-accent">
                <CardContent className="flex h-full flex-col gap-2 p-5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-serif text-base font-bold text-primary">{r.titulo}</p>
                    <span className="text-xs text-muted">↗</span>
                  </div>
                  <p className="text-sm text-foreground">{r.descripcion}</p>
                  <p className="mt-auto text-xs text-muted">{r.fuente}</p>
                </CardContent>
              </Card>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Chip({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors',
        active
          ? 'border-accent bg-accent-light text-accent'
          : 'border-border bg-card text-primary hover:bg-primary-bg'
      )}
    >
      {children}
    </Link>
  );
}

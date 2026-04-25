import Link from 'next/link';
import {
  RECURSOS_AR,
  filtrarRecursos,
  type Recurso,
  type PublicoRecurso,
} from '@/data/recursos-ar';
import { cn } from '@/lib/utils';
import { PageShell } from '@/components/ui/PageShell';
import { RevealOnScroll } from '@/components/landing/RevealOnScroll';

export const metadata = { title: 'Biblioteca · IncluAI' };

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

export default async function RecursosPage({
  searchParams,
}: {
  searchParams: SP;
}) {
  const sp = await searchParams;

  const publico = PUBLICOS.some((p) => p.id === sp.publico)
    ? (sp.publico as PublicoRecurso)
    : undefined;
  const tipo = TIPOS.some((t) => t.id === sp.tipo)
    ? (sp.tipo as Recurso['tipo'])
    : undefined;

  const lista = filtrarRecursos({ publico, tipo });

  return (
    <PageShell
      eyebrow="📖 Biblioteca"
      title={
        <>
          Biblioteca de{' '}
          <span className="gradient-text">recursos oficiales</span>
        </>
      }
      subtitle="Recursos oficiales y comunitarios de Argentina — portales, normativa, trámites y herramientas curadas por tipo de discapacidad y público."
      decoration="soft"
      tone="docentes"
      revealChildren={false}
    >
      <div className="flex flex-col gap-6">
        <RevealOnScroll>
          <section className="flex flex-col gap-2">
            <p
              className="text-xs uppercase text-[#4A5968]"
              style={{
                fontFamily: 'var(--font-display)',
                letterSpacing: '0.08em',
              }}
            >
              Público
            </p>
            <div className="flex flex-wrap gap-2">
              <Chip href="/recursos" active={!publico}>
                Todos
              </Chip>
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
        </RevealOnScroll>

        <RevealOnScroll delay={80}>
          <section className="flex flex-col gap-2">
            <p
              className="text-xs uppercase text-[#4A5968]"
              style={{
                fontFamily: 'var(--font-display)',
                letterSpacing: '0.08em',
              }}
            >
              Tipo
            </p>
            <div className="flex flex-wrap gap-2">
              <Chip
                href={publico ? `/recursos?publico=${publico}` : '/recursos'}
                active={!tipo}
              >
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
        </RevealOnScroll>

        <p className="text-xs text-[#4A5968]">
          {lista.length} de {RECURSOS_AR.length} recursos
        </p>

        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {lista.map((r, i) => (
            <RevealOnScroll
              key={r.url}
              as="li"
              delay={Math.min(i * 40, 320)}
            >
              <a href={r.url} target="_blank" rel="noopener noreferrer">
                <article className="bento-card spotlight-card flex h-full flex-col gap-2 rounded-[16px] border border-[#e2e8f0] bg-white p-5 shadow-[0_2px_12px_rgba(15,34,64,0.04)]">
                  <div className="flex items-center justify-between gap-2">
                    <p
                      className="text-base font-bold text-[#1F2E3D]"
                      style={{
                        fontFamily: 'var(--font-display)',
                        letterSpacing: '-0.02em',
                      }}
                    >
                      {r.titulo}
                    </p>
                    <span className="text-xs text-[#4A5968]">↗</span>
                  </div>
                  <p
                    className="text-sm text-[#1F2E3D]"
                    style={{ lineHeight: 1.6 }}
                  >
                    {r.descripcion}
                  </p>
                  <p className="mt-auto text-xs text-[#4A5968]">{r.fuente}</p>
                </article>
              </a>
            </RevealOnScroll>
          ))}
        </ul>
      </div>
    </PageShell>
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
        'inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold transition',
        active
          ? 'border-[#27AE60] bg-[#D6F0E0] text-[#27AE60] shadow-[0_4px_14px_rgba(39,174,96,0.18)]'
          : 'border-[#e2e8f0] bg-white text-[#2E86C1] hover:border-[#27AE60] hover:bg-[#FBF8F2]'
      )}
      style={{ fontFamily: 'var(--font-display)' }}
    >
      {children}
    </Link>
  );
}

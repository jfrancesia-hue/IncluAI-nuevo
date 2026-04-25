import Link from 'next/link';
import { getPerfil } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { DISCAPACIDADES } from '@/data/discapacidades';
import { cn } from '@/lib/utils';
import type { ModuloIncluIA } from '@/lib/types';
import { PageShell } from '@/components/ui/PageShell';
import { RevealOnScroll } from '@/components/landing/RevealOnScroll';

export const metadata = { title: 'Tu biblioteca · IncluAI' };

type Row = {
  id: string;
  modulo: ModuloIncluIA;
  nivel: string | null;
  materia: string | null;
  contenido: string;
  discapacidades: string[];
  created_at: string;
  feedback_estrellas: number | null;
};

type SP = Promise<{ modulo?: string; discapacidad?: string; q?: string }>;

const MODULO_META: Record<
  ModuloIncluIA | 'todos',
  { icon: string; label: string }
> = {
  todos: { icon: '📋', label: 'Todas' },
  docentes: { icon: '📚', label: 'Docente' },
  familias: { icon: '🏠', label: 'Familia' },
  profesionales: { icon: '⚕️', label: 'Profesional' },
};

export default async function HistorialPage({
  searchParams,
}: {
  searchParams: SP;
}) {
  const [perfil, sp] = await Promise.all([getPerfil(), searchParams]);
  if (!perfil) return null;

  const filtroModulo = (
    ['docentes', 'familias', 'profesionales'] as const
  ).includes(sp.modulo as ModuloIncluIA)
    ? (sp.modulo as ModuloIncluIA)
    : null;

  const supabase = await createClient();
  let query = supabase
    .from('consultas')
    .select(
      'id, modulo, nivel, materia, contenido, discapacidades, created_at, feedback_estrellas'
    )
    .eq('user_id', perfil.id)
    .order('created_at', { ascending: false })
    .limit(50);

  if (filtroModulo) query = query.eq('modulo', filtroModulo);

  if (sp.discapacidad && DISCAPACIDADES.some((d) => d.id === sp.discapacidad)) {
    query = query.contains('discapacidades', [sp.discapacidad]);
  }

  if (sp.q && sp.q.trim()) {
    const termRaw = sp.q.trim().slice(0, 100);
    const term = termRaw.replace(/[%,()*"\\]/g, '');
    if (term.length >= 2) {
      query = query.or(`contenido.ilike.%${term}%,materia.ilike.%${term}%`);
    }
  }

  const { data: consultas } = await query.returns<Row[]>();
  const totalResultados = consultas?.length ?? 0;

  return (
    <PageShell
      eyebrow="📚 Tu biblioteca"
      title={
        <>
          Tu biblioteca de{' '}
          <span className="gradient-text">guías inclusivas</span>
        </>
      }
      subtitle="Todas las guías que generaste en los 3 módulos. Filtralas, buscalas, marcalas como favoritas."
      decoration="soft"
      tone="docentes"
      revealChildren={false}
    >
      <div className="flex flex-col gap-6">
        <RevealOnScroll>
          <form
            method="get"
            className="flex flex-col gap-3 rounded-[16px] border border-[#e2e8f0] bg-white p-4 shadow-[0_2px_8px_rgba(15,34,64,0.04)] sm:flex-row sm:items-center"
          >
            <div className="relative flex-1">
              <span
                aria-hidden
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#4A5968]"
              >
                🔎
              </span>
              <input
                name="q"
                defaultValue={sp.q ?? ''}
                placeholder="Buscar por contenido..."
                className="field-input"
                style={{ paddingLeft: 40 }}
              />
            </div>
            {filtroModulo && (
              <input type="hidden" name="modulo" value={filtroModulo} />
            )}
            {sp.discapacidad && (
              <input type="hidden" name="discapacidad" value={sp.discapacidad} />
            )}
            <button
              type="submit"
              className="magnetic-btn rounded-[10px] bg-[#2E86C1] px-5 py-2.5 text-sm font-bold text-white"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Buscar
            </button>
          </form>
        </RevealOnScroll>

        <RevealOnScroll delay={80}>
          <div className="flex flex-wrap gap-2">
            <Tab
              href="/historial"
              active={!filtroModulo}
              label="Todas"
              icon="📋"
            />
            <Tab
              href="/historial?modulo=docentes"
              active={filtroModulo === 'docentes'}
              label="Docente"
              icon="📚"
            />
            <Tab
              href="/historial?modulo=familias"
              active={filtroModulo === 'familias'}
              label="Familia"
              icon="🏠"
            />
            <Tab
              href="/historial?modulo=profesionales"
              active={filtroModulo === 'profesionales'}
              label="Profesional"
              icon="⚕️"
            />
          </div>
        </RevealOnScroll>

        {totalResultados > 0 && (
          <p className="text-xs text-[#4A5968]">
            {totalResultados}{' '}
            {totalResultados === 1 ? 'guía encontrada' : 'guías encontradas'}
          </p>
        )}

        {!consultas || consultas.length === 0 ? (
          <RevealOnScroll>
            <div className="flex min-h-[260px] flex-col items-center justify-center gap-3 rounded-[20px] border-2 border-dashed border-[#e2e8f0] bg-white p-10 text-center">
              <span aria-hidden className="text-5xl">📖</span>
              <p
                className="text-lg font-bold text-[#2E86C1]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {filtroModulo || sp.discapacidad || sp.q
                  ? 'No hay guías con esos filtros'
                  : 'Todavía no guardaste ninguna guía'}
              </p>
              <p className="max-w-xs text-sm text-[#4A5968]">
                Las guías que generes aparecerán acá para consultarlas cuando
                quieras.
              </p>
              {!filtroModulo && !sp.discapacidad && !sp.q && (
                <Link
                  href="/nueva-consulta"
                  className="magnetic-btn mt-2 inline-flex items-center rounded-[12px] bg-[#27AE60] px-5 py-2.5 text-sm font-bold text-white"
                >
                  Generar mi primera guía →
                </Link>
              )}
            </div>
          </RevealOnScroll>
        ) : (
          <ul className="flex flex-col gap-3">
            {consultas.map((c, i) => (
              <RevealOnScroll key={c.id} as="li" delay={Math.min(i * 50, 400)}>
                <ConsultaItem row={c} />
              </RevealOnScroll>
            ))}
          </ul>
        )}
      </div>
    </PageShell>
  );
}

function Tab({
  href,
  active,
  label,
  icon,
}: {
  href: string;
  active: boolean;
  label: string;
  icon: string;
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
      <span aria-hidden>{icon}</span>
      <span>{label}</span>
    </Link>
  );
}

function ConsultaItem({ row }: { row: Row }) {
  const tags = row.discapacidades
    .map((id) => DISCAPACIDADES.find((d) => d.id === id))
    .filter((x): x is (typeof DISCAPACIDADES)[number] => Boolean(x));

  const fecha = new Date(row.created_at).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const moduloLabel = MODULO_META[row.modulo]?.label ?? row.modulo;
  const moduloIcon = MODULO_META[row.modulo]?.icon ?? '📋';
  const titulo = row.materia ?? row.contenido.slice(0, 60);

  return (
    <Link href={`/resultado?id=${row.id}`}>
      <article className="bento-card flex flex-col gap-2 rounded-[16px] border border-[#e2e8f0] bg-white p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <span aria-hidden className="text-2xl">
              {moduloIcon}
            </span>
            <p
              className="text-lg font-bold text-[#1F2E3D]"
              style={{
                fontFamily: 'var(--font-display)',
                letterSpacing: '-0.02em',
              }}
            >
              {titulo}
            </p>
          </div>
          <span className="shrink-0 text-xs text-[#4A5968]">{fecha}</span>
        </div>
        <p
          className="line-clamp-2 text-sm text-[#1F2E3D]"
          style={{ lineHeight: 1.6 }}
        >
          {row.contenido}
        </p>
        <div className="mt-1 flex flex-wrap gap-1.5">
          <span
            className="rounded-full bg-[#D7EAF6] px-2.5 py-0.5 text-[11px] font-semibold text-[#2E86C1]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {moduloLabel}
          </span>
          {tags.map((t) => (
            <span
              key={t.id}
              className="rounded-full bg-[#D6F0E0] px-2.5 py-0.5 text-[11px] font-semibold text-[#27AE60]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {t.icon} {t.label}
            </span>
          ))}
        </div>
        {row.feedback_estrellas && (
          <p className="text-sm tracking-wider text-[#E67E22]">
            {'★'.repeat(row.feedback_estrellas)}
            <span className="text-[#e2e8f0]">
              {'★'.repeat(5 - row.feedback_estrellas)}
            </span>
          </p>
        )}
      </article>
    </Link>
  );
}

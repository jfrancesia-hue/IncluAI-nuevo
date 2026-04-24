import Link from 'next/link';
import Image from 'next/image';
import { getPerfil } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { DISCAPACIDADES } from '@/data/discapacidades';
import { cn } from '@/lib/utils';
import type { ModuloIncluIA } from '@/lib/types';
import { PHOTOS } from '@/lib/photos';

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

const MODULO_META: Record<ModuloIncluIA | 'todos', { icon: string; label: string }> = {
  todos: { icon: '📋', label: 'Todas' },
  docentes: { icon: '📚', label: 'Docente' },
  familias: { icon: '🏠', label: 'Familia' },
  profesionales: { icon: '⚕️', label: 'Profesional' },
};

export default async function HistorialPage({ searchParams }: { searchParams: SP }) {
  const [perfil, sp] = await Promise.all([getPerfil(), searchParams]);
  if (!perfil) return null;

  const esPago = perfil.plan !== 'free';
  const filtroModulo = (['docentes', 'familias', 'profesionales'] as const).includes(
    sp.modulo as ModuloIncluIA
  )
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

  // Whitelist: la discapacidad solo puede ser uno de los IDs conocidos
  if (sp.discapacidad && DISCAPACIDADES.some((d) => d.id === sp.discapacidad)) {
    query = query.contains('discapacidades', [sp.discapacidad]);
  }

  // Búsqueda: limitar largo y escapar caracteres que rompen PostgREST.or()
  if (sp.q && sp.q.trim()) {
    const termRaw = sp.q.trim().slice(0, 100);
    const term = termRaw.replace(/[%,()*"\\]/g, '');
    if (term.length >= 2) {
      query = query.or(
        `contenido.ilike.%${term}%,materia.ilike.%${term}%`
      );
    }
  }

  const { data: consultas } = await query.returns<Row[]>();
  const totalResultados = consultas?.length ?? 0;

  return (
    <div className="flex flex-col gap-6">
      <header className="relative overflow-hidden rounded-[20px] bg-white shadow-[0_2px_12px_rgba(15,34,64,0.05)]">
        <div className="relative h-32 w-full overflow-hidden sm:h-40">
          <Image
            src={PHOTOS.historialHeader}
            alt="Estudiantes leyendo en biblioteca"
            width={1200}
            height={400}
            className="h-full w-full object-cover"
          />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-white/80 via-white/30 to-transparent" />
        </div>
        <div className="px-6 pb-5 pt-3">
          <h1 className="font-serif text-3xl font-bold text-[#2E86C1] sm:text-4xl">
            Tu biblioteca de guías
          </h1>
          <p className="mt-1 text-sm text-[#4A5968]">
            Todas las guías que generaste en los 3 módulos.
          </p>
        </div>
      </header>

      {!esPago && (
        <div className="flex items-start gap-3 rounded-[16px] border border-[#fcd34d]/50 bg-[#fef3c7] p-4 text-sm text-[#1F2E3D]">
          <span aria-hidden className="text-xl">🔒</span>
          <div className="flex-1">
            <p className="font-semibold text-[#2E86C1]">
              El historial completo está en los planes pagos
            </p>
            <p className="mt-0.5 text-xs text-[#4A5968]">
              Accedé a todas tus guías guardadas, marcá favoritas y consultá
              cuando necesites.
            </p>
          </div>
          <Link
            href="/planes"
            className="shrink-0 rounded-[10px] bg-[#2E86C1] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#2a5a8f]"
          >
            Ver planes →
          </Link>
        </div>
      )}

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
            className="w-full rounded-[10px] border border-[#e2e8f0] bg-[#FBF8F2] py-2.5 pl-10 pr-3 text-sm text-[#1F2E3D] placeholder:text-[#4A5968] focus:border-[#27AE60] focus:outline-none focus:ring-2 focus:ring-[#D6F0E0]"
          />
        </div>
        {filtroModulo && <input type="hidden" name="modulo" value={filtroModulo} />}
        {sp.discapacidad && (
          <input type="hidden" name="discapacidad" value={sp.discapacidad} />
        )}
        <button
          type="submit"
          className="rounded-[10px] bg-[#2E86C1] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#2a5a8f]"
        >
          Buscar
        </button>
      </form>

      <div className="flex flex-wrap gap-2">
        <Tab href="/historial" active={!filtroModulo} label="Todas" icon="📋" />
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

      {totalResultados > 0 && (
        <p className="text-xs text-[#4A5968]">
          {totalResultados}{' '}
          {totalResultados === 1 ? 'guía encontrada' : 'guías encontradas'}
        </p>
      )}

      {!consultas || consultas.length === 0 ? (
        <div className="flex min-h-[220px] flex-col items-center justify-center gap-3 rounded-[20px] border-2 border-dashed border-[#e2e8f0] bg-white p-10 text-center">
          <span aria-hidden className="text-5xl">📖</span>
          <p className="font-serif text-lg font-bold text-[#2E86C1]">
            {filtroModulo || sp.discapacidad || sp.q
              ? 'No hay guías con esos filtros'
              : 'Todavía no guardaste ninguna guía'}
          </p>
          <p className="max-w-xs text-sm text-[#4A5968]">
            Las guías que generes aparecerán acá para consultarlas cuando quieras.
          </p>
          {!filtroModulo && !sp.discapacidad && !sp.q && (
            <Link
              href="/nueva-consulta"
              className="mt-2 inline-flex items-center rounded-[10px] bg-[#27AE60] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#27AE60]"
            >
              Generar mi primera guía →
            </Link>
          )}
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {consultas.map((c) => (
            <li key={c.id}>
              <ConsultaItem row={c} locked={!esPago} />
            </li>
          ))}
        </ul>
      )}
    </div>
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
          ? 'border-[#27AE60] bg-[#D6F0E0] text-[#27AE60]'
          : 'border-[#e2e8f0] bg-white text-[#2E86C1] hover:border-[#27AE60] hover:bg-[#FBF8F2]'
      )}
    >
      <span aria-hidden>{icon}</span>
      <span>{label}</span>
    </Link>
  );
}

function ConsultaItem({ row, locked }: { row: Row; locked: boolean }) {
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

  const inner = (
    <article className="flex flex-col gap-2 rounded-[16px] border border-[#e2e8f0] bg-white p-5 transition hover:-translate-y-0.5 hover:border-[#27AE60] hover:shadow-[0_6px_20px_rgba(22,163,74,0.12)]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span aria-hidden className="text-2xl">
            {moduloIcon}
          </span>
          <p className="font-serif text-lg font-bold text-[#2E86C1]">{titulo}</p>
        </div>
        <span className="shrink-0 text-xs text-[#4A5968]">{fecha}</span>
      </div>
      <p className="line-clamp-2 text-sm text-[#1F2E3D]">{row.contenido}</p>
      <div className="mt-1 flex flex-wrap gap-1.5">
        <span className="rounded-full bg-[#D7EAF6] px-2 py-0.5 text-[11px] font-semibold text-[#2E86C1]">
          {moduloLabel}
        </span>
        {tags.map((t) => (
          <span
            key={t.id}
            className="rounded-full bg-[#D6F0E0] px-2 py-0.5 text-[11px] font-semibold text-[#27AE60]"
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
  );

  if (locked) {
    return (
      <div className="relative">
        <div className="pointer-events-none opacity-60">{inner}</div>
        <div className="absolute inset-0 flex items-center justify-center rounded-[16px] bg-white/40 backdrop-blur-[2px]">
          <Link
            href="/planes"
            className="rounded-[10px] bg-[#E67E22] px-4 py-2 text-xs font-bold text-white shadow-[0_4px_12px_rgba(234,88,12,0.3)] transition hover:bg-[#E67E22]"
          >
            🔒 Upgrade para ver
          </Link>
        </div>
      </div>
    );
  }

  return <Link href={`/resultado?id=${row.id}`}>{inner}</Link>;
}

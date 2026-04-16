import Link from 'next/link';
import { getPerfil } from '@/lib/auth';
import { LIMITES_PLAN } from '@/lib/types';
import { createClient } from '@/lib/supabase/server';
import { DISCAPACIDADES } from '@/data/discapacidades';
import { ModuleSelector } from '@/components/module/module-selector';
import { Onboarding } from '@/components/module/onboarding';
import { getTipDelDia } from '@/data/tips';

export const metadata = { title: 'Inicio · IncluIA' };

type RecentRow = {
  id: string;
  modulo: 'docentes' | 'familias' | 'profesionales';
  materia: string | null;
  contenido: string;
  discapacidades: string[];
  created_at: string;
};

const MODULO_ICON: Record<RecentRow['modulo'], string> = {
  docentes: '📚',
  familias: '🏠',
  profesionales: '⚕️',
};

export default async function InicioPage() {
  const perfil = await getPerfil();
  if (!perfil) return null;

  const limite = LIMITES_PLAN[perfil.plan].guias_por_mes;
  const restantes = Math.max(0, limite - perfil.consultas_mes);
  const pct = limite > 0 ? Math.min(100, (perfil.consultas_mes / limite) * 100) : 0;

  const supabase = await createClient();
  const { data: recientes } = await supabase
    .from('consultas')
    .select('id, modulo, materia, contenido, discapacidades, created_at')
    .eq('user_id', perfil.id)
    .order('created_at', { ascending: false })
    .limit(3)
    .returns<RecentRow[]>();

  const totalGuias = perfil.consultas_mes;
  const tip = getTipDelDia();

  return (
    <div className="flex flex-col gap-8">
      <Onboarding />

      <header className="relative overflow-hidden rounded-[20px] bg-gradient-to-br from-[#e8f0fe] via-white to-[#fef3c7] p-6 sm:p-8">
        <div
          aria-hidden
          className="absolute inset-y-0 right-0 w-1/3 opacity-10"
          style={{
            backgroundImage:
              'radial-gradient(circle at 80% 50%, #15803d, transparent 60%)',
          }}
        />
        <h1 className="relative font-serif text-3xl font-bold text-[#1e3a5f] sm:text-4xl">
          ¡Hola, {perfil.nombre}! 👋
        </h1>
        <p className="relative mt-2 text-base text-[#5c6b7f]">
          ¿Qué clase inclusiva vas a planificar hoy?
        </p>
      </header>

      <article className="relative overflow-hidden rounded-[20px] bg-gradient-to-br from-[#15803d] to-[#0d9448] p-6 text-white shadow-[0_8px_24px_rgba(22,163,74,0.25)] sm:p-8">
        <div
          aria-hidden
          className="absolute -right-8 -top-8 flex h-56 w-56 items-center justify-center rounded-full bg-white/10 text-8xl"
        >
          ✨
        </div>
        <div className="relative flex flex-col gap-4 sm:max-w-xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-white/80">
            Empezá una nueva
          </p>
          <h2 className="font-serif text-2xl font-bold sm:text-3xl">
            Nueva guía inclusiva
          </h2>
          <p className="text-sm text-white/90 sm:text-base">
            Contanos tu clase y en minutos tenés estrategias, materiales y
            evaluaciones personalizadas para tu alumno/a.
          </p>
          <Link
            href="/nueva-consulta"
            className="mt-2 inline-flex w-fit items-center gap-2 rounded-[12px] bg-white px-6 py-3 text-sm font-bold text-[#15803d] shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition hover:bg-[#fbf7f0]"
          >
            Comenzar <span aria-hidden>→</span>
          </Link>
        </div>
      </article>

      <ModuleSelector tipoUsuario={perfil.tipo_usuario} />

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-[16px] border border-[#e2e8f0] bg-white p-5 shadow-[0_2px_8px_rgba(15,34,64,0.04)]">
          <div className="flex items-center gap-2">
            <span aria-hidden className="text-xl">📊</span>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#5c6b7f]">
              Guías este mes
            </p>
          </div>
          <p className="mt-2 font-serif text-2xl font-bold text-[#1e3a5f]">
            {perfil.consultas_mes} de {limite}{' '}
            <span className="text-sm font-normal text-[#5c6b7f]">usadas</span>
          </p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#e8f0fe]">
            <div
              className="h-full bg-gradient-to-r from-[#15803d] to-[#0d9448] transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        <div className="rounded-[16px] border border-[#e2e8f0] bg-white p-5 shadow-[0_2px_8px_rgba(15,34,64,0.04)]">
          <div className="flex items-center gap-2">
            <span aria-hidden className="text-xl">📚</span>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#5c6b7f]">
              Restantes
            </p>
          </div>
          <p className="mt-2 font-serif text-2xl font-bold text-[#1e3a5f]">
            {restantes}{' '}
            <span className="text-sm font-normal text-[#5c6b7f]">
              {restantes === 1 ? 'guía disponible' : 'guías disponibles'}
            </span>
          </p>
          <p className="mt-3 text-xs text-[#5c6b7f]">
            {totalGuias > 0 ? '📈 Ya estás planificando' : 'Empezá cuando quieras'}
          </p>
        </div>

        <div className="rounded-[16px] border border-[#e2e8f0] bg-white p-5 shadow-[0_2px_8px_rgba(15,34,64,0.04)]">
          <div className="flex items-center gap-2">
            <span aria-hidden className="text-xl">⭐</span>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#5c6b7f]">
              Tu plan
            </p>
          </div>
          <p className="mt-2 font-serif text-2xl font-bold text-[#1e3a5f]">
            {perfil.plan === 'free'
              ? 'Gratuito'
              : perfil.plan === 'pro'
                ? 'Pro ✓'
                : 'Institucional'}
          </p>
          {perfil.plan === 'free' && (
            <Link
              href="/planes"
              className="mt-3 inline-flex text-xs font-semibold text-[#c2410c] hover:underline"
            >
              Mejorar plan →
            </Link>
          )}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-serif text-xl font-bold text-[#1e3a5f]">
            Tus últimas guías
          </h3>
          {recientes && recientes.length > 0 && (
            <Link
              href="/historial"
              className="text-sm font-semibold text-[#15803d] hover:underline"
            >
              Ver todo →
            </Link>
          )}
        </div>

        {recientes && recientes.length > 0 ? (
          <div className="grid grid-cols-1 gap-3">
            {recientes.map((c) => (
              <RecentCard key={c.id} row={c} />
            ))}
          </div>
        ) : (
          <div className="flex min-h-[180px] flex-col items-center justify-center gap-3 rounded-[20px] border-2 border-dashed border-[#e2e8f0] bg-white p-8 text-center">
            <span aria-hidden className="text-4xl">📖</span>
            <p className="font-serif text-base font-bold text-[#1e3a5f]">
              Todavía no generaste ninguna guía
            </p>
            <p className="max-w-xs text-sm text-[#5c6b7f]">
              Tu primera clase inclusiva está a unos clics. Vamos juntos.
            </p>
            <Link
              href="/nueva-consulta"
              className="mt-2 inline-flex items-center rounded-[10px] bg-[#15803d] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#15803d]"
            >
              Empezá ahora →
            </Link>
          </div>
        )}
      </section>

      <aside className="flex items-start gap-4 rounded-[16px] border border-[#fcd34d]/40 bg-[#fef3c7] p-5 text-sm text-[#1a2332]">
        <span aria-hidden className="shrink-0 text-2xl">💡</span>
        <div>
          <p>
            <strong className="text-[#1e3a5f]">Tip del día.</strong> {tip.texto}
          </p>
          <p className="mt-1 text-xs text-[#5c6b7f]">— {tip.fuente}</p>
        </div>
      </aside>
    </div>
  );
}

function RecentCard({ row }: { row: RecentRow }) {
  const tags = row.discapacidades
    .map((id) => DISCAPACIDADES.find((d) => d.id === id))
    .filter((x): x is (typeof DISCAPACIDADES)[number] => Boolean(x));
  return (
    <Link href={`/resultado?id=${row.id}`}>
      <article className="flex items-center gap-4 rounded-[16px] border border-[#e2e8f0] bg-white p-4 transition hover:border-[#15803d] hover:shadow-[0_4px_16px_rgba(22,163,74,0.12)]">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#e8f0fe] text-2xl">
          {MODULO_ICON[row.modulo]}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-[#1e3a5f]">
            {row.materia ?? row.modulo}
          </p>
          <p className="truncate text-xs text-[#5c6b7f]">{row.contenido}</p>
          {tags.length > 0 && (
            <div className="mt-1.5 flex flex-wrap gap-1">
              {tags.slice(0, 3).map((t) => (
                <span
                  key={t.id}
                  className="rounded-full bg-[#dcfce7] px-2 py-0.5 text-[10px] font-semibold text-[#15803d]"
                >
                  {t.icon} {t.label}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="shrink-0 text-right">
          <p className="text-xs text-[#5c6b7f]">
            {new Date(row.created_at).toLocaleDateString('es-AR', {
              day: '2-digit',
              month: 'short',
            })}
          </p>
          <span aria-hidden className="mt-1 block text-[#5c6b7f]">→</span>
        </div>
      </article>
    </Link>
  );
}

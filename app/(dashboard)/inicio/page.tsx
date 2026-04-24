import Link from 'next/link';
import Image from 'next/image';
import type { ComponentType, SVGProps } from 'react';
import { getPerfil } from '@/lib/auth';
import { LIMITES_PLAN } from '@/lib/types';
import { createClient } from '@/lib/supabase/server';
import { DISCAPACIDADES } from '@/data/discapacidades';
import { ModuleSelector } from '@/components/module/module-selector';
import { Onboarding } from '@/components/module/onboarding';
import { getTipDelDia } from '@/data/tips';
import { PHOTOS } from '@/lib/photos';
import {
  IconBars,
  IconBook,
  IconStar,
  IconHouse,
  IconMedkit,
  IconLightbulb,
  IconWave,
} from '@/components/illustrations/dashboard-icons';
import { IconArrowRight } from '@/components/illustrations/guide-icons';

export const metadata = { title: 'Inicio · IncluAI' };

type RecentRow = {
  id: string;
  modulo: 'docentes' | 'familias' | 'profesionales';
  materia: string | null;
  contenido: string;
  discapacidades: string[];
  created_at: string;
};

const MODULO_ICON: Record<
  RecentRow['modulo'],
  ComponentType<SVGProps<SVGSVGElement>>
> = {
  docentes: IconBook,
  familias: IconHouse,
  profesionales: IconMedkit,
};

const MODULO_TINT: Record<RecentRow['modulo'], string> = {
  docentes: 'bg-[#D6F0E0] text-[#27AE60]',
  familias: 'bg-[#fef3c7] text-[#E67E22]',
  profesionales: 'bg-[#dbeafe] text-[#2E86C1]',
};

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 6) return 'Buenas noches';
  if (h < 13) return 'Buen día';
  if (h < 19) return 'Buenas tardes';
  return 'Buenas noches';
}

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

      <header className="relative overflow-hidden rounded-[20px] border border-[#e2e8f0] bg-gradient-to-br from-[#D7EAF6] via-white to-[#fef3c7] p-6 sm:p-8">
        <div
          aria-hidden
          className="absolute inset-y-0 right-0 w-1/2 opacity-[0.08]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 80% 50%, #27AE60, transparent 60%)',
          }}
        />
        <div className="relative flex items-start justify-between gap-4">
          <div>
            <p className="mb-1 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#27AE60]">
              <IconWave width={14} height={14} stroke="#27AE60" />
              {getGreeting()}
            </p>
            <h1 className="font-serif text-3xl font-bold text-[#2E86C1] sm:text-4xl">
              Hola, {perfil.nombre}
            </h1>
            <p className="mt-2 max-w-xl text-base text-[#4A5968]">
              ¿Qué clase inclusiva vas a planificar hoy? Tenés{' '}
              <strong className="text-[#27AE60]">{restantes}</strong>{' '}
              {restantes === 1 ? 'guía disponible' : 'guías disponibles'} este mes.
            </p>
          </div>
          <div className="hidden shrink-0 sm:block">
            <svg viewBox="0 0 120 90" className="h-20 w-auto" aria-hidden>
              <circle cx="30" cy="45" r="18" fill="#fde68a" />
              <rect x="17" y="60" width="26" height="28" rx="6" fill="#E67E22" />
              <circle cx="75" cy="45" r="18" fill="#c4b5fd" />
              <rect x="62" y="60" width="26" height="28" rx="6" fill="#27AE60" />
              <path d="M95 30 l4 9 9 3 -9 3 -4 9 -4 -9 -9 -3 9 -3z" fill="#27AE60" opacity=".9" />
            </svg>
          </div>
        </div>
      </header>

      <article className="relative overflow-hidden rounded-[20px] bg-gradient-to-br from-[#27AE60] to-[#0d9448] p-6 text-white shadow-[0_8px_24px_rgba(22,163,74,0.25)] sm:p-8">
        <div
          aria-hidden
          className="absolute -right-4 -top-4 h-56 w-56 overflow-hidden rounded-full opacity-30 sm:opacity-40"
        >
          <Image
            src={PHOTOS.dashboardCta}
            alt=""
            width={400}
            height={400}
            className="h-full w-full object-cover"
          />
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
            className="mt-2 inline-flex w-fit items-center gap-2 rounded-[12px] bg-white px-6 py-3 text-sm font-bold text-[#27AE60] shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition hover:bg-[#FBF8F2]"
          >
            Comenzar <span aria-hidden>→</span>
          </Link>
        </div>
      </article>

      {perfil.tipo_usuario === 'docente' && (
        <article className="relative overflow-hidden rounded-[20px] border border-[#e2e8f0] bg-gradient-to-br from-[#042C53] to-[#185FA5] p-6 text-white shadow-[0_8px_24px_rgba(4,44,83,0.2)] sm:p-8">
          <div className="relative flex flex-col gap-4 sm:max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-white/80">
              Documento institucional
            </p>
            <h2 className="font-serif text-2xl font-bold sm:text-3xl">
              Proyecto Pedagógico Individual (PPI)
            </h2>
            <p className="text-sm text-white/90 sm:text-base">
              Obligatorio por Res. CFE 311/16 para cada alumno con discapacidad. IncluAI redacta las 10 secciones completas en base a tus observaciones. Te ahorrás días de trabajo administrativo.
            </p>
            <Link
              href="/ppi"
              className="mt-2 inline-flex w-fit items-center gap-2 rounded-[12px] bg-white px-6 py-3 text-sm font-bold text-[#042C53] shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition hover:bg-[#f9f7f0]"
            >
              Mis PPIs <span aria-hidden>→</span>
            </Link>
          </div>
        </article>
      )}

      <ModuleSelector tipoUsuario={perfil.tipo_usuario} />

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          Icon={IconBars}
          iconBg="bg-[#D6F0E0]"
          iconStroke="#27AE60"
          label="Guías este mes"
          value={`${perfil.consultas_mes} de ${limite}`}
          caption="usadas"
        >
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#D7EAF6]">
            <div
              className="h-full bg-gradient-to-r from-[#27AE60] to-[#0d9448] transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
        </StatCard>

        <StatCard
          Icon={IconBook}
          iconBg="bg-[#fef3c7]"
          iconStroke="#E67E22"
          label="Restantes"
          value={String(restantes)}
          caption={restantes === 1 ? 'guía disponible' : 'guías disponibles'}
        >
          <p className="mt-3 text-xs text-[#4A5968]">
            {totalGuias > 0 ? 'Ya estás planificando' : 'Empezá cuando quieras'}
          </p>
        </StatCard>

        <StatCard
          Icon={IconStar}
          iconBg="bg-[#dbeafe]"
          iconStroke="#2E86C1"
          label="Tu plan"
          value={
            perfil.plan === 'free'
              ? 'Gratuito'
              : perfil.plan === 'pro'
                ? 'Pro'
                : 'Institucional'
          }
          caption={perfil.plan === 'pro' ? 'activo' : ''}
        >
          {perfil.plan === 'free' && (
            <Link
              href="/planes"
              className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#E67E22] hover:underline"
            >
              Mejorar plan <IconArrowRight width={12} height={12} stroke="#E67E22" />
            </Link>
          )}
        </StatCard>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-serif text-xl font-bold text-[#2E86C1]">
            Tus últimas guías
          </h3>
          {recientes && recientes.length > 0 && (
            <Link
              href="/historial"
              className="text-sm font-semibold text-[#27AE60] hover:underline"
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
            <div className="h-20 w-20 overflow-hidden rounded-full shadow-md">
              <Image
                src={PHOTOS.dashboardEmpty}
                alt="Niños participando en actividad grupal"
                width={200}
                height={200}
                className="h-full w-full object-cover"
              />
            </div>
            <p className="font-serif text-base font-bold text-[#2E86C1]">
              Todavía no generaste ninguna guía
            </p>
            <p className="max-w-xs text-sm text-[#4A5968]">
              Tu primera clase inclusiva está a unos clics. Vamos juntos.
            </p>
            <Link
              href="/nueva-consulta"
              className="mt-2 inline-flex items-center rounded-[10px] bg-[#27AE60] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#27AE60]"
            >
              Empezá ahora →
            </Link>
          </div>
        )}
      </section>

      <aside className="flex items-start gap-4 rounded-[16px] border border-[#fcd34d]/40 bg-[#fef3c7] p-5 text-sm text-[#1F2E3D]">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E67E22] text-white">
          <IconLightbulb width={18} height={18} stroke="white" />
        </span>
        <div>
          <p>
            <strong className="text-[#2E86C1]">Tip del día.</strong> {tip.texto}
          </p>
          <p className="mt-1 text-xs text-[#4A5968]">— {tip.fuente}</p>
        </div>
      </aside>
    </div>
  );
}

function StatCard({
  Icon,
  iconBg,
  iconStroke,
  label,
  value,
  caption,
  children,
}: {
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  iconBg: string;
  iconStroke: string;
  label: string;
  value: string;
  caption?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-[16px] border border-[#e2e8f0] bg-white p-5 shadow-[0_2px_8px_rgba(15,34,64,0.04)]">
      <div className="flex items-center gap-2">
        <span className={`flex h-8 w-8 items-center justify-center rounded-full ${iconBg}`}>
          <Icon width={16} height={16} stroke={iconStroke} />
        </span>
        <p className="text-xs font-semibold uppercase tracking-wide text-[#4A5968]">
          {label}
        </p>
      </div>
      <p className="mt-2 font-serif text-2xl font-bold text-[#2E86C1]">
        {value}
        {caption && (
          <span className="ml-1 text-sm font-normal text-[#4A5968]">{caption}</span>
        )}
      </p>
      {children}
    </div>
  );
}

function RecentCard({ row }: { row: RecentRow }) {
  const tags = row.discapacidades
    .map((id) => DISCAPACIDADES.find((d) => d.id === id))
    .filter((x): x is (typeof DISCAPACIDADES)[number] => Boolean(x));
  const Icon = MODULO_ICON[row.modulo];
  const tint = MODULO_TINT[row.modulo];
  return (
    <Link href={`/resultado?id=${row.id}`}>
      <article className="flex items-center gap-4 rounded-[16px] border border-[#e2e8f0] bg-white p-4 transition hover:border-[#27AE60] hover:shadow-[0_4px_16px_rgba(22,163,74,0.12)]">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${tint}`}
        >
          <Icon
            width={20}
            height={20}
            stroke="currentColor"
            strokeWidth={2}
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-[#2E86C1]">
            {row.materia ?? row.modulo}
          </p>
          <p className="truncate text-xs text-[#4A5968]">{row.contenido}</p>
          {tags.length > 0 && (
            <div className="mt-1.5 flex flex-wrap gap-1">
              {tags.slice(0, 3).map((t) => (
                <span
                  key={t.id}
                  className="rounded-full bg-[#D6F0E0] px-2 py-0.5 text-[10px] font-semibold text-[#27AE60]"
                >
                  {t.label}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="shrink-0 text-right">
          <p className="text-xs text-[#4A5968]">
            {new Date(row.created_at).toLocaleDateString('es-AR', {
              day: '2-digit',
              month: 'short',
            })}
          </p>
          <span className="mt-1 inline-flex text-[#4A5968]">
            <IconArrowRight width={14} height={14} stroke="#4A5968" />
          </span>
        </div>
      </article>
    </Link>
  );
}

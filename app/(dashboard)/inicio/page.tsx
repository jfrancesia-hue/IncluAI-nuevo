import Link from 'next/link';
import Image from 'next/image';
import type { ComponentType, SVGProps } from 'react';
import { getPerfil } from '@/lib/auth';
import { LIMITES_PLAN, type PlanUsuario } from '@/lib/types';
import { createClient } from '@/lib/supabase/server';
import { DISCAPACIDADES } from '@/data/discapacidades';
import { ModuleSelector } from '@/components/module/module-selector';
import { Onboarding } from '@/components/module/onboarding';
import { getTipDelDia } from '@/data/tips';
import { PHOTOS } from '@/lib/photos';
import { RevealOnScroll } from '@/components/landing/RevealOnScroll';
import { AnimatedNumber } from '@/components/ui/AnimatedNumber';
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

function nombrePlan(plan: PlanUsuario): string {
  if (plan === 'free') return 'Gratuito';
  if (plan === 'basico') return 'Básico';
  if (plan === 'profesional') return 'Profesional';
  return 'Premium';
}

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
  docentes: 'bg-[#D7EAF6] text-[#2E86C1]',
  familias: 'bg-[#D6F0E0] text-[#27AE60]',
  profesionales: 'bg-[#EDE3F6] text-[#A569BD]',
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

  const limite = LIMITES_PLAN[perfil.plan].guias_mes;
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
    <div className="flex flex-col gap-10">
      <Onboarding />

      {/* HERO PERSONALIZADO con mesh sutil */}
      <header className="relative overflow-hidden rounded-[24px] border border-[#e2e8f0] bg-white p-7 sm:p-10">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ filter: 'blur(60px)', opacity: 0.45 }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-20%',
              left: '-10%',
              width: '50%',
              height: '120%',
              background:
                'radial-gradient(circle, rgba(46,134,193,0.6), transparent 60%)',
              animation: 'mesh-orb-1 22s ease-in-out infinite',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '0%',
              right: '-10%',
              width: '55%',
              height: '120%',
              background:
                'radial-gradient(circle, rgba(241,196,15,0.4), transparent 60%)',
              animation: 'mesh-orb-2 28s ease-in-out infinite',
            }}
          />
        </div>

        <RevealOnScroll className="relative">
          <p
            className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase"
            style={{
              fontFamily: 'var(--font-display)',
              letterSpacing: '0.08em',
              color: '#27AE60',
            }}
          >
            <IconWave width={14} height={14} stroke="#27AE60" />
            {getGreeting()}
          </p>
          <h1
            className="text-3xl font-bold sm:text-4xl lg:text-5xl"
            style={{
              fontFamily: 'var(--font-display)',
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              color: '#1F2E3D',
            }}
          >
            Hola, <span className="gradient-text">{perfil.nombre}</span>
          </h1>
          <p
            className="mt-3 max-w-xl text-base text-[#4A5968]"
            style={{ lineHeight: 1.65 }}
          >
            ¿Qué clase inclusiva vas a planificar hoy? Tenés{' '}
            <strong className="text-[#27AE60]">{restantes}</strong>{' '}
            {restantes === 1 ? 'guía disponible' : 'guías disponibles'} este
            mes.
          </p>
        </RevealOnScroll>
      </header>

      {/* CTA principal — nueva guía */}
      <RevealOnScroll>
        <article className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[#0d7c3a] via-[#27AE60] to-[#1e8449] p-7 text-white shadow-[0_16px_48px_rgba(39,174,96,0.35)] sm:p-10">
          <div
            aria-hidden
            className="absolute -right-12 -top-12 h-72 w-72 overflow-hidden rounded-full opacity-30"
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
            <p
              className="text-xs font-semibold uppercase text-white/80"
              style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.08em' }}
            >
              ⚡ Empezá una nueva
            </p>
            <h2
              className="text-2xl font-bold sm:text-3xl"
              style={{
                fontFamily: 'var(--font-display)',
                letterSpacing: '-0.025em',
                lineHeight: 1.1,
              }}
            >
              Nueva guía inclusiva
            </h2>
            <p
              className="text-sm text-white/90 sm:text-base"
              style={{ lineHeight: 1.6 }}
            >
              Contanos tu clase y en minutos tenés estrategias, materiales y
              evaluaciones personalizadas para tu alumno/a.
            </p>
            <Link
              href="/nueva-consulta"
              className="magnetic-btn mt-2 inline-flex w-fit items-center gap-2 rounded-[12px] bg-white px-6 py-3 text-sm font-bold text-[#27AE60] shadow-[0_8px_20px_rgba(0,0,0,0.18)]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Comenzar <span aria-hidden>→</span>
            </Link>
          </div>
        </article>
      </RevealOnScroll>

      {/* PPI banner — solo docentes */}
      {perfil.tipo_usuario === 'docente' && (
        <RevealOnScroll>
          <article className="relative overflow-hidden rounded-[24px] border border-white/10 bg-gradient-to-br from-[#042C53] via-[#0a3a6b] to-[#185FA5] p-7 text-white shadow-[0_16px_48px_rgba(4,44,83,0.35)] sm:p-10">
            <div className="relative flex flex-col gap-4 sm:max-w-xl">
              <p
                className="text-xs font-semibold uppercase text-white/80"
                style={{
                  fontFamily: 'var(--font-display)',
                  letterSpacing: '0.08em',
                }}
              >
                📋 Documento institucional
              </p>
              <h2
                className="text-2xl font-bold sm:text-3xl"
                style={{
                  fontFamily: 'var(--font-display)',
                  letterSpacing: '-0.025em',
                  lineHeight: 1.1,
                }}
              >
                Proyecto Pedagógico Individual (PPI)
              </h2>
              <p
                className="text-sm text-white/90 sm:text-base"
                style={{ lineHeight: 1.6 }}
              >
                Obligatorio por Res. CFE 311/16 para cada alumno con
                discapacidad. IncluAI redacta las 10 secciones completas en
                base a tus observaciones. Te ahorrás días de trabajo
                administrativo.
              </p>
              <Link
                href="/ppi"
                className="magnetic-btn mt-2 inline-flex w-fit items-center gap-2 rounded-[12px] bg-white px-6 py-3 text-sm font-bold text-[#042C53] shadow-[0_8px_20px_rgba(0,0,0,0.2)]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Mis PPIs <span aria-hidden>→</span>
              </Link>
            </div>
          </article>
        </RevealOnScroll>
      )}

      <ModuleSelector tipoUsuario={perfil.tipo_usuario} />

      {/* Stats cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <RevealOnScroll delay={0}>
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
                className="h-full rounded-full bg-gradient-to-r from-[#27AE60] to-[#0d9448] transition-all duration-1000"
                style={{ width: `${pct}%` }}
              />
            </div>
          </StatCard>
        </RevealOnScroll>

        <RevealOnScroll delay={100}>
          <StatCard
            Icon={IconBook}
            iconBg="bg-[#fef3c7]"
            iconStroke="#E67E22"
            label="Restantes"
            value={
              <AnimatedNumber
                value={restantes}
                duration={1200}
                style={{ fontVariantNumeric: 'tabular-nums' }}
              />
            }
            caption={restantes === 1 ? 'guía' : 'guías'}
          >
            <p
              className="mt-3 text-xs font-semibold text-[#3d4a5a]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {totalGuias > 0 ? 'Ya estás planificando' : 'Empezá cuando quieras'}
            </p>
          </StatCard>
        </RevealOnScroll>

        <RevealOnScroll delay={200}>
          <StatCard
            Icon={IconStar}
            iconBg="bg-[#dbeafe]"
            iconStroke="#2E86C1"
            label="Tu plan"
            value={nombrePlan(perfil.plan)}
            caption={perfil.plan !== 'free' ? '✓' : ''}
          >
            {perfil.plan === 'free' && (
              <Link
                href="/planes"
                className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#E67E22] hover:underline"
              >
                Mejorar plan{' '}
                <IconArrowRight width={12} height={12} stroke="#E67E22" />
              </Link>
            )}
          </StatCard>
        </RevealOnScroll>
      </section>

      {/* Recientes */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h3
            className="text-2xl font-bold text-[#1F2E3D]"
            style={{
              fontFamily: 'var(--font-display)',
              letterSpacing: '-0.02em',
            }}
          >
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
            {recientes.map((c, i) => (
              <RevealOnScroll key={c.id} delay={i * 80}>
                <RecentCard row={c} />
              </RevealOnScroll>
            ))}
          </div>
        ) : (
          <div className="flex min-h-[200px] flex-col items-center justify-center gap-3 rounded-[20px] border-2 border-dashed border-[#e2e8f0] bg-white p-10 text-center">
            <div className="h-20 w-20 overflow-hidden rounded-full shadow-md">
              <Image
                src={PHOTOS.dashboardEmpty}
                alt="Niños participando en actividad grupal"
                width={200}
                height={200}
                className="h-full w-full object-cover"
              />
            </div>
            <p
              className="text-base font-bold text-[#2E86C1]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Todavía no generaste ninguna guía
            </p>
            <p className="max-w-xs text-sm text-[#4A5968]">
              Tu primera clase inclusiva está a unos clics. Vamos juntos.
            </p>
            <Link
              href="/nueva-consulta"
              className="magnetic-btn mt-2 inline-flex items-center rounded-[12px] bg-[#27AE60] px-5 py-2.5 text-sm font-bold text-white"
            >
              Empezá ahora →
            </Link>
          </div>
        )}
      </section>

      {/* Tip del día */}
      <RevealOnScroll>
        <aside className="bento-card flex items-start gap-4 rounded-[16px] border border-[#fcd34d]/40 bg-gradient-to-br from-[#fef3c7] to-[#fef9e0] p-5 text-sm text-[#1F2E3D]">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#E67E22] text-white shadow-lg">
            <IconLightbulb width={20} height={20} stroke="white" />
          </span>
          <div>
            <p style={{ lineHeight: 1.65 }}>
              <strong
                className="text-[#92400e]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Tip del día.
              </strong>{' '}
              {tip.texto}
            </p>
            <p className="mt-1 text-xs text-[#92400e]/80">— {tip.fuente}</p>
          </div>
        </aside>
      </RevealOnScroll>
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
  value: React.ReactNode;
  caption?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="bento-card rounded-[20px] border border-[#e2e8f0] bg-white p-6 shadow-[0_2px_12px_rgba(15,34,64,0.04)]">
      <div className="flex items-center gap-2">
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-xl ${iconBg}`}
        >
          <Icon width={16} height={16} stroke={iconStroke} />
        </span>
        <p
          className="text-xs font-semibold uppercase text-[#4A5968]"
          style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.08em' }}
        >
          {label}
        </p>
      </div>
      <p
        className="mt-3 text-3xl font-extrabold text-[#1F5F8A]"
        style={{
          fontFamily: 'var(--font-display)',
          letterSpacing: '-0.02em',
        }}
      >
        {value}
        {caption && (
          <span className="ml-1.5 text-sm font-medium text-[#3d4a5a]">
            {caption}
          </span>
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
      <article className="bento-card flex items-center gap-4 rounded-[16px] border border-[#e2e8f0] bg-white p-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${tint}`}
        >
          <Icon
            width={20}
            height={20}
            stroke="currentColor"
            strokeWidth={2}
          />
        </div>
        <div className="min-w-0 flex-1">
          <p
            className="truncate text-base font-bold text-[#1F2E3D]"
            style={{
              fontFamily: 'var(--font-display)',
              letterSpacing: '-0.01em',
            }}
          >
            {row.materia ?? row.modulo}
          </p>
          <p
            className="truncate text-sm font-medium text-[#3d4a5a]"
            style={{ lineHeight: 1.5 }}
          >
            {row.contenido}
          </p>
          {tags.length > 0 && (
            <div className="mt-1.5 flex flex-wrap gap-1">
              {tags.slice(0, 3).map((t) => (
                <span
                  key={t.id}
                  className="rounded-full bg-[#D6F0E0] px-2 py-0.5 text-[10px] font-bold text-[#0d7c3a]"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {t.label}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="shrink-0 text-right">
          <p
            className="text-xs font-semibold text-[#3d4a5a]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {new Date(row.created_at).toLocaleDateString('es-AR', {
              day: '2-digit',
              month: 'short',
            })}
          </p>
          <span className="mt-1 inline-flex text-[#1F2E3D]">
            <IconArrowRight width={14} height={14} stroke="#1F2E3D" />
          </span>
        </div>
      </article>
    </Link>
  );
}

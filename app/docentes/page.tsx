import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { PHOTOS } from '@/lib/photos';
import { LIMITES_PLAN } from '@/lib/types';
import { LogoLockup } from '@/components/branding/LogoLockup';
import { RevealOnScroll } from '@/components/landing/RevealOnScroll';
import { MarqueeProvincias } from '@/components/landing/MarqueeProvincias';
import { Footer } from '@/components/landing/Footer';
import { LeadLink } from '@/components/analytics/LeadLink';

export const metadata = {
  title: 'Para docentes — Adaptá tu clase en 2 minutos',
  description:
    'Planificá clases inclusivas con IA: estrategias DUA, materiales adaptados y evaluaciones diferenciadas — específicas para tu alumno y tu contenido. Hecho en Argentina.',
  openGraph: {
    title: 'IncluAI · Adaptá tu clase en 2 minutos',
    description:
      'Para docentes argentinos: la IA que te ayuda a planificar inclusión real, no solo declarativa.',
    type: 'website',
    locale: 'es_AR',
  },
};

const REGISTRO_HREF =
  '/registro?utm_source=meta&utm_medium=landing&utm_content=docentes&tipo=docente';

export default async function LandingDocentes() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect('/inicio');

  return (
    <div className="min-h-screen bg-[#FBF8F2] text-[#1F2E3D]">
      <main>
        <Hero />
        <Pains />
        <How />
        <Proof />
        <PricingTeaser />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(135deg, #061b34 0%, #0f2240 35%, #0e4f68 100%)',
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ filter: 'blur(80px)', opacity: 0.5 }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-10%',
            left: '-5%',
            width: '50%',
            height: '60%',
            background:
              'radial-gradient(circle, rgba(46,134,193,0.85), transparent 60%)',
            animation: 'mesh-orb-1 18s ease-in-out infinite',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-15%',
            right: '-10%',
            width: '60%',
            height: '70%',
            background:
              'radial-gradient(circle, rgba(39,174,96,0.7), transparent 60%)',
            animation: 'mesh-orb-2 22s ease-in-out infinite',
          }}
        />
      </div>

      <nav
        aria-label="Barra superior"
        className="relative mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8"
      >
        <LogoLockup
          href="/"
          size="md"
          tone="dark"
          logoVariant="white"
          gradientId="docentes-logo"
        />
        <Link
          href="/login"
          className="rounded-[10px] border border-white/25 bg-white/5 px-4 py-2 text-sm font-medium text-white backdrop-blur transition hover:bg-white/15"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Iniciar sesión
        </Link>
      </nav>

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-5 pb-24 pt-10 sm:px-8 lg:grid-cols-[1.1fr_1fr] lg:gap-14 lg:pb-28 lg:pt-16">
        <div className="flex flex-col gap-6 text-white">
          <span
            className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-white/85 backdrop-blur"
            style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.06em' }}
          >
            <span
              aria-hidden
              style={{
                width: 6,
                height: 6,
                borderRadius: 999,
                background: '#27AE60',
                boxShadow: '0 0 8px rgba(39, 174, 96, 0.7)',
              }}
            />
            PARA DOCENTES · CFE 311/16
          </span>

          <h1
            className="text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-6xl"
            style={{
              fontFamily: 'var(--font-display)',
              letterSpacing: '-0.035em',
            }}
          >
            Adaptá tu clase{' '}
            <span className="gradient-text">en 2 minutos.</span>
          </h1>

          <p
            className="max-w-xl text-base text-white/85 sm:text-lg"
            style={{ lineHeight: 1.65 }}
          >
            Decinos qué vas a enseñar y qué discapacidad tiene tu alumno. La
            IA te devuelve estrategias DUA, materiales adaptados y evaluaciones
            diferenciadas — listas para usar mañana.
          </p>

          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
            <LeadLink
              href={REGISTRO_HREF}
              leadSource="docentes_landing_hero"
              className="magnetic-btn inline-flex items-center justify-center gap-2 rounded-[14px] bg-[#27AE60] px-7 py-4 text-base font-bold text-white shadow-[0_8px_32px_rgba(39,174,96,0.45)]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Crear mi primera guía — gratis
              <span aria-hidden>→</span>
            </LeadLink>
            <p className="text-xs text-white/60">
              Sin tarjeta · 1 guía gratis al mes
            </p>
          </div>

          <dl className="mt-6 grid max-w-md grid-cols-3 gap-6 border-t border-white/10 pt-6">
            <Stat valor="2 min" label="por guía" />
            <Stat valor="500+" label="docentes activos" />
            <Stat valor="8" label="provincias" />
          </dl>
        </div>

        <div className="relative">
          <div
            className="relative overflow-hidden rounded-[24px] shadow-[0_24px_64px_-12px_rgba(0,0,0,0.6)] ring-1 ring-white/10"
            style={{ transform: 'perspective(1200px) rotateY(-3deg) rotateX(2deg)' }}
          >
            <Image
              src={PHOTOS.hero}
              alt="Docente trabajando junto a alumno en un aula inclusiva"
              width={1600}
              height={1100}
              priority
              sizes="(max-width: 1024px) 100vw, 720px"
              className="h-[420px] w-full object-cover sm:h-[480px] lg:h-[540px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ valor, label }: { valor: string; label: string }) {
  return (
    <div>
      <dt
        className="text-[28px] font-extrabold leading-none text-white"
        style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.03em' }}
      >
        {valor}
      </dt>
      <dd className="mt-1 text-xs text-white/60">{label}</dd>
    </div>
  );
}

function Pains() {
  const items = [
    {
      icon: '⏰',
      titulo: 'No tenés 4 horas para planificar',
      desc: 'Adaptar una clase para un alumno con TEA, motriz o intelectual te lleva una tarde entera. IncluAI lo hace en minutos.',
    },
    {
      icon: '🎯',
      titulo: 'No querés "buenas intenciones genéricas"',
      desc: 'Querés estrategias concretas para tu contenido específico, no recomendaciones vagas que ya conocés.',
    },
    {
      icon: '📋',
      titulo: 'Necesitás respaldo normativo',
      desc: 'CFE 311/16, Ley 26.206, Ley 27.306. La IA cita el marco legal cuando corresponde — útil ante supervisión y CUD.',
    },
  ];
  return (
    <section className="bg-white px-5 py-24 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <RevealOnScroll className="mx-auto max-w-2xl text-center">
          <h2
            className="text-3xl font-bold sm:text-4xl"
            style={{
              fontFamily: 'var(--font-display)',
              letterSpacing: '-0.025em',
              lineHeight: 1.15,
            }}
          >
            Si sos docente,{' '}
            <span className="gradient-text">esto lo conocés.</span>
          </h2>
        </RevealOnScroll>
        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
          {items.map((it, i) => (
            <RevealOnScroll
              key={it.titulo}
              delay={i * 100}
              as="article"
              className="bento-card flex flex-col gap-3 rounded-[20px] border border-[#e2e8f0] bg-[#FBF8F2] p-7"
            >
              <span aria-hidden className="text-3xl">
                {it.icon}
              </span>
              <h3
                className="text-lg font-bold text-[#1F2E3D]"
                style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}
              >
                {it.titulo}
              </h3>
              <p className="text-sm text-[#4A5968]" style={{ lineHeight: 1.65 }}>
                {it.desc}
              </p>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}

function How() {
  const pasos = [
    {
      num: '01',
      titulo: 'Contanos tu clase',
      desc: 'Nivel, materia, contenido y discapacidad de tu alumno — formulario de 3 pasos.',
      icon: '📝',
      img: PHOTOS.step1,
    },
    {
      num: '02',
      titulo: 'La IA arma tu guía',
      desc: 'En segundos: estrategias DUA, materiales adaptados, evaluaciones diferenciadas.',
      icon: '✨',
      img: PHOTOS.step2,
    },
    {
      num: '03',
      titulo: 'Aplicalo mañana',
      desc: 'Pensado para implementar con los recursos que ya tenés. Copiá, imprimí o exportá.',
      icon: '🎯',
      img: PHOTOS.step3,
    },
  ];
  return (
    <section className="bg-[#FBF8F2] px-5 py-24 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <RevealOnScroll className="mx-auto max-w-2xl text-center">
          <span
            className="inline-flex items-center gap-2 rounded-full bg-[#D7EAF6] px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-[#2E86C1]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            ⚡ Cómo funciona
          </span>
          <h2
            className="mt-4 text-3xl font-bold sm:text-4xl"
            style={{
              fontFamily: 'var(--font-display)',
              letterSpacing: '-0.025em',
              lineHeight: 1.15,
            }}
          >
            De tu aula a una guía inclusiva,{' '}
            <span className="gradient-text">en 3 pasos</span>
          </h2>
        </RevealOnScroll>
        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {pasos.map((p, i) => (
            <RevealOnScroll
              key={p.num}
              delay={i * 100}
              as="article"
              className="bento-card group relative flex flex-col overflow-hidden rounded-[20px] border border-[#e2e8f0] bg-white"
            >
              <div className="relative h-44 overflow-hidden">
                <Image
                  src={p.img}
                  alt=""
                  width={600}
                  height={400}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                />
                <span
                  aria-hidden
                  className="absolute left-4 top-4 flex h-12 w-12 items-center justify-center rounded-full bg-white text-2xl shadow-lg"
                >
                  {p.icon}
                </span>
                <span
                  className="absolute bottom-3 right-4 text-5xl font-extrabold text-white/95 drop-shadow-md"
                  style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.04em' }}
                >
                  {p.num}
                </span>
              </div>
              <div className="flex flex-col gap-2 p-6">
                <h3
                  className="text-xl font-bold"
                  style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}
                >
                  {p.titulo}
                </h3>
                <p className="text-sm text-[#4A5968]" style={{ lineHeight: 1.65 }}>
                  {p.desc}
                </p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}

function Proof() {
  return (
    <section className="border-y border-[#e2e8f0] bg-white px-5 py-12 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <p
          className="mb-5 text-center text-xs font-semibold uppercase tracking-[0.06em] text-[#4A5968]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Docentes ya activos en
        </p>
        <MarqueeProvincias />
        <RevealOnScroll className="mx-auto mt-12 max-w-2xl rounded-[24px] bg-[#fef3c7] p-8 text-center text-[#1F2E3D]">
          <blockquote
            className="text-lg leading-snug sm:text-xl"
            style={{
              fontFamily: 'var(--font-display)',
              letterSpacing: '-0.015em',
              fontWeight: 600,
            }}
          >
            &ldquo;En 3 minutos tuve la guía que me hubiera llevado toda una
            tarde armar. Y encima, pensada para Joaquín específicamente.&rdquo;
          </blockquote>
          <p className="mt-3 text-sm text-[#4A5968]">
            <strong className="text-[#2E86C1]">María L.</strong> · Docente de
            primaria · Tucumán
          </p>
        </RevealOnScroll>
      </div>
    </section>
  );
}

function PricingTeaser() {
  return (
    <section className="bg-[#FBF8F2] px-5 py-24 sm:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <RevealOnScroll>
          <h2
            className="text-3xl font-bold sm:text-4xl"
            style={{
              fontFamily: 'var(--font-display)',
              letterSpacing: '-0.025em',
              lineHeight: 1.15,
            }}
          >
            Empezás gratis. <span className="gradient-text">Sin tarjeta.</span>
          </h2>
          <p className="mt-4 text-base text-[#4A5968]" style={{ lineHeight: 1.65 }}>
            Una guía gratis por mes para conocer la herramienta. Cuando te quede
            chico, planes desde{' '}
            <strong>
              ${LIMITES_PLAN.basico.precio_ars.toLocaleString('es-AR')}/mes
            </strong>{' '}
            con 20 guías, exportación a PDF e historial completo.
          </p>
          <Link
            href="/#pricing"
            className="mt-6 inline-flex text-sm font-semibold text-[#2E86C1] hover:underline"
          >
            Ver todos los planes →
          </Link>
        </RevealOnScroll>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="relative overflow-hidden">
      <Image
        src={PHOTOS.closeup}
        alt=""
        width={1600}
        height={900}
        sizes="100vw"
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-[#0f2240]/80 via-[#0f2240]/85 to-[#0f2240]/95"
      />
      <RevealOnScroll className="relative mx-auto flex max-w-4xl flex-col items-center gap-7 px-5 py-24 text-center text-white sm:px-8 sm:py-32">
        <h2
          className="text-4xl font-extrabold leading-[1.05] sm:text-5xl"
          style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.035em' }}
        >
          Mañana podés tener tu primera guía{' '}
          <span className="gradient-text">lista.</span>
        </h2>
        <p
          className="max-w-2xl text-base text-white/85 sm:text-lg"
          style={{ lineHeight: 1.65 }}
        >
          La docente que la armó tardó 2 minutos. Te toca ahora.
        </p>
        <LeadLink
          href={REGISTRO_HREF}
          leadSource="docentes_landing_close"
          className="magnetic-btn inline-flex items-center justify-center gap-2 rounded-[14px] bg-[#27AE60] px-8 py-4 text-base font-bold text-white shadow-[0_12px_40px_rgba(39,174,96,0.55)]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Crear mi primera guía — gratis <span aria-hidden>→</span>
        </LeadLink>
        <p className="text-xs text-white/60">
          Sin tarjeta · 1 guía gratuita al mes · Cancelás cuando quieras
        </p>
      </RevealOnScroll>
    </section>
  );
}

import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { DISCAPACIDADES } from '@/data/discapacidades';
import { LIMITES_PLAN } from '@/lib/types';
import { PHOTOS } from '@/lib/photos';
import { HeroHeadline } from '@/components/landing/HeroHeadline';
import { MarqueeProvincias } from '@/components/landing/MarqueeProvincias';
import { RevealOnScroll } from '@/components/landing/RevealOnScroll';
import { LogoLockup } from '@/components/branding/LogoLockup';

export const metadata = {
  title: 'IncluAI — Cada alumno merece una clase pensada para él',
};

export default async function LandingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect('/inicio');

  return (
    <div className="min-h-screen bg-[#FBF8F2] text-[#1F2E3D]">
      <main>
        <Hero />
        <SocialProof />
        <HowItWorks />
        <BentoFeatures />
        <ExampleOutput />
        <ModulosSection />
        <Pricing />
        <EmotionalClose />
      </main>
      <Footer />
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// HERO
// Mesh gradient animado + headline reveal + stats inline + CTA magnetic
// ─────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Base gradient profundo */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(135deg, #061b34 0%, #0f2240 35%, #0e4f68 100%)',
        }}
      />
      {/* Tres orbes mesh respirando — el "wow" sutil */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ filter: 'blur(80px)', opacity: 0.55 }}
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
            top: '20%',
            right: '-10%',
            width: '55%',
            height: '70%',
            background:
              'radial-gradient(circle, rgba(39,174,96,0.7), transparent 60%)',
            animation: 'mesh-orb-2 22s ease-in-out infinite',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-15%',
            left: '20%',
            width: '60%',
            height: '60%',
            background:
              'radial-gradient(circle, rgba(230,126,34,0.55), transparent 60%)',
            animation: 'mesh-orb-3 26s ease-in-out infinite',
          }}
        />
      </div>
      {/* Grano sutil para "no perfecto" */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage:
            'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'120\' height=\'120\'><filter id=\'n\'><feTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'2\'/></filter><rect width=\'120\' height=\'120\' filter=\'url(%23n)\'/></svg>")',
        }}
      />

      <nav
        aria-label="Barra superior"
        className="relative mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8"
      >
        <LogoLockup
          href="/"
          size="md"
          tone="dark"
          logoVariant="white"
          gradientId="hero-logo"
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
            HECHO EN ARGENTINA · IA ESPECIALIZADA
          </span>

          <HeroHeadline />

          <p
            className="max-w-xl text-base text-white/80 sm:text-lg"
            style={{ lineHeight: 1.65, letterSpacing: '-0.006em' }}
          >
            Inteligencia artificial que te ayuda a planificar clases concretas e
            inclusivas. Estrategias reales, materiales adaptados y evaluaciones
            justas — en minutos.
          </p>

          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/registro"
              className="magnetic-btn inline-flex items-center justify-center gap-2 rounded-[14px] bg-[#27AE60] px-7 py-4 text-base font-bold text-white shadow-[0_8px_32px_rgba(39,174,96,0.45)]"
              style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.01em' }}
            >
              Crear mi primera guía — gratis
              <span aria-hidden>→</span>
            </Link>
            <Link
              href="#features"
              className="inline-flex items-center justify-center text-sm font-semibold text-white/70 transition hover:text-white"
            >
              Ver cómo funciona ↓
            </Link>
          </div>

          {/* Stats inline */}
          <dl className="mt-6 grid max-w-md grid-cols-3 gap-6 border-t border-white/10 pt-6">
            <Stat valor="500+" label="docentes" />
            <Stat valor="8" label="provincias" />
            <Stat valor="1.2k+" label="guías generadas" />
          </dl>
        </div>

        <div className="relative">
          <div
            className="relative overflow-hidden rounded-[24px] shadow-[0_24px_64px_-12px_rgba(0,0,0,0.6)] ring-1 ring-white/10"
            style={{
              transform: 'perspective(1200px) rotateY(-3deg) rotateX(2deg)',
            }}
          >
            <Image
              src={PHOTOS.hero}
              alt="Docente trabajando junto a alumno en un aula inclusiva argentina"
              width={1600}
              height={1100}
              priority
              sizes="(max-width: 1024px) 100vw, 720px"
              className="h-[420px] w-full object-cover sm:h-[480px] lg:h-[540px]"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-tr from-[#0f2240]/40 via-transparent to-transparent"
            />
          </div>
          {/* Floating badge */}
          <div
            className="absolute -bottom-5 -left-4 hidden items-center gap-3 rounded-[16px] bg-white px-4 py-3 shadow-2xl ring-1 ring-black/5 sm:flex lg:-left-6"
            style={{ animation: 'glow-pulse 3.6s ease-in-out infinite' }}
          >
            <span aria-hidden className="text-2xl">⚡</span>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-[#4A5968]">
                Generación
              </p>
              <p
                className="text-sm font-bold text-[#2E86C1]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                30 segundos
              </p>
            </div>
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

// ─────────────────────────────────────────────────────────
// SOCIAL PROOF — Marquee de provincias
// ─────────────────────────────────────────────────────────
function SocialProof() {
  return (
    <section className="border-y border-[#e2e8f0] bg-white px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <p
          className="mb-5 text-center text-xs font-semibold uppercase tracking-[0.06em] text-[#4A5968]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Docentes ya activos en
        </p>
        <MarqueeProvincias />
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────
// CÓMO FUNCIONA — 3 pasos con stagger reveal
// ─────────────────────────────────────────────────────────
function HowItWorks() {
  const pasos = [
    {
      num: '01',
      titulo: 'Contanos tu clase',
      desc: 'Seleccioná nivel, materia, contenido y la discapacidad de tu alumno en un formulario de 3 pasos.',
      icon: '📝',
      img: PHOTOS.step1,
    },
    {
      num: '02',
      titulo: 'La IA genera tu guía',
      desc: 'En segundos recibís estrategias concretas, materiales adaptados y evaluaciones diferenciadas — específicas para tu contenido.',
      icon: '✨',
      img: PHOTOS.step2,
    },
    {
      num: '03',
      titulo: 'Aplicalo mañana',
      desc: 'Todo pensado para implementar con los recursos que ya tenés. Copiá, imprimí o guardá tus guías.',
      icon: '🎯',
      img: PHOTOS.step3,
    },
  ];

  return (
    <section
      id="features"
      className="relative bg-gradient-to-b from-[#FBF8F2] to-white px-5 py-24 sm:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <RevealOnScroll className="mx-auto max-w-2xl text-center">
          <span
            className="inline-flex items-center gap-2 rounded-full bg-[#D7EAF6] px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-[#2E86C1]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            ⚡ Cómo funciona
          </span>
          <h2
            className="mt-4 text-3xl font-bold text-[#1F2E3D] sm:text-4xl"
            style={{
              fontFamily: 'var(--font-display)',
              letterSpacing: '-0.025em',
              lineHeight: 1.15,
            }}
          >
            De tu aula a una guía inclusiva,{' '}
            <span className="gradient-text">en 3 pasos</span>
          </h2>
          <p
            className="mt-5 text-base text-[#4A5968]"
            style={{ lineHeight: 1.65 }}
          >
            Pensado para una docente con tiempo limitado y ganas reales de
            incluir.
          </p>
        </RevealOnScroll>

        <div className="relative mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Línea conectora desktop only */}
          <div
            aria-hidden
            className="absolute left-[16%] right-[16%] top-[110px] hidden h-px md:block"
            style={{
              background:
                'linear-gradient(90deg, transparent, rgba(39,174,96,0.4) 20%, rgba(46,134,193,0.4) 50%, rgba(230,126,34,0.4) 80%, transparent)',
            }}
          />

          {pasos.map((p, i) => (
            <RevealOnScroll
              key={p.num}
              delay={i * 100}
              as="article"
              className="bento-card group relative flex flex-col overflow-hidden rounded-[20px] border border-[#e2e8f0] bg-white shadow-[0_4px_20px_rgba(15,34,64,0.04)]"
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={p.img}
                  alt=""
                  width={600}
                  height={400}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"
                />
                <span
                  aria-hidden
                  className="absolute left-4 top-4 flex h-12 w-12 items-center justify-center rounded-full bg-white text-2xl shadow-lg"
                >
                  {p.icon}
                </span>
                <span
                  className="absolute bottom-3 right-4 text-5xl font-extrabold text-white/95 drop-shadow-md"
                  style={{
                    fontFamily: 'var(--font-display)',
                    letterSpacing: '-0.04em',
                  }}
                >
                  {p.num}
                </span>
              </div>
              <div className="flex flex-col gap-3 p-7">
                <h3
                  className="text-xl font-bold text-[#1F2E3D]"
                  style={{
                    fontFamily: 'var(--font-display)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {p.titulo}
                </h3>
                <p
                  className="text-sm text-[#4A5968]"
                  style={{ lineHeight: 1.65 }}
                >
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

// ─────────────────────────────────────────────────────────
// BENTO FEATURES — diferenciadores en grid asimétrico
// ─────────────────────────────────────────────────────────
function BentoFeatures() {
  return (
    <section className="bg-[#0a1a30] px-5 py-24 text-white sm:px-8">
      <div className="mx-auto max-w-7xl">
        <RevealOnScroll className="mx-auto max-w-2xl text-center">
          <span
            className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-[#D6F0E0]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            ✨ Por qué somos diferentes
          </span>
          <h2
            className="mt-4 text-3xl font-bold sm:text-4xl"
            style={{
              fontFamily: 'var(--font-display)',
              letterSpacing: '-0.025em',
              lineHeight: 1.15,
            }}
          >
            No es ChatGPT con un prompt.{' '}
            <span className="gradient-text">Es educación inclusiva real.</span>
          </h2>
        </RevealOnScroll>

        <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-3 md:grid-rows-2">
          {/* Card grande verde */}
          <RevealOnScroll
            delay={0}
            as="article"
            className="bento-card spotlight-card md:col-span-2 md:row-span-1 flex flex-col justify-between rounded-[20px] border border-white/10 bg-gradient-to-br from-[#0d7c3a] to-[#1e8449] p-7 ring-1 ring-white/5"
          >
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-[0.08em] text-white/70"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Pensado para Argentina
              </p>
              <h3
                className="mt-3 text-2xl font-bold sm:text-3xl"
                style={{
                  fontFamily: 'var(--font-display)',
                  letterSpacing: '-0.025em',
                  lineHeight: 1.15,
                }}
              >
                Resolución CFE 311/16,{' '}
                <span className="opacity-80">no buenas intenciones.</span>
              </h3>
              <p
                className="mt-3 max-w-md text-sm text-white/80"
                style={{ lineHeight: 1.65 }}
              >
                Conoce los diseños curriculares provinciales, la Ley 26.206 y la
                normativa de educación inclusiva. Cita marco legal cuando
                corresponde — útil ante supervisión y CUD.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {['CFE 311/16', 'Ley 26.206', 'Ley 27.306', 'WCAG 2.1 AA'].map(
                (b) => (
                  <span
                    key={b}
                    className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {b}
                  </span>
                )
              )}
            </div>
          </RevealOnScroll>

          {/* Card chica AI */}
          <RevealOnScroll
            delay={100}
            as="article"
            className="bento-card spotlight-card flex flex-col justify-between rounded-[20px] border border-white/10 bg-gradient-to-br from-[#1F5F8A] to-[#2E86C1] p-6 ring-1 ring-white/5"
          >
            <span aria-hidden className="text-3xl">🧠</span>
            <div className="mt-4">
              <h3
                className="text-lg font-bold"
                style={{
                  fontFamily: 'var(--font-display)',
                  letterSpacing: '-0.02em',
                }}
              >
                IA Claude Opus 4.7
              </h3>
              <p className="mt-2 text-sm text-white/80" style={{ lineHeight: 1.6 }}>
                Modelo de máxima potencia en plan Premium. Tool-use estructurado,
                no markdown frágil.
              </p>
            </div>
          </RevealOnScroll>

          {/* Card chica Streaming */}
          <RevealOnScroll
            delay={200}
            as="article"
            className="bento-card spotlight-card flex flex-col justify-between rounded-[20px] border border-white/10 bg-white/5 p-6 ring-1 ring-white/5 backdrop-blur"
          >
            <span aria-hidden className="text-3xl">⚡</span>
            <div className="mt-4">
              <h3
                className="text-lg font-bold"
                style={{
                  fontFamily: 'var(--font-display)',
                  letterSpacing: '-0.02em',
                }}
              >
                Streaming en vivo
              </h3>
              <p className="mt-2 text-sm text-white/75" style={{ lineHeight: 1.6 }}>
                Ves la guía generándose token a token. Sin spinner ciego — magia
                visible.
              </p>
            </div>
          </RevealOnScroll>

          {/* Card chica PPI */}
          <RevealOnScroll
            delay={300}
            as="article"
            className="bento-card spotlight-card flex flex-col justify-between rounded-[20px] border border-white/10 bg-white/5 p-6 ring-1 ring-white/5 backdrop-blur"
          >
            <span aria-hidden className="text-3xl">📋</span>
            <div className="mt-4">
              <h3
                className="text-lg font-bold"
                style={{
                  fontFamily: 'var(--font-display)',
                  letterSpacing: '-0.02em',
                }}
              >
                PPI completo
              </h3>
              <p className="mt-2 text-sm text-white/75" style={{ lineHeight: 1.6 }}>
                Proyecto Pedagógico Individual editable, regenerable por sección,
                imprimible para firma.
              </p>
            </div>
          </RevealOnScroll>

          {/* Card grande lavanda */}
          <RevealOnScroll
            delay={400}
            as="article"
            className="bento-card spotlight-card md:col-span-2 flex flex-col justify-between rounded-[20px] border border-white/10 bg-gradient-to-br from-[#5b21b6] to-[#A569BD] p-7 ring-1 ring-white/5"
          >
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-[0.08em] text-white/70"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Multimedia integrada
              </p>
              <h3
                className="mt-3 text-2xl font-bold sm:text-3xl"
                style={{
                  fontFamily: 'var(--font-display)',
                  letterSpacing: '-0.025em',
                  lineHeight: 1.15,
                }}
              >
                Imágenes, videos y materiales{' '}
                <span className="opacity-80">listos para usar.</span>
              </h3>
              <p
                className="mt-3 max-w-md text-sm text-white/80"
                style={{ lineHeight: 1.65 }}
              >
                Cada estrategia trae imagen contextual de Pexels/Unsplash, video
                de Canal Encuentro o Pakapaka, y material concreto para imprimir.
              </p>
            </div>
            <div className="mt-6 flex gap-3 text-2xl">
              <span aria-hidden>🖼️</span>
              <span aria-hidden>🎥</span>
              <span aria-hidden>📄</span>
              <span aria-hidden>🖨️</span>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────
// EXAMPLE OUTPUT — preview real de una guía
// ─────────────────────────────────────────────────────────
function ExampleOutput() {
  return (
    <section className="bg-white px-5 py-24 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <RevealOnScroll className="mx-auto max-w-2xl text-center">
          <span
            className="inline-flex items-center gap-2 rounded-full bg-[#D6F0E0] px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-[#27AE60]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            👀 Mirá una guía real
          </span>
          <h2
            className="mt-4 text-3xl font-bold text-[#1F2E3D] sm:text-4xl"
            style={{
              fontFamily: 'var(--font-display)',
              letterSpacing: '-0.025em',
              lineHeight: 1.15,
            }}
          >
            Contenido <span className="gradient-text">usable mañana</span> en
            tu aula
          </h2>
        </RevealOnScroll>

        <RevealOnScroll
          delay={150}
          className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-center"
        >
          <div className="bento-card overflow-hidden rounded-[20px] border border-[#e2e8f0] bg-[#FBF8F2] p-6 shadow-[0_6px_24px_rgba(15,34,64,0.08)] sm:p-8">
            <p
              className="mb-1 text-xs font-semibold uppercase tracking-[0.08em] text-[#27AE60]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Guía generada
            </p>
            <h3
              className="text-xl font-bold text-[#2E86C1]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Fracciones equivalentes — Matemática, 4° grado
            </h3>
            <p className="text-xs text-[#4A5968]">🧩 TEA · ♿ Disc. Motriz</p>

            <div className="mt-5 space-y-5 text-sm text-[#1F2E3D]">
              <div className="rounded-[12px] bg-white p-4">
                <p className="font-semibold text-[#2E86C1]">
                  📚 Contenidos prioritarios
                </p>
                <ul className="mt-2 space-y-1.5 text-xs">
                  <li>
                    <strong>Representación concreta</strong> de 1/2 = 2/4 con
                    tiras de fracciones magnéticas.
                  </li>
                  <li>
                    <strong>Equivalencias simples</strong> antes que abstractas
                    (omitir decimales por ahora).
                  </li>
                </ul>
              </div>

              <div className="rounded-[12px] border-l-[3px] border-[#27AE60] bg-white p-4">
                <p className="font-semibold text-[#2E86C1]">
                  🎯 Estrategias de enseñanza
                </p>
                <ul className="mt-2 space-y-1.5 text-xs">
                  <li>
                    <strong>Anticipación visual</strong>: agenda con pictogramas
                    antes de empezar (clave para el alumno con TEA).
                  </li>
                  <li>
                    <strong>Tiempo extendido</strong>: 1.5x para manipular
                    material. Evitá apurar la respuesta.
                  </li>
                </ul>
              </div>

              <div className="rounded-[12px] bg-[#fef3c7] p-4 text-xs">
                <p className="font-semibold text-[#2E86C1]">
                  💡 Material listo para usar
                </p>
                <p className="mt-1 text-[#4A5968]">
                  Tiras de fracciones imprimibles con velcro — adaptadas para
                  manipulación con baja motricidad fina.
                </p>
              </div>
            </div>
          </div>

          <figure className="flex flex-col gap-4 rounded-[20px] bg-[#fef3c7] p-8 text-[#1F2E3D]">
            <div className="flex items-center gap-3">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-full bg-[#2E86C1] text-xl font-bold text-white"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                M
              </div>
              <div>
                <p
                  className="font-bold text-[#2E86C1]"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  María L.
                </p>
                <p className="text-xs text-[#4A5968]">
                  Docente de primaria · Tucumán
                </p>
              </div>
            </div>
            <blockquote
              className="text-lg leading-snug text-[#1F2E3D] sm:text-xl"
              style={{
                fontFamily: 'var(--font-display)',
                letterSpacing: '-0.015em',
                fontWeight: 600,
              }}
            >
              &ldquo;En 3 minutos tuve la guía que me hubiera llevado toda una
              tarde armar. Y encima, pensada para Joaquín específicamente.&rdquo;
            </blockquote>
            <div className="flex gap-1 text-[#E67E22]">⭐⭐⭐⭐⭐</div>
          </figure>
        </RevealOnScroll>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────
// MÓDULOS — para quién es IncluAI
// ─────────────────────────────────────────────────────────
function ModulosSection() {
  const modulos = [
    {
      icon: '📚',
      tag: 'Docentes',
      title: 'Para el aula',
      desc: 'Planificá clases inclusivas con estrategias DUA, materiales adaptados y evaluaciones diferenciadas.',
      color: '#2E86C1',
      bg: '#D7EAF6',
    },
    {
      icon: '🏠',
      tag: 'Familias',
      title: 'Para casa',
      desc: 'Rutinas concretas, comunicación adaptada y herramientas para acompañar a tu hijo/a en el día a día.',
      color: '#27AE60',
      bg: '#D6F0E0',
    },
    {
      icon: '⚕️',
      tag: 'Profesionales',
      title: 'Para la consulta',
      desc: 'Protocolos clínicos paso a paso, adaptaciones de evaluación y devoluciones para historia clínica.',
      color: '#A569BD',
      bg: '#EDE3F6',
    },
  ];

  return (
    <section className="bg-[#FBF8F2] px-5 py-24 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <RevealOnScroll className="mx-auto max-w-2xl text-center">
          <h2
            className="text-3xl font-bold text-[#1F2E3D] sm:text-4xl"
            style={{
              fontFamily: 'var(--font-display)',
              letterSpacing: '-0.025em',
              lineHeight: 1.15,
            }}
          >
            Tres módulos.{' '}
            <span className="gradient-text">Una sola plataforma.</span>
          </h2>
          <p
            className="mt-4 text-base text-[#4A5968]"
            style={{ lineHeight: 1.65 }}
          >
            Pensado para los tres roles que rodean a un alumno con discapacidad.
          </p>
        </RevealOnScroll>

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
          {modulos.map((m, i) => (
            <RevealOnScroll
              key={m.tag}
              delay={i * 100}
              as="article"
              className="bento-card spotlight-card group relative flex flex-col overflow-hidden rounded-[24px] border border-[#e2e8f0] bg-white p-7"
            >
              <span
                aria-hidden
                className="flex h-14 w-14 items-center justify-center rounded-2xl text-3xl"
                style={{ background: m.bg }}
              >
                {m.icon}
              </span>
              <p
                className="mt-5 text-xs font-semibold uppercase tracking-[0.08em]"
                style={{ fontFamily: 'var(--font-display)', color: m.color }}
              >
                {m.tag}
              </p>
              <h3
                className="mt-2 text-2xl font-bold text-[#1F2E3D]"
                style={{
                  fontFamily: 'var(--font-display)',
                  letterSpacing: '-0.02em',
                }}
              >
                {m.title}
              </h3>
              <p
                className="mt-3 text-sm text-[#4A5968]"
                style={{ lineHeight: 1.65 }}
              >
                {m.desc}
              </p>
              <div className="mt-6 flex items-center gap-2 text-sm font-semibold opacity-0 transition group-hover:opacity-100" style={{ color: m.color }}>
                Conocé más <span aria-hidden>→</span>
              </div>
            </RevealOnScroll>
          ))}
        </div>

        <RevealOnScroll
          delay={300}
          className="mt-14 overflow-hidden rounded-[24px] shadow-lg"
        >
          <Image
            src={PHOTOS.classroom}
            alt="Aula inclusiva con alumnos diversos trabajando juntos"
            width={1600}
            height={600}
            sizes="(max-width: 1024px) 100vw, 1200px"
            loading="lazy"
            className="h-[260px] w-full object-cover sm:h-[340px]"
          />
        </RevealOnScroll>

        {/* Discapacidades cubiertas */}
        <RevealOnScroll className="mt-12">
          <p
            className="mb-5 text-center text-xs font-semibold uppercase tracking-[0.08em] text-[#4A5968]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Cubrimos todas las discapacidades
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {DISCAPACIDADES.slice(0, 12).map((d) => (
              <span
                key={d.id}
                className="bento-card inline-flex items-center gap-1.5 rounded-full border border-[#e2e8f0] bg-white px-4 py-2 text-sm font-medium text-[#1F2E3D]"
              >
                <span aria-hidden>{d.icon}</span>
                {d.label}
              </span>
            ))}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────
// PRICING — 4 planes con bento-card
// ─────────────────────────────────────────────────────────
function Pricing() {
  return (
    <section id="pricing" className="bg-white px-5 py-24 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <RevealOnScroll className="mx-auto max-w-2xl text-center">
          <span
            className="inline-flex items-center gap-2 rounded-full bg-[#fef3c7] px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-[#92400e]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            💎 Planes
          </span>
          <h2
            className="mt-4 text-3xl font-bold text-[#1F2E3D] sm:text-4xl"
            style={{
              fontFamily: 'var(--font-display)',
              letterSpacing: '-0.025em',
              lineHeight: 1.15,
            }}
          >
            Empezá gratis.{' '}
            <span className="gradient-text">Escalá cuando lo necesites.</span>
          </h2>
        </RevealOnScroll>

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          <PricingCard
            tier="Para empezar"
            price="$0"
            period="gratuito"
            description="Para conocer la herramienta"
            features={[
              '1 guía por mes',
              'Guía guardada para siempre',
              'Todas las discapacidades',
              'IA avanzada (estándar)',
            ]}
            cta={{ label: 'Empezar gratis', href: '/registro', variant: 'outline' }}
            delay={0}
          />
          <PricingCard
            tier="Básico"
            price={`$${LIMITES_PLAN.basico.precio_ars.toLocaleString('es-AR')}`}
            period="/mes"
            description="Para docentes que recién arrancan"
            features={[
              '20 guías por mes',
              '2 PPIs por ciclo',
              'Historial + PDF',
              'IA avanzada (estándar)',
            ]}
            cta={{ label: 'Suscribirme', href: '/registro', variant: 'outline' }}
            delay={100}
          />
          <PricingCard
            tier="Profesional"
            price={`$${LIMITES_PLAN.profesional.precio_ars.toLocaleString('es-AR')}`}
            period="/mes"
            description="El más elegido"
            highlighted
            badge="Más elegido"
            features={[
              '40 guías por mes',
              '3 PPIs por ciclo',
              'Historial + PDF',
              'Guías favoritas',
              'Soporte prioritario',
            ]}
            cta={{ label: 'Suscribirme', href: '/registro', variant: 'filled' }}
            delay={200}
          />
          <PricingCard
            tier="Premium"
            price={`$${LIMITES_PLAN.premium.precio_ars.toLocaleString('es-AR')}`}
            period="/mes"
            description="Máxima potencia de IA"
            badge="IA Premium"
            badgeTone="gold"
            features={[
              '10 guías de máxima profundidad',
              '5 PPIs por ciclo',
              'IA Opus 4.7 — máxima potencia',
              'Historial + PDF',
              'Soporte premium',
            ]}
            cta={{ label: 'Suscribirme', href: '/registro', variant: 'outline' }}
            delay={300}
          />
        </div>
      </div>
    </section>
  );
}

function PricingCard({
  tier,
  price,
  period,
  description,
  features,
  cta,
  highlighted = false,
  badge,
  badgeTone = 'orange',
  delay = 0,
}: {
  tier: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: { label: string; href: string; variant: 'outline' | 'filled' };
  highlighted?: boolean;
  badge?: string;
  badgeTone?: 'orange' | 'gold';
  delay?: number;
}) {
  const isHighlighted = highlighted;
  return (
    <RevealOnScroll
      delay={delay}
      as="article"
      className={
        isHighlighted
          ? 'bento-card relative flex flex-col rounded-[20px] border-2 border-[#2E86C1] bg-gradient-to-br from-[#2E86C1] to-[#1F5F8A] p-6 text-white shadow-[0_16px_48px_rgba(46,134,193,0.35)]'
          : 'bento-card relative flex flex-col rounded-[20px] border border-[#e2e8f0] bg-white p-6 shadow-[0_2px_12px_rgba(15,34,64,0.05)]'
      }
    >
      {badge && (
        <span
          className={`absolute -top-3 right-6 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.06em] text-white ${
            badgeTone === 'gold' ? 'bg-[#b45309]' : 'bg-[#E67E22]'
          }`}
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {badge}
        </span>
      )}
      <p
        className={`text-xs font-semibold uppercase tracking-[0.08em] ${
          isHighlighted ? 'text-[#D6F0E0]' : 'text-[#4A5968]'
        }`}
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {tier}
      </p>
      <p
        className={`mt-3 text-4xl font-extrabold ${
          isHighlighted ? 'text-white' : 'text-[#2E86C1]'
        }`}
        style={{
          fontFamily: 'var(--font-display)',
          letterSpacing: '-0.03em',
        }}
      >
        {price}
        <span
          className={`text-base font-normal ${
            isHighlighted ? 'text-white/75' : 'text-[#4A5968]'
          }`}
        >
          {period}
        </span>
      </p>
      <p
        className={`text-sm ${isHighlighted ? 'text-white/75' : 'text-[#4A5968]'}`}
      >
        {description}
      </p>
      <ul className="mt-5 flex flex-1 flex-col gap-2 text-sm">
        {features.map((f) => (
          <Check key={f} light={isHighlighted}>
            {f}
          </Check>
        ))}
      </ul>
      <Link
        href={cta.href}
        className={
          cta.variant === 'filled'
            ? 'magnetic-btn mt-6 inline-flex items-center justify-center gap-2 rounded-[12px] bg-[#27AE60] py-3 text-sm font-bold text-white shadow-[0_8px_24px_rgba(39,174,96,0.45)]'
            : isHighlighted
              ? 'mt-6 inline-flex items-center justify-center rounded-[12px] border-2 border-white bg-transparent py-3 text-sm font-bold text-white transition hover:bg-white/10'
              : 'mt-6 inline-flex items-center justify-center rounded-[12px] border-2 border-[#2E86C1] bg-white py-3 text-sm font-bold text-[#2E86C1] transition hover:bg-[#2E86C1] hover:text-white'
        }
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {cta.label}
      </Link>
    </RevealOnScroll>
  );
}

function Check({
  children,
  light = false,
}: {
  children: React.ReactNode;
  light?: boolean;
}) {
  return (
    <li className="flex items-start gap-2">
      <span
        aria-hidden
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
          light ? 'bg-[#27AE60] text-white' : 'bg-[#D6F0E0] text-[#27AE60]'
        }`}
      >
        ✓
      </span>
      <span className={light ? 'text-white/95' : 'text-[#1F2E3D]'}>{children}</span>
    </li>
  );
}

// ─────────────────────────────────────────────────────────
// CIERRE EMOCIONAL
// ─────────────────────────────────────────────────────────
function EmotionalClose() {
  return (
    <section className="relative overflow-hidden">
      <Image
        src={PHOTOS.closeup}
        alt="Alumna mostrando orgullosa su trabajo en el aula"
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
      <RevealOnScroll className="relative mx-auto flex max-w-4xl flex-col items-center gap-7 px-5 py-28 text-center text-white sm:px-8 sm:py-36">
        <span
          className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-[#D6F0E0] backdrop-blur"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Nuestra convicción
        </span>
        <h2
          className="text-4xl font-extrabold leading-[1.05] drop-shadow sm:text-5xl lg:text-6xl"
          style={{
            fontFamily: 'var(--font-display)',
            letterSpacing: '-0.035em',
          }}
        >
          Porque incluir no es un extra.{' '}
          <span className="gradient-text">Es el punto de partida.</span>
        </h2>
        <p
          className="max-w-2xl text-base text-white/85 sm:text-lg"
          style={{ lineHeight: 1.65 }}
        >
          Cada docente que planifica pensando en todos sus alumnos transforma un
          aula. Sumate a la comunidad que está haciendo inclusión real en
          Argentina.
        </p>
        <Link
          href="/registro"
          className="magnetic-btn inline-flex items-center justify-center gap-2 rounded-[14px] bg-[#27AE60] px-8 py-4 text-base font-bold text-white shadow-[0_12px_40px_rgba(39,174,96,0.55)]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Empezar gratis ahora <span aria-hidden>→</span>
        </Link>
        <p className="text-xs text-white/60">
          Sin tarjeta · 1 guía gratuita al mes · Cancelás cuando quieras
        </p>
      </RevealOnScroll>
    </section>
  );
}

// ─────────────────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-[#0a1a30] pb-[env(safe-area-inset-bottom)] text-white">
      <div className="mx-auto max-w-7xl px-5 pb-20 pt-14 sm:px-8 sm:pb-16 sm:pt-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-8">
          <div className="lg:col-span-2">
            <LogoLockup
              size="lg"
              tone="dark"
              logoVariant="white"
              gradientId="footer-logo"
            />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/75">
              Inteligencia artificial especializada en educación inclusiva.
              Guías pedagógicas concretas, estrategias basadas en evidencia y
              evaluaciones justas — pensadas para cada alumno de Argentina.
            </p>
            <div className="mt-5 flex gap-3">
              <SocialLink
                href="https://instagram.com/inclua.ar"
                label="Instagram"
                icon="📷"
              />
              <SocialLink
                href="https://twitter.com/inclua_ar"
                label="Twitter / X"
                icon="✖"
              />
              <SocialLink
                href="https://linkedin.com/company/inclua"
                label="LinkedIn"
                icon="in"
              />
              <SocialLink
                href="https://youtube.com/@inclua"
                label="YouTube"
                icon="▶"
              />
            </div>
          </div>

          <FooterColumn title="Producto">
            <FooterLink href="/registro">Crear cuenta</FooterLink>
            <FooterLink href="/login">Iniciar sesión</FooterLink>
            <FooterLink href="#pricing">Planes y precios</FooterLink>
            <FooterLink href="/recursos">Recursos</FooterLink>
          </FooterColumn>

          <FooterColumn title="Nosotros">
            <FooterLink href="/sobre-nosotros">Sobre IncluAI</FooterLink>
            <FooterLink href="/mision">Nuestra misión</FooterLink>
            <FooterLink href="/blog">Blog educativo</FooterLink>
            <FooterLink href="/prensa">Prensa</FooterLink>
          </FooterColumn>

          <FooterColumn title="Contacto">
            <li className="text-sm text-white/75">
              <a
                href="mailto:hola@incluai.com.ar"
                className="hover:text-[#27AE60]"
              >
                hola@incluai.com.ar
              </a>
            </li>
            <li className="text-sm text-white/75">
              <a
                href="mailto:soporte@incluai.com.ar"
                className="hover:text-[#27AE60]"
              >
                soporte@incluai.com.ar
              </a>
            </li>
            <li className="text-sm text-white/75">
              <a href="tel:+543834000000" className="hover:text-[#27AE60]">
                +54 383 400 0000
              </a>
            </li>
            <li className="text-sm text-white/75">
              San Fernando del Valle de Catamarca, Argentina
            </li>
          </FooterColumn>
        </div>

        <div className="mt-10 border-t border-white/10 pt-5">
          <div className="flex flex-col gap-4 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-1 sm:flex-row sm:gap-5">
              <span>© 2026 IncluAI. Todos los derechos reservados.</span>
              <span className="hidden sm:inline" aria-hidden>·</span>
              <span>
                Hecho con <span className="text-[#f87171]">❤️</span> en Argentina{' '}
                🇦🇷
              </span>
            </div>
            <nav aria-label="Enlaces legales" className="flex gap-5">
              <Link href="/terminos" className="hover:text-white">
                Términos de uso
              </Link>
              <Link href="/privacidad" className="hover:text-white">
                Privacidad
              </Link>
              <Link href="/cookies" className="hover:text-white">
                Cookies
              </Link>
            </nav>
          </div>
          <p className="mt-4 text-[11px] text-white/75">
            IncluAI es un producto de <strong>Nativos Consultora Digital</strong>{' '}
            · Catamarca, Argentina
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3
        className="text-sm font-bold uppercase tracking-[0.08em] text-white"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {title}
      </h3>
      <ul className="mt-4 flex flex-col gap-2.5">{children}</ul>
    </div>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        className="text-sm text-white/75 transition hover:text-[#27AE60]"
      >
        {children}
      </Link>
    </li>
  );
}

function SocialLink({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm text-white transition hover:bg-[#27AE60]"
    >
      <span aria-hidden>{icon}</span>
    </a>
  );
}

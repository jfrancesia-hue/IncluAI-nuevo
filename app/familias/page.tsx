import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { PHOTOS } from '@/lib/photos';
import { LIMITES_PLAN } from '@/lib/types';
import { LogoLockup } from '@/components/branding/LogoLockup';
import { RevealOnScroll } from '@/components/landing/RevealOnScroll';
import { Footer } from '@/components/landing/Footer';
import { LeadLink } from '@/components/analytics/LeadLink';

export const metadata = {
  title: 'Para familias — Tu hijo puede aprender sin frustrarse',
  description:
    'Acompañá a tu hijo/a con discapacidad en casa: rutinas concretas, comunicación adaptada, materiales para cada edad y diagnóstico. IA pensada para familias argentinas.',
  openGraph: {
    title: 'IncluAI · Tu hijo puede aprender sin frustrarse',
    description:
      'Para familias: la IA que te da herramientas concretas para acompañar el aprendizaje en casa.',
    type: 'website',
    locale: 'es_AR',
  },
};

const REGISTRO_HREF =
  '/registro?utm_source=meta&utm_medium=landing&utm_content=familias&tipo=familia';

export default async function LandingFamilias() {
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
        <Trust />
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
            'linear-gradient(135deg, #0d2a1a 0%, #0f2240 40%, #1e8449 100%)',
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
              'radial-gradient(circle, rgba(39,174,96,0.85), transparent 60%)',
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
              'radial-gradient(circle, rgba(230,126,34,0.55), transparent 60%)',
            animation: 'mesh-orb-3 26s ease-in-out infinite',
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
          gradientId="familias-logo"
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
            PARA FAMILIAS · HECHO EN ARGENTINA
          </span>

          <h1
            className="text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-6xl"
            style={{
              fontFamily: 'var(--font-display)',
              letterSpacing: '-0.035em',
            }}
          >
            Tu hijo puede aprender{' '}
            <span className="gradient-text">sin frustrarse.</span>
          </h1>

          <p
            className="max-w-xl text-base text-white/85 sm:text-lg"
            style={{ lineHeight: 1.65 }}
          >
            Decinos qué edad tiene, qué diagnóstico y qué necesitás trabajar.
            La IA te devuelve rutinas, materiales y formas de comunicar
            adaptados al día a día en casa — no consejos vacíos.
          </p>

          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
            <LeadLink
              href={REGISTRO_HREF}
              leadSource="familias_landing_hero"
              className="magnetic-btn inline-flex items-center justify-center gap-2 rounded-[14px] bg-[#27AE60] px-7 py-4 text-base font-bold text-white shadow-[0_8px_32px_rgba(39,174,96,0.45)]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Empezar gratis ahora
              <span aria-hidden>→</span>
            </LeadLink>
            <p className="text-xs text-white/60">
              Sin tarjeta · 1 plan gratis al mes
            </p>
          </div>

          <dl className="mt-6 grid max-w-md grid-cols-3 gap-6 border-t border-white/10 pt-6">
            <Stat valor="Hoy" label="primera rutina" />
            <Stat valor="Todas" label="discapacidades" />
            <Stat valor="0–18" label="años" />
          </dl>
        </div>

        <div className="relative">
          <div
            className="relative overflow-hidden rounded-[24px] shadow-[0_24px_64px_-12px_rgba(0,0,0,0.6)] ring-1 ring-white/10"
            style={{ transform: 'perspective(1200px) rotateY(-3deg) rotateX(2deg)' }}
          >
            <Image
              src={PHOTOS.wizardFamilia2}
              alt="Madre y su hijo trabajando juntos en casa con materiales adaptados"
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
        className="text-[24px] font-extrabold leading-none text-white sm:text-[28px]"
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
      icon: '😩',
      titulo: 'No sabés cómo explicarle algo',
      desc: 'Le decís y se frustra. Le mostrás y se distrae. Necesitás otra forma de comunicarte y nadie te enseñó cómo.',
    },
    {
      icon: '📚',
      titulo: 'Querés ayudarlo en casa',
      desc: 'La escuela hace su parte, pero querés acompañar la rutina, los hábitos, el aprendizaje cotidiano. Sin ser docente.',
    },
    {
      icon: '🌎',
      titulo: 'Lo que encontrás online no aplica',
      desc: 'Videos en inglés, rutinas que no se adaptan a tu casa, consejos genéricos. Vos necesitás algo para tu hijo, no para "un niño con TEA".',
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
            Si sos mamá o papá,{' '}
            <span className="gradient-text">esto te suena.</span>
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
      titulo: 'Contanos sobre tu hijo/a',
      desc: 'Edad, diagnóstico (o sospecha) y qué área querés trabajar: comunicación, rutinas, conducta, juego.',
      icon: '👧',
      img: PHOTOS.wizardFamilia1,
    },
    {
      num: '02',
      titulo: 'La IA arma tu plan',
      desc: 'En segundos: rutinas concretas, frases para comunicar, juegos para esa edad, qué evitar y qué reforzar.',
      icon: '✨',
      img: PHOTOS.wizardFamilia2,
    },
    {
      num: '03',
      titulo: 'Aplicalo desde hoy',
      desc: 'Pensado para implementar con lo que tenés en casa. Sin material caro, sin app extra. Solo vos y tu hijo.',
      icon: '❤️',
      img: PHOTOS.wizardFamilia3,
    },
  ];
  return (
    <section className="bg-[#FBF8F2] px-5 py-24 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <RevealOnScroll className="mx-auto max-w-2xl text-center">
          <span
            className="inline-flex items-center gap-2 rounded-full bg-[#D6F0E0] px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-[#27AE60]"
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
            De una pregunta a un plan,{' '}
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

function Trust() {
  return (
    <section className="bg-white px-5 py-20 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <RevealOnScroll className="rounded-[24px] border border-[#e2e8f0] bg-[#FBF8F2] p-8 text-center sm:p-10">
          <span aria-hidden className="text-3xl">
            🔒
          </span>
          <h2
            className="mt-4 text-2xl font-bold sm:text-3xl"
            style={{
              fontFamily: 'var(--font-display)',
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
            }}
          >
            Tu hijo no es un dato.
          </h2>
          <p
            className="mt-4 text-sm text-[#4A5968] sm:text-base"
            style={{ lineHeight: 1.7 }}
          >
            Nunca te pedimos el nombre completo de tu hijo/a. Trabajamos con
            iniciales o pseudónimos. Cumplimos la <strong>Ley 25.326</strong>{' '}
            de Protección de Datos Personales y nunca compartimos información
            con terceros.
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
            Un plan gratis al mes para conocer la herramienta. Cuando te
            sirva, planes desde{' '}
            <strong>
              ${LIMITES_PLAN.basico.precio_ars.toLocaleString('es-AR')}/mes
            </strong>{' '}
            con 20 planes mensuales y exportación a PDF para imprimir o
            compartir con la terapeuta.
          </p>
          <Link
            href="/#pricing"
            className="mt-6 inline-flex text-sm font-semibold text-[#27AE60] hover:underline"
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
        src={PHOTOS.wizardFamilia3}
        alt=""
        width={1600}
        height={900}
        sizes="100vw"
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-[#0d2a1a]/80 via-[#0f2240]/85 to-[#0f2240]/95"
      />
      <RevealOnScroll className="relative mx-auto flex max-w-4xl flex-col items-center gap-7 px-5 py-24 text-center text-white sm:px-8 sm:py-32">
        <h2
          className="text-4xl font-extrabold leading-[1.05] sm:text-5xl"
          style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.035em' }}
        >
          Mañana podés empezar{' '}
          <span className="gradient-text">una rutina nueva.</span>
        </h2>
        <p
          className="max-w-2xl text-base text-white/85 sm:text-lg"
          style={{ lineHeight: 1.65 }}
        >
          Sin promesas mágicas. Solo herramientas concretas, hechas para tu
          hijo y tu casa.
        </p>
        <LeadLink
          href={REGISTRO_HREF}
          leadSource="familias_landing_close"
          className="magnetic-btn inline-flex items-center justify-center gap-2 rounded-[14px] bg-[#27AE60] px-8 py-4 text-base font-bold text-white shadow-[0_12px_40px_rgba(39,174,96,0.55)]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Empezar gratis ahora <span aria-hidden>→</span>
        </LeadLink>
        <p className="text-xs text-white/60">
          Sin tarjeta · 1 plan gratuito al mes · Cancelás cuando quieras
        </p>
      </RevealOnScroll>
    </section>
  );
}

import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { DISCAPACIDADES } from '@/data/discapacidades';
import { LIMITES_PLAN } from '@/lib/types';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'IncluIA — Planificá clases inclusivas en minutos',
};

export default async function LandingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect('/inicio');

  return (
    <div className="flex min-h-screen flex-1 flex-col">
      <Hero />
      <HowItWorks />
      <DisabilitiesGrid />
      <Pricing />
      <Footer />
    </div>
  );
}

function Navbar() {
  return (
    <div className="flex items-center justify-between px-4 py-4 sm:px-8">
      <span className="font-serif text-xl font-bold text-white">🧩 IncluIA</span>
      <Link
        href="/login"
        className="rounded-[10px] border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/20"
      >
        Iniciar sesión
      </Link>
    </div>
  );
}

function Hero() {
  return (
    <section
      className="relative overflow-hidden text-white"
      style={{
        background:
          'radial-gradient(circle at 20% 20%, rgba(22,163,74,0.25), transparent 45%), linear-gradient(135deg, #0f2240 0%, #1e3a5f 55%, #11487a 100%)',
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}
      />
      <Navbar />
      <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-6 px-4 py-20 text-center sm:py-28">
        <span className="inline-flex items-center gap-2 rounded-full bg-accent/20 px-3 py-1 text-sm font-medium text-accent-light">
          🇦🇷 Para docentes de toda Argentina
        </span>
        <h1 className="max-w-3xl font-serif text-4xl font-extrabold leading-tight sm:text-6xl">
          Planificá clases inclusivas en minutos
        </h1>
        <p className="max-w-2xl text-base text-white/80 sm:text-lg">
          Inteligencia artificial especializada en educación inclusiva. Guías
          concretas y personalizadas para cada alumno, cada discapacidad, cada
          contenido.
        </p>
        <div className="mt-2 flex flex-col items-center gap-2 sm:flex-row sm:gap-3">
          <Button asChild size="lg" className="h-12 px-8 text-base">
            <Link href="/registro">Crear mi primera guía — gratis</Link>
          </Button>
        </div>
        <p className="text-sm text-white/70">
          2 guías gratuitas por mes · Sin tarjeta de crédito
        </p>
      </div>
    </section>
  );
}

function HowItWorks() {
  const pasos = [
    {
      step: '01',
      icon: '📝',
      title: 'Completá el formulario',
      desc: 'Indicá nivel, materia, contenido y discapacidad del alumno.',
    },
    {
      step: '02',
      icon: '🤖',
      title: 'La IA genera tu guía',
      desc: 'Recibís estrategias concretas basadas en DUA y normativa argentina.',
    },
    {
      step: '03',
      icon: '🎯',
      title: 'Aplicalo en el aula',
      desc: 'Adecuación curricular, materiales y evaluación listos para usar mañana.',
    },
  ];

  return (
    <section className="bg-card px-4 py-20 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center font-serif text-3xl font-bold text-primary sm:text-4xl">
          Así de simple funciona
        </h2>
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {pasos.map((p) => (
            <div
              key={p.step}
              className="rounded-[14px] border border-border bg-background p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
            >
              <p className="text-xs font-bold uppercase tracking-widest text-accent">
                Paso {p.step}
              </p>
              <p className="mt-3 text-3xl" aria-hidden>
                {p.icon}
              </p>
              <h3 className="mt-2 font-serif text-xl font-bold text-primary">
                {p.title}
              </h3>
              <p className="mt-2 text-sm text-muted">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DisabilitiesGrid() {
  return (
    <section className="bg-primary-bg px-4 py-20 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center font-serif text-3xl font-bold text-primary sm:text-4xl">
          Guías para todas las discapacidades
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-muted">
          Cada guía se adapta a la realidad de tu aula y a la discapacidad
          específica del alumno.
        </p>
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {DISCAPACIDADES.map((d) => (
            <div
              key={d.id}
              className="flex items-center gap-3 rounded-[12px] border border-border bg-card px-3 py-3 text-sm text-primary"
            >
              <span className="text-2xl" aria-hidden>
                {d.icon}
              </span>
              <span>{d.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section className="bg-card px-4 py-20 sm:px-8">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-center font-serif text-3xl font-bold text-primary sm:text-4xl">
          Planes
        </h2>
        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="rounded-[14px] border border-border bg-background p-6">
            <p className="text-sm uppercase tracking-wide text-muted">Gratuito</p>
            <p className="mt-2 font-serif text-4xl font-bold text-primary">
              $0<span className="ml-1 text-sm font-normal text-muted">para siempre</span>
            </p>
            <ul className="mt-4 flex flex-col gap-2 text-sm">
              <Feature>2 guías por mes</Feature>
              <Feature>Todos los niveles educativos</Feature>
              <Feature>Todas las discapacidades</Feature>
              <Feature>Copiar texto</Feature>
            </ul>
            <Button asChild variant="outline" size="lg" className="mt-6 w-full">
              <Link href="/registro">Empezar gratis</Link>
            </Button>
          </div>

          <div className="relative rounded-[14px] border border-primary bg-primary p-6 text-white">
            <span className="absolute right-4 top-4 rounded-full bg-cta px-2.5 py-0.5 text-xs font-semibold text-white">
              Más elegido
            </span>
            <p className="text-sm uppercase tracking-wide text-white/75">Profesional</p>
            <p className="mt-2 font-serif text-4xl font-bold">
              ${LIMITES_PLAN.pro.precio_ars.toLocaleString('es-AR')}
              <span className="ml-1 text-sm font-normal text-white/75">/mes</span>
            </p>
            <ul className="mt-4 flex flex-col gap-2 text-sm">
              <Feature light>40 guías por mes</Feature>
              <Feature light>Historial completo y favoritos</Feature>
              <Feature light>Exportar a PDF</Feature>
              <Feature light>Soporte prioritario</Feature>
            </ul>
            <Button asChild size="lg" className="mt-6 w-full">
              <Link href="/registro">Suscribirme con Mercado Pago</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Feature({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <li className="flex items-start gap-2">
      <span className={light ? 'text-white' : 'text-accent'}>✓</span>
      <span className={light ? 'text-white/95' : 'text-foreground'}>{children}</span>
    </li>
  );
}

function Footer() {
  return (
    <footer className="bg-primary-bg px-4 py-10 text-center text-sm text-muted">
      IncluIA — Hecho en Argentina 🇦🇷
    </footer>
  );
}

import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { DISCAPACIDADES } from '@/data/discapacidades';
import { LIMITES_PLAN } from '@/lib/types';
import { PHOTOS } from '@/lib/photos';

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
        <DisabilitiesSection />
        <ExampleOutput />
        <Pricing />
        <EmotionalClose />
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
            'linear-gradient(135deg, #0f2240 0%, #2E86C1 55%, #0e4f68 100%)',
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            'radial-gradient(ellipse at 20% 30%, rgba(22,163,74,0.6), transparent 50%), radial-gradient(ellipse at 80% 70%, rgba(234,88,12,0.4), transparent 50%)',
        }}
      />
      <nav aria-label="Barra superior" className="relative mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
        <div className="flex items-center gap-2">
          <span aria-hidden className="text-2xl">🧩</span>
          <span className="font-serif text-xl font-bold text-white">IncluAI</span>
        </div>
        <Link
          href="/login"
          className="rounded-[10px] border border-white/25 bg-white/5 px-4 py-2 text-sm font-medium text-white backdrop-blur transition hover:bg-white/15"
        >
          Iniciar sesión
        </Link>
      </nav>

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-5 pb-20 pt-8 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:pb-24 lg:pt-12">
        <div className="flex flex-col gap-5 text-white">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#27AE60]/25 px-3 py-1 text-xs font-semibold text-[#D6F0E0] backdrop-blur">
            🇦🇷 Para docentes de toda Argentina
          </span>
          <h1 className="font-serif text-4xl font-extrabold leading-[1.1] sm:text-5xl lg:text-6xl">
            Cada alumno merece una clase{' '}
            <span className="text-[#27AE60]">pensada para él</span>
          </h1>
          <p className="max-w-xl text-base text-white/85 sm:text-lg">
            Inteligencia artificial que te ayuda a planificar clases concretas e
            inclusivas. Estrategias reales, materiales adaptados y evaluaciones
            justas — en minutos.
          </p>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/registro"
              className="inline-flex items-center justify-center rounded-[12px] bg-[#27AE60] px-7 py-4 text-base font-bold text-white shadow-[0_6px_20px_rgba(22,163,74,0.45)] transition hover:bg-[#27AE60] hover:shadow-[0_8px_24px_rgba(22,163,74,0.6)]"
            >
              Crear mi primera guía — gratis
            </Link>
          </div>
          <p className="text-xs text-white/70">
            2 guías gratuitas por mes · Sin tarjeta · 30 segundos para empezar
          </p>
        </div>

        <div className="relative">
          <div className="relative overflow-hidden rounded-[24px] shadow-2xl ring-1 ring-white/10">
            <Image
              src={PHOTOS.hero}
              alt="Docente trabajando junto a alumno en un aula inclusiva argentina"
              width={1600}
              height={1100}
              priority
              sizes="(max-width: 1024px) 100vw, 720px"
              className="h-[380px] w-full object-cover sm:h-[440px] lg:h-[500px]"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-tr from-[#2E86C1]/30 via-transparent to-transparent"
            />
          </div>
          <div className="absolute -bottom-5 -left-4 hidden rounded-[16px] bg-white px-4 py-3 shadow-lg sm:flex sm:items-center sm:gap-3 lg:-left-6">
            <span aria-hidden className="text-2xl">💚</span>
            <div>
              <p className="text-xs text-[#4A5968]">Cada guía</p>
              <p className="font-serif text-sm font-bold text-[#2E86C1]">
                Pensada, no genérica
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SocialProof() {
  const provincias = [
    'Buenos Aires',
    'Catamarca',
    'Córdoba',
    'Mendoza',
    'Salta',
    'Tucumán',
    'Santa Fe',
    'Misiones',
  ];
  return (
    <section className="border-y border-[#e2e8f0] bg-white px-5 py-8 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 text-center">
        <p className="font-serif text-base font-semibold text-[#2E86C1] sm:text-lg">
          Más de <span className="text-[#27AE60]">500 docentes</span> ya crean
          guías inclusivas con IncluAI
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-[#4A5968]">
          {provincias.map((p) => (
            <span key={p} className="inline-flex items-center gap-1">
              <span aria-hidden>📍</span> {p}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const pasos = [
    {
      num: '01',
      titulo: 'Contanos tu clase',
      desc: 'Seleccioná el nivel, la materia, el contenido que vas a enseñar y la discapacidad de tu alumno/a.',
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
      titulo: 'Aplicalo mañana en el aula',
      desc: 'Todo pensado para implementar con los recursos que ya tenés. Copiá, imprimí o guardá tus guías.',
      icon: '🎯',
      img: PHOTOS.step3,
    },
  ];
  return (
    <section className="bg-gradient-to-b from-[#FBF8F2] to-white px-5 py-20 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-3xl font-bold text-[#2E86C1] sm:text-4xl">
            Así de simple: de tu aula a una guía inclusiva
          </h2>
          <p className="mt-4 text-base text-[#4A5968]">
            Tres pasos pensados para una docente con tiempo limitado y ganas
            reales de incluir.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {pasos.map((p) => (
            <article
              key={p.num}
              className="group relative flex flex-col overflow-hidden rounded-[20px] border-t-[3px] border-[#27AE60] bg-white shadow-[0_4px_20px_rgba(15,34,64,0.06)] transition hover:shadow-[0_8px_28px_rgba(15,34,64,0.1)]"
            >
              <div className="relative h-44 overflow-hidden">
                <Image
                  src={p.img}
                  alt=""
                  width={600}
                  height={400}
                  className="h-full w-full object-cover transition group-hover:scale-105"
                />
                <span
                  aria-hidden
                  className="absolute left-4 top-4 flex h-12 w-12 items-center justify-center rounded-full bg-white text-2xl shadow-md"
                >
                  {p.icon}
                </span>
              </div>
              <div className="flex flex-col gap-3 p-6">
                <p className="font-serif text-3xl font-extrabold text-[#27AE60]">
                  {p.num}
                </p>
                <h3 className="font-serif text-xl font-bold text-[#2E86C1]">
                  {p.titulo}
                </h3>
                <p className="text-sm leading-relaxed text-[#4A5968]">
                  {p.desc}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function DisabilitiesSection() {
  return (
    <section className="relative overflow-hidden bg-[#D7EAF6] px-5 py-20 sm:px-8">
      <div
        aria-hidden
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(circle at 15% 15%, rgba(22,163,74,0.12), transparent 40%), radial-gradient(circle at 85% 85%, rgba(234,88,12,0.1), transparent 40%)',
        }}
      />
      <div className="relative mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-3xl font-bold text-[#2E86C1] sm:text-4xl">
            Guías especializadas para cada necesidad
          </h2>
          <p className="mt-4 text-base text-[#4A5968]">
            Estrategias basadas en evidencia, adaptadas al contenido que vos
            elegís.
          </p>
        </div>

        <div className="mt-10 overflow-hidden rounded-[24px] shadow-lg">
          <Image
            src={PHOTOS.classroom}
            alt="Aula inclusiva con alumnos diversos trabajando juntos"
            width={1600}
            height={600}
            sizes="(max-width: 1024px) 100vw, 1200px"
            loading="lazy"
            className="h-[220px] w-full object-cover sm:h-[300px]"
          />
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {DISCAPACIDADES.slice(0, 12).map((d) => (
            <article
              key={d.id}
              className="group flex min-h-[128px] flex-col gap-2 rounded-[16px] border border-transparent bg-white p-4 shadow-[0_2px_8px_rgba(15,34,64,0.05)] transition hover:-translate-y-1 hover:border-[#27AE60] hover:shadow-[0_8px_20px_rgba(22,163,74,0.15)]"
            >
              <span aria-hidden className="text-3xl">
                {d.icon}
              </span>
              <p className="text-sm font-bold leading-tight text-[#2E86C1]">
                {d.label}
              </p>
              <p className="text-[11px] leading-snug text-[#4A5968]">
                {d.estrategias_clave?.slice(0, 2).join(' · ')}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ExampleOutput() {
  return (
    <section className="bg-white px-5 py-20 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-3xl font-bold text-[#2E86C1] sm:text-4xl">
            Mirá una guía real generada por IncluAI
          </h2>
          <p className="mt-4 text-base text-[#4A5968]">
            Contenido concreto, usable mañana en tu aula.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-center">
          <div className="overflow-hidden rounded-[20px] border border-[#e2e8f0] bg-[#FBF8F2] p-6 shadow-[0_6px_24px_rgba(15,34,64,0.08)] sm:p-8">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#27AE60]">
              Guía generada
            </p>
            <h3 className="font-serif text-xl font-bold text-[#2E86C1]">
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
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#2E86C1] font-serif text-xl font-bold text-white">
                M
              </div>
              <div>
                <p className="font-serif font-bold text-[#2E86C1]">María L.</p>
                <p className="text-xs text-[#4A5968]">
                  Docente de primaria · Tucumán
                </p>
              </div>
            </div>
            <blockquote className="font-serif text-lg leading-snug text-[#1F2E3D] sm:text-xl">
              &ldquo;En 3 minutos tuve la guía que me hubiera llevado toda una
              tarde armar. Y encima, pensada para Joaquín específicamente.&rdquo;
            </blockquote>
            <div className="flex gap-1 text-[#E67E22]">⭐⭐⭐⭐⭐</div>
          </figure>
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section className="bg-[#FBF8F2] px-5 py-20 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-3xl font-bold text-[#2E86C1] sm:text-4xl">
            Un plan para cada docente
          </h2>
          <p className="mt-4 text-base text-[#4A5968]">
            Empezá gratis. Mejorá cuando quieras.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2">
          <article className="flex flex-col rounded-[20px] border border-[#e2e8f0] bg-white p-7 shadow-[0_2px_12px_rgba(15,34,64,0.05)]">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#4A5968]">
              Para empezar
            </p>
            <p className="mt-3 font-serif text-5xl font-extrabold text-[#2E86C1]">
              $0
            </p>
            <p className="text-sm text-[#4A5968]">Gratuito, siempre</p>
            <ul className="mt-6 space-y-2.5 text-sm">
              <Check>2 guías por mes</Check>
              <Check>Todos los niveles educativos</Check>
              <Check>Todas las discapacidades</Check>
              <Check>Copiar y compartir</Check>
            </ul>
            <Link
              href="/registro"
              className="mt-7 inline-flex items-center justify-center rounded-[12px] border-2 border-[#2E86C1] bg-white py-3 text-sm font-bold text-[#2E86C1] transition hover:bg-[#2E86C1] hover:text-white"
            >
              Empezar gratis
            </Link>
          </article>

          <article className="relative flex flex-col rounded-[20px] border-2 border-[#2E86C1] bg-[#2E86C1] p-7 text-white shadow-[0_8px_32px_rgba(15,34,64,0.2)]">
            <span className="absolute -top-3 right-6 rounded-full bg-[#E67E22] px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
              Más elegido
            </span>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#D6F0E0]">
              Para docentes comprometidos
            </p>
            <p className="mt-3 font-serif text-5xl font-extrabold">
              ${LIMITES_PLAN.pro.precio_ars.toLocaleString('es-AR')}
              <span className="text-lg font-normal text-white/75">/mes</span>
            </p>
            <p className="text-sm text-white/75">
              Menos que un café por día en tus alumnos
            </p>
            <ul className="mt-6 space-y-2.5 text-sm">
              <Check light>40 guías por mes</Check>
              <Check light>Historial completo</Check>
              <Check light>Exportar a PDF</Check>
              <Check light>Guías favoritas</Check>
              <Check light>Soporte prioritario</Check>
            </ul>
            <Link
              href="/registro"
              className="mt-7 inline-flex items-center justify-center gap-2 rounded-[12px] bg-[#27AE60] py-3 text-sm font-bold text-white shadow-[0_4px_14px_rgba(22,163,74,0.4)] transition hover:bg-[#27AE60]"
            >
              <span aria-hidden>🧩</span> Suscribirme con Mercado Pago
            </Link>
          </article>
        </div>
      </div>
    </section>
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
      <span className={light ? 'text-white/95' : 'text-[#1F2E3D]'}>
        {children}
      </span>
    </li>
  );
}

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
      <div className="relative mx-auto flex max-w-4xl flex-col items-center gap-7 px-5 py-24 text-center text-white sm:px-8 sm:py-32">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold text-[#D6F0E0] backdrop-blur">
          Nuestra convicción
        </span>
        <h2 className="font-serif text-4xl font-extrabold leading-[1.15] drop-shadow sm:text-5xl lg:text-6xl">
          Porque incluir no es un extra.{' '}
          <span className="text-[#27AE60]">Es el punto de partida.</span>
        </h2>
        <p className="max-w-2xl text-base text-white/85 sm:text-lg">
          Cada docente que planifica pensando en todos sus alumnos transforma un
          aula. Sumate a la comunidad que está haciendo inclusión real en
          Argentina.
        </p>
        <Link
          href="/registro"
          className="inline-flex items-center justify-center gap-2 rounded-[12px] bg-[#27AE60] px-8 py-4 text-base font-bold text-white shadow-[0_6px_20px_rgba(22,163,74,0.5)] transition hover:bg-[#27AE60]"
        >
          Empezar gratis ahora <span aria-hidden>→</span>
        </Link>
        <p className="text-xs text-white/60">
          Sin tarjeta · 2 guías gratuitas al mes · Cancelás cuando quieras
        </p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-[#0a1a30] pb-[env(safe-area-inset-bottom)] text-white">
      <div className="mx-auto max-w-7xl px-5 pb-20 pt-14 sm:px-8 sm:pb-16 sm:pt-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2">
              <span aria-hidden className="text-3xl">🧩</span>
              <span className="font-serif text-2xl font-bold">IncluAI</span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/75">
              Inteligencia artificial especializada en educación inclusiva. Guías
              pedagógicas concretas, estrategias basadas en evidencia y
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
      <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-white">
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

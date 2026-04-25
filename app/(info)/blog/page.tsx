import Link from 'next/link';
import { RevealOnScroll } from '@/components/landing/RevealOnScroll';

export const metadata = {
  title: 'Blog · IncluAI',
  description:
    'Próximamente: artículos sobre educación inclusiva, normativa argentina, casos prácticos y guías para docentes.',
};

export default function BlogPage() {
  return (
    <article>
      <RevealOnScroll>
        <span
          className="inline-flex items-center gap-2 rounded-full bg-[#fef3c7] px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-[#92400e]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          📝 Blog · Próximamente
        </span>
        <h1
          className="mt-5 text-4xl font-extrabold leading-[1.05] text-[#1F2E3D] sm:text-5xl"
          style={{
            fontFamily: 'var(--font-display)',
            letterSpacing: '-0.035em',
          }}
        >
          Artículos para docentes,{' '}
          <span className="gradient-text">familias y profesionales.</span>
        </h1>
        <p
          className="mt-5 text-lg text-[#3d4a5a]"
          style={{ lineHeight: 1.7 }}
        >
          Estamos preparando contenido propio sobre educación inclusiva,
          normativa argentina aplicada y casos reales del aula. Lanzamos
          en las próximas semanas.
        </p>
      </RevealOnScroll>

      <RevealOnScroll delay={120}>
        <section className="mt-14">
          <h2
            className="text-2xl font-bold text-[#1F2E3D]"
            style={{
              fontFamily: 'var(--font-display)',
              letterSpacing: '-0.025em',
            }}
          >
            Lo que vas a encontrar acá
          </h2>
          <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <li className="bento-card rounded-[16px] border border-[#e2e8f0] bg-white p-5">
              <p
                className="text-base font-bold text-[#1F2E3D]"
                style={{
                  fontFamily: 'var(--font-display)',
                  letterSpacing: '-0.01em',
                }}
              >
                📖 Guías prácticas
              </p>
              <p
                className="mt-2 text-sm text-[#3d4a5a]"
                style={{ lineHeight: 1.6 }}
              >
                «Cómo planificar una clase de matemática con un alumno con
                TEA», «Estrategias para discapacidad motriz en educación
                física», etc.
              </p>
            </li>
            <li className="bento-card rounded-[16px] border border-[#e2e8f0] bg-white p-5">
              <p
                className="text-base font-bold text-[#1F2E3D]"
                style={{
                  fontFamily: 'var(--font-display)',
                  letterSpacing: '-0.01em',
                }}
              >
                ⚖️ Normativa explicada
              </p>
              <p
                className="mt-2 text-sm text-[#3d4a5a]"
                style={{ lineHeight: 1.6 }}
              >
                CFE 311/16 sin tecnicismos, Ley 27.306 aplicada al aula,
                novedades de cada provincia. Lo que pasa, en lenguaje claro.
              </p>
            </li>
            <li className="bento-card rounded-[16px] border border-[#e2e8f0] bg-white p-5">
              <p
                className="text-base font-bold text-[#1F2E3D]"
                style={{
                  fontFamily: 'var(--font-display)',
                  letterSpacing: '-0.01em',
                }}
              >
                💬 Casos reales
              </p>
              <p
                className="mt-2 text-sm text-[#3d4a5a]"
                style={{ lineHeight: 1.6 }}
              >
                Entrevistas con docentes que comparten qué les funcionó. Sin
                edulcorar, con problemas reales y soluciones reales.
              </p>
            </li>
            <li className="bento-card rounded-[16px] border border-[#e2e8f0] bg-white p-5">
              <p
                className="text-base font-bold text-[#1F2E3D]"
                style={{
                  fontFamily: 'var(--font-display)',
                  letterSpacing: '-0.01em',
                }}
              >
                🏠 Recursos para familias
              </p>
              <p
                className="mt-2 text-sm text-[#3d4a5a]"
                style={{ lineHeight: 1.6 }}
              >
                Trámites, derechos, prestaciones, cómo elegir escuela inclusiva.
                Lo que la web oficial no explica claramente.
              </p>
            </li>
          </ul>
        </section>
      </RevealOnScroll>

      <RevealOnScroll delay={200}>
        <section className="mt-14 rounded-[20px] border border-[#e2e8f0] bg-gradient-to-br from-[#FBF8F2] to-[#fef3c7]/60 p-8 text-center sm:p-10">
          <p className="text-3xl" aria-hidden>
            ✨
          </p>
          <h2
            className="mt-3 text-2xl font-bold text-[#1F2E3D] sm:text-3xl"
            style={{
              fontFamily: 'var(--font-display)',
              letterSpacing: '-0.025em',
            }}
          >
            ¿Querés que te avisemos?
          </h2>
          <p
            className="mt-3 max-w-md mx-auto text-base text-[#3d4a5a]"
            style={{ lineHeight: 1.65 }}
          >
            Mientras tanto podés crear tu cuenta gratis y al lanzar el blog
            te mandamos los primeros artículos directo a tu mail.
          </p>
          <Link
            href="/registro"
            className="magnetic-btn mt-6 inline-flex items-center gap-2 rounded-[14px] bg-[#27AE60] px-7 py-4 text-base font-bold text-white shadow-[0_12px_32px_rgba(39,174,96,0.45)]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Crear cuenta gratis →
          </Link>
        </section>
      </RevealOnScroll>
    </article>
  );
}

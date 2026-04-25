import Link from 'next/link';
import { RevealOnScroll } from '@/components/landing/RevealOnScroll';

export const metadata = {
  title: 'Nuestra misión · IncluAI',
  description:
    'IncluAI existe para que ningún alumno con discapacidad llegue al aula sin una clase pensada para él. Conocé nuestra misión y compromisos.',
};

export default function MisionPage() {
  return (
    <article>
      <RevealOnScroll>
        <span
          className="inline-flex items-center gap-2 rounded-full bg-[#D7EAF6] px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-[#1F5F8A]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          🎯 Nuestra misión
        </span>
        <h1
          className="mt-5 text-4xl font-extrabold leading-[1.05] text-[#1F2E3D] sm:text-5xl"
          style={{
            fontFamily: 'var(--font-display)',
            letterSpacing: '-0.035em',
          }}
        >
          Que ningún alumno se{' '}
          <span className="gradient-text">quede afuera de su clase.</span>
        </h1>
        <p
          className="mt-5 text-lg text-[#3d4a5a]"
          style={{ lineHeight: 1.7 }}
        >
          En Argentina hay más de <strong>200.000 alumnos</strong> con
          Certificado Único de Discapacidad cursando en escuelas comunes.
          Cada uno merece un docente con tiempo, recursos y formación para
          incluirlo. Esa es la realidad que queremos cambiar.
        </p>
      </RevealOnScroll>

      <RevealOnScroll delay={120}>
        <section className="mt-14 rounded-[24px] bg-gradient-to-br from-[#1F5F8A] via-[#2E86C1] to-[#1F5F8A] p-8 text-white shadow-[0_16px_48px_rgba(46,134,193,0.35)] sm:p-12">
          <p
            className="text-xs font-semibold uppercase tracking-[0.08em] text-white/85"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Lo que creemos
          </p>
          <blockquote
            className="mt-4 text-2xl font-bold leading-[1.2] sm:text-3xl"
            style={{
              fontFamily: 'var(--font-display)',
              letterSpacing: '-0.02em',
            }}
          >
            "La inclusión no es un favor que el sistema hace al alumno con
            discapacidad. Es el cumplimiento de un derecho. Y cumplir un
            derecho no debería depender de que el docente saque tiempo de su
            tiempo familiar para hacerlo."
          </blockquote>
        </section>
      </RevealOnScroll>

      <RevealOnScroll delay={200}>
        <section className="mt-14">
          <h2
            className="text-2xl font-bold text-[#1F2E3D] sm:text-3xl"
            style={{
              fontFamily: 'var(--font-display)',
              letterSpacing: '-0.025em',
            }}
          >
            Nuestros compromisos
          </h2>
          <p
            className="mt-3 text-base text-[#3d4a5a]"
            style={{ lineHeight: 1.65 }}
          >
            No son aspiraciones. Son promesas operativas que verificamos en
            cada lanzamiento.
          </p>

          <ol className="mt-8 flex flex-col gap-4">
            <li className="bento-card flex gap-5 rounded-[16px] border border-[#e2e8f0] bg-white p-6 shadow-[0_2px_12px_rgba(15,34,64,0.04)]">
              <span
                aria-hidden
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#27AE60] to-[#0d9448] text-lg font-bold text-white shadow-[0_4px_12px_rgba(39,174,96,0.3)]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                01
              </span>
              <div>
                <h3
                  className="text-lg font-bold text-[#1F2E3D]"
                  style={{
                    fontFamily: 'var(--font-display)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  Toda guía es 100% accionable
                </h3>
                <p
                  className="mt-2 text-sm text-[#3d4a5a]"
                  style={{ lineHeight: 1.65 }}
                >
                  Si una guía requiere comprar material caro, conseguir un
                  segundo docente o recursos que no están en una escuela pública
                  argentina promedio, es nuestra falla. La rehacemos.
                </p>
              </div>
            </li>

            <li className="bento-card flex gap-5 rounded-[16px] border border-[#e2e8f0] bg-white p-6 shadow-[0_2px_12px_rgba(15,34,64,0.04)]">
              <span
                aria-hidden
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#27AE60] to-[#0d9448] text-lg font-bold text-white shadow-[0_4px_12px_rgba(39,174,96,0.3)]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                02
              </span>
              <div>
                <h3
                  className="text-lg font-bold text-[#1F2E3D]"
                  style={{
                    fontFamily: 'var(--font-display)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  Nunca reemplazamos al docente — lo potenciamos
                </h3>
                <p
                  className="mt-2 text-sm text-[#3d4a5a]"
                  style={{ lineHeight: 1.65 }}
                >
                  IncluAI sugiere, propone, redacta. La decisión pedagógica es
                  siempre del docente que conoce a su alumno. Nuestra IA es un
                  acelerador, no un reemplazo.
                </p>
              </div>
            </li>

            <li className="bento-card flex gap-5 rounded-[16px] border border-[#e2e8f0] bg-white p-6 shadow-[0_2px_12px_rgba(15,34,64,0.04)]">
              <span
                aria-hidden
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#27AE60] to-[#0d9448] text-lg font-bold text-white shadow-[0_4px_12px_rgba(39,174,96,0.3)]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                03
              </span>
              <div>
                <h3
                  className="text-lg font-bold text-[#1F2E3D]"
                  style={{
                    fontFamily: 'var(--font-display)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  Cumplimos la normativa argentina, no inventamos
                </h3>
                <p
                  className="mt-2 text-sm text-[#3d4a5a]"
                  style={{ lineHeight: 1.65 }}
                >
                  Resolución CFE 311/16, Ley 26.206, Ley 26.378. Citamos cuando
                  corresponde, no cuando queda lindo. Auditamos contra el marco
                  legal vigente.
                </p>
              </div>
            </li>

            <li className="bento-card flex gap-5 rounded-[16px] border border-[#e2e8f0] bg-white p-6 shadow-[0_2px_12px_rgba(15,34,64,0.04)]">
              <span
                aria-hidden
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#27AE60] to-[#0d9448] text-lg font-bold text-white shadow-[0_4px_12px_rgba(39,174,96,0.3)]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                04
              </span>
              <div>
                <h3
                  className="text-lg font-bold text-[#1F2E3D]"
                  style={{
                    fontFamily: 'var(--font-display)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  Privacidad de los alumnos sobre todas las cosas
                </h3>
                <p
                  className="mt-2 text-sm text-[#3d4a5a]"
                  style={{ lineHeight: 1.65 }}
                >
                  Trabajamos con iniciales o pseudónimos. Nunca pedimos datos
                  identificatorios reales del alumno. Cumplimos Ley 25.326
                  (datos personales) y Ley 27.306 (DEA).
                </p>
              </div>
            </li>
          </ol>
        </section>
      </RevealOnScroll>

      <RevealOnScroll delay={280}>
        <section className="mt-14 rounded-[20px] border border-[#fcd34d]/40 bg-gradient-to-br from-[#fef3c7] to-[#fef9e0] p-8 sm:p-10">
          <p
            className="text-xs font-semibold uppercase tracking-[0.08em] text-[#92400e]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Nuestra meta a 5 años
          </p>
          <h2
            className="mt-3 text-3xl font-bold text-[#1F2E3D] sm:text-4xl"
            style={{
              fontFamily: 'var(--font-display)',
              letterSpacing: '-0.025em',
              lineHeight: 1.1,
            }}
          >
            <span className="gradient-text">100.000 docentes</span> argentinos
            usando IncluAI semanalmente.
          </h2>
          <p
            className="mt-4 text-base text-[#3d4a5a]"
            style={{ lineHeight: 1.65 }}
          >
            No para ser una empresa grande — para que cada alumno con
            discapacidad en el sistema educativo argentino tenga garantizado
            que su docente puede planificar pensando en él en menos de un
            minuto. Si lo logramos, el problema deja de ser un problema.
          </p>
        </section>
      </RevealOnScroll>

      <RevealOnScroll delay={360}>
        <section className="mt-14 text-center">
          <h2
            className="text-2xl font-bold text-[#1F2E3D] sm:text-3xl"
            style={{
              fontFamily: 'var(--font-display)',
              letterSpacing: '-0.025em',
            }}
          >
            ¿Te sumás a la misión?
          </h2>
          <p
            className="mt-3 text-base text-[#3d4a5a]"
            style={{ lineHeight: 1.65 }}
          >
            Probá la herramienta hoy. 1 guía gratis por mes, sin tarjeta.
          </p>
          <Link
            href="/registro"
            className="magnetic-btn mt-6 inline-flex items-center gap-2 rounded-[14px] bg-[#27AE60] px-7 py-4 text-base font-bold text-white shadow-[0_12px_32px_rgba(39,174,96,0.45)]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Crear mi primera guía →
          </Link>
        </section>
      </RevealOnScroll>
    </article>
  );
}

import { RevealOnScroll } from '@/components/landing/RevealOnScroll';

export const metadata = {
  title: 'Prensa · IncluAI',
  description:
    'Información para periodistas, datos clave, contacto de prensa y recursos para cobertura de IncluAI.',
};

export default function PrensaPage() {
  return (
    <article>
      <RevealOnScroll>
        <span
          className="inline-flex items-center gap-2 rounded-full bg-[#EDE3F6] px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-[#6C3483]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          📰 Prensa
        </span>
        <h1
          className="mt-5 text-4xl font-extrabold leading-[1.05] text-[#1F2E3D] sm:text-5xl"
          style={{
            fontFamily: 'var(--font-display)',
            letterSpacing: '-0.035em',
          }}
        >
          Información para{' '}
          <span className="gradient-text">periodistas y medios.</span>
        </h1>
        <p
          className="mt-5 text-lg text-[#3d4a5a]"
          style={{ lineHeight: 1.7 }}
        >
          Si estás escribiendo sobre educación inclusiva en Argentina, IA
          aplicada al sistema educativo o tecnología social — acá tenés
          datos clave, contacto directo y respuestas rápidas.
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
            En 30 segundos
          </h2>
          <div className="mt-5 space-y-3 rounded-[20px] border border-[#e2e8f0] bg-white p-6 shadow-[0_2px_12px_rgba(15,34,64,0.04)] sm:p-8">
            <p
              className="text-base text-[#1F2E3D]"
              style={{ lineHeight: 1.7 }}
            >
              <strong>IncluAI</strong> es una plataforma argentina de IA que
              ayuda a docentes, familias y profesionales de la salud a
              planificar la inclusión educativa de personas con discapacidad.
            </p>
            <p
              className="text-base text-[#3d4a5a]"
              style={{ lineHeight: 1.7 }}
            >
              Genera <strong>guías pedagógicas concretas</strong> en menos de
              un minuto, conforme a la <strong>Resolución CFE 311/16</strong>{' '}
              y al marco normativo argentino. Es producto de{' '}
              <strong>Nativos Consultora Digital</strong> (Catamarca,
              Argentina).
            </p>
          </div>
        </section>
      </RevealOnScroll>

      <RevealOnScroll delay={200}>
        <section className="mt-14">
          <h2
            className="text-2xl font-bold text-[#1F2E3D]"
            style={{
              fontFamily: 'var(--font-display)',
              letterSpacing: '-0.025em',
            }}
          >
            Datos clave
          </h2>
          <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <li className="bento-card rounded-[16px] border border-[#e2e8f0] bg-white p-5">
              <p
                className="text-xs font-semibold uppercase tracking-[0.08em] text-[#2E86C1]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Producto
              </p>
              <p
                className="mt-2 text-base font-semibold text-[#1F2E3D]"
                style={{
                  fontFamily: 'var(--font-display)',
                  letterSpacing: '-0.01em',
                }}
              >
                IncluAI
              </p>
              <p className="mt-1 text-sm text-[#3d4a5a]">
                Plataforma SaaS de IA para educación inclusiva
              </p>
            </li>
            <li className="bento-card rounded-[16px] border border-[#e2e8f0] bg-white p-5">
              <p
                className="text-xs font-semibold uppercase tracking-[0.08em] text-[#2E86C1]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Empresa
              </p>
              <p
                className="mt-2 text-base font-semibold text-[#1F2E3D]"
                style={{
                  fontFamily: 'var(--font-display)',
                  letterSpacing: '-0.01em',
                }}
              >
                Nativos Consultora Digital
              </p>
              <p className="mt-1 text-sm text-[#3d4a5a]">
                Catamarca, Argentina · 2026
              </p>
            </li>
            <li className="bento-card rounded-[16px] border border-[#e2e8f0] bg-white p-5">
              <p
                className="text-xs font-semibold uppercase tracking-[0.08em] text-[#2E86C1]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Mercado objetivo
              </p>
              <p
                className="mt-2 text-base font-semibold text-[#1F2E3D]"
                style={{
                  fontFamily: 'var(--font-display)',
                  letterSpacing: '-0.01em',
                }}
              >
                +200.000 alumnos con CUD
              </p>
              <p className="mt-1 text-sm text-[#3d4a5a]">
                en escuelas comunes argentinas (datos ANDIS)
              </p>
            </li>
            <li className="bento-card rounded-[16px] border border-[#e2e8f0] bg-white p-5">
              <p
                className="text-xs font-semibold uppercase tracking-[0.08em] text-[#2E86C1]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Tecnología
              </p>
              <p
                className="mt-2 text-base font-semibold text-[#1F2E3D]"
                style={{
                  fontFamily: 'var(--font-display)',
                  letterSpacing: '-0.01em',
                }}
              >
                IA Claude (Anthropic)
              </p>
              <p className="mt-1 text-sm text-[#3d4a5a]">
                Modelos Sonnet 4.6 y Opus 4.7
              </p>
            </li>
          </ul>
        </section>
      </RevealOnScroll>

      <RevealOnScroll delay={280}>
        <section className="mt-14">
          <h2
            className="text-2xl font-bold text-[#1F2E3D]"
            style={{
              fontFamily: 'var(--font-display)',
              letterSpacing: '-0.025em',
            }}
          >
            Marco normativo argentino
          </h2>
          <p
            className="mt-3 text-base text-[#3d4a5a]"
            style={{ lineHeight: 1.65 }}
          >
            IncluAI cumple con:
          </p>
          <ul className="mt-4 flex flex-col gap-2">
            {[
              {
                ley: 'Resolución CFE 311/16',
                desc: 'Promoción, acreditación, certificación y titulación de estudiantes con discapacidad.',
              },
              {
                ley: 'Ley 26.206',
                desc: 'Ley de Educación Nacional · garantiza educación inclusiva.',
              },
              {
                ley: 'Ley 26.378',
                desc: 'Aprueba la Convención sobre los Derechos de las Personas con Discapacidad (ONU).',
              },
              {
                ley: 'Ley 27.306',
                desc: 'Detección Temprana y Atención Integral de Dificultades Específicas del Aprendizaje (DEA).',
              },
              {
                ley: 'Ley 25.326',
                desc: 'Protección de Datos Personales · privacidad de los alumnos.',
              },
            ].map((item) => (
              <li
                key={item.ley}
                className="flex flex-col gap-1 rounded-[12px] border border-[#e2e8f0] bg-white px-4 py-3 sm:flex-row sm:gap-4"
              >
                <span
                  className="font-bold text-[#2E86C1] sm:w-48 sm:shrink-0"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {item.ley}
                </span>
                <span
                  className="text-sm text-[#3d4a5a]"
                  style={{ lineHeight: 1.55 }}
                >
                  {item.desc}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </RevealOnScroll>

      <RevealOnScroll delay={360}>
        <section className="mt-14 rounded-[24px] bg-gradient-to-br from-[#0d7c3a] via-[#27AE60] to-[#1e8449] p-8 text-white shadow-[0_16px_48px_rgba(39,174,96,0.35)] sm:p-10">
          <p
            className="text-xs font-semibold uppercase tracking-[0.08em] text-white/85"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Contacto de prensa
          </p>
          <h2
            className="mt-3 text-3xl font-bold sm:text-4xl"
            style={{
              fontFamily: 'var(--font-display)',
              letterSpacing: '-0.025em',
              lineHeight: 1.1,
            }}
          >
            Hablemos.
          </h2>
          <p
            className="mt-3 text-base text-white/90"
            style={{ lineHeight: 1.65 }}
          >
            Respondemos consultas de medios en menos de 24hs. Pedinos
            entrevistas, datos puntuales o material adicional.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a
              href="mailto:contacto@nativosconsultora.com.ar?subject=Prensa%20-%20IncluAI"
              className="magnetic-btn inline-flex items-center gap-2 rounded-[12px] bg-white px-6 py-3 text-sm font-bold text-[#0d7c3a] shadow-[0_8px_20px_rgba(0,0,0,0.18)]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              ✉️ contacto@nativosconsultora.com.ar
            </a>
            <a
              href="tel:+543813005807"
              className="inline-flex items-center gap-2 rounded-[12px] border-2 border-white bg-transparent px-6 py-3 text-sm font-bold text-white hover:bg-white/10"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              📞 +54 381 300 5807
            </a>
          </div>
        </section>
      </RevealOnScroll>
    </article>
  );
}

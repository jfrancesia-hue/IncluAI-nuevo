import Link from 'next/link';
import { RevealOnScroll } from '@/components/landing/RevealOnScroll';

export const metadata = {
  title: 'Sobre IncluAI · Nativos Consultora Digital',
  description:
    'Conocé al equipo detrás de IncluAI: una consultora argentina que cree que la educación inclusiva no es un lujo, es un punto de partida.',
};

export default function SobreNosotrosPage() {
  return (
    <article>
      <RevealOnScroll>
        <span
          className="inline-flex items-center gap-2 rounded-full bg-[#D6F0E0] px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-[#1e8449]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          🇦🇷 Sobre nosotros
        </span>
        <h1
          className="mt-5 text-4xl font-extrabold leading-[1.05] text-[#1F2E3D] sm:text-5xl"
          style={{
            fontFamily: 'var(--font-display)',
            letterSpacing: '-0.035em',
          }}
        >
          Hecho por argentinos,{' '}
          <span className="gradient-text">para docentes argentinos.</span>
        </h1>
        <p
          className="mt-5 text-lg text-[#3d4a5a]"
          style={{ lineHeight: 1.7 }}
        >
          IncluAI nació en Catamarca con una idea simple: ningún docente
          debería pasar la noche armando una guía inclusiva cuando una
          inteligencia artificial bien entrenada puede hacerlo en 30 segundos.
        </p>
      </RevealOnScroll>

      <RevealOnScroll delay={120}>
        <section className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="bento-card rounded-[20px] border border-[#e2e8f0] bg-white p-6 shadow-[0_2px_12px_rgba(15,34,64,0.04)]">
            <p
              className="text-xs font-semibold uppercase tracking-[0.08em] text-[#2E86C1]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Quiénes somos
            </p>
            <h2
              className="mt-3 text-2xl font-bold text-[#1F2E3D]"
              style={{
                fontFamily: 'var(--font-display)',
                letterSpacing: '-0.02em',
              }}
            >
              Nativos Consultora Digital
            </h2>
            <p
              className="mt-3 text-base text-[#3d4a5a]"
              style={{ lineHeight: 1.65 }}
            >
              Una consultora boutique especializada en software con IA aplicada
              al impacto social. Trabajamos en Argentina diseñando productos
              que solucionan problemas reales con tecnología de primer nivel.
            </p>
          </div>

          <div className="bento-card rounded-[20px] border border-[#e2e8f0] bg-white p-6 shadow-[0_2px_12px_rgba(15,34,64,0.04)]">
            <p
              className="text-xs font-semibold uppercase tracking-[0.08em] text-[#27AE60]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Dónde estamos
            </p>
            <h2
              className="mt-3 text-2xl font-bold text-[#1F2E3D]"
              style={{
                fontFamily: 'var(--font-display)',
                letterSpacing: '-0.02em',
              }}
            >
              Catamarca · 🇦🇷
            </h2>
            <p
              className="mt-3 text-base text-[#3d4a5a]"
              style={{ lineHeight: 1.65 }}
            >
              Operamos desde el norte argentino. Conocemos las realidades de
              las aulas del interior tanto como las de Buenos Aires. Nuestra
              IA habla en español rioplatense porque se entrenó con docentes
              reales del país.
            </p>
          </div>
        </section>
      </RevealOnScroll>

      <RevealOnScroll delay={200}>
        <section className="mt-14 rounded-[24px] bg-gradient-to-br from-[#0d7c3a] via-[#27AE60] to-[#1e8449] p-8 text-white shadow-[0_16px_48px_rgba(39,174,96,0.35)] sm:p-10">
          <p
            className="text-xs font-semibold uppercase tracking-[0.08em] text-white/85"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Por qué hacemos esto
          </p>
          <h2
            className="mt-3 text-3xl font-bold sm:text-4xl"
            style={{
              fontFamily: 'var(--font-display)',
              letterSpacing: '-0.025em',
              lineHeight: 1.1,
            }}
          >
            La inclusión no debería depender de tener tiempo de sobra.
          </h2>
          <p
            className="mt-4 max-w-2xl text-base text-white/90 sm:text-lg"
            style={{ lineHeight: 1.65 }}
          >
            Hablamos con cientos de docentes argentinos. La frustración era la
            misma: querían incluir, pero el sistema les pedía hacerlo además
            de todo lo demás. Sin tiempo, sin recursos, sin formación específica.
            IncluAI existe para sacar ese trabajo invisible del medio y dejar
            al docente hacer lo que mejor hace: enseñar.
          </p>
        </section>
      </RevealOnScroll>

      <RevealOnScroll delay={280}>
        <section className="mt-14">
          <h2
            className="text-2xl font-bold text-[#1F2E3D] sm:text-3xl"
            style={{
              fontFamily: 'var(--font-display)',
              letterSpacing: '-0.025em',
            }}
          >
            Nuestros principios
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
                ⚖️ Rigor normativo
              </p>
              <p
                className="mt-2 text-sm text-[#3d4a5a]"
                style={{ lineHeight: 1.6 }}
              >
                Citamos CFE 311/16, Ley 26.206 y normativa provincial cuando
                corresponde. Nada inventado.
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
                🎯 Concreto sobre teórico
              </p>
              <p
                className="mt-2 text-sm text-[#3d4a5a]"
                style={{ lineHeight: 1.6 }}
              >
                Materiales que el docente puede imprimir hoy y usar mañana.
                Nada de "considere el principio holístico…".
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
                🇦🇷 Argentino sin pedir perdón
              </p>
              <p
                className="mt-2 text-sm text-[#3d4a5a]"
                style={{ lineHeight: 1.6 }}
              >
                Voseo, español rioplatense, ejemplos del aula real argentina.
                No traducimos: pensamos en argentino.
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
                ♿ Accesibilidad por defecto
              </p>
              <p
                className="mt-2 text-sm text-[#3d4a5a]"
                style={{ lineHeight: 1.6 }}
              >
                WCAG 2.1 AA cumplido. Modo alto contraste, escala de texto,
                navegación con teclado. Lo que predicamos lo aplicamos.
              </p>
            </li>
          </ul>
        </section>
      </RevealOnScroll>

      <RevealOnScroll delay={360}>
        <section className="mt-14 rounded-[20px] border border-[#e2e8f0] bg-gradient-to-br from-[#FBF8F2] to-[#fef3c7]/60 p-8 text-center sm:p-10">
          <p className="text-2xl text-[#3d4a5a] sm:text-3xl" style={{ lineHeight: 1.4 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: '#1F2E3D' }}>
              ¿Tenés una pregunta?
            </span>
          </p>
          <p
            className="mt-3 text-base text-[#3d4a5a]"
            style={{ lineHeight: 1.65 }}
          >
            Escribinos directamente. Respondemos en 24-48 hs hábiles.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <a
              href="mailto:jorge@nativosconsultora.com.ar"
              className="magnetic-btn inline-flex items-center gap-2 rounded-[12px] bg-[#27AE60] px-6 py-3 text-sm font-bold text-white shadow-[0_8px_20px_rgba(39,174,96,0.35)]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              ✉️ jorge@nativosconsultora.com.ar
            </a>
            <a
              href="tel:+543813005807"
              className="inline-flex items-center gap-2 rounded-[12px] border-2 border-[#27AE60] bg-white px-6 py-3 text-sm font-bold text-[#0d7c3a] hover:bg-[#D6F0E0]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              📞 +54 381 300 5807
            </a>
          </div>
          <Link
            href="/registro"
            className="mt-8 inline-block text-sm font-semibold text-[#2E86C1] hover:underline"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            ¿Querés probar la herramienta? Empezá gratis →
          </Link>
        </section>
      </RevealOnScroll>
    </article>
  );
}

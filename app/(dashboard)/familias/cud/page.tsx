import Link from 'next/link';
import { PASOS_CUD } from '@/data/cud-pasos';
import { Button } from '@/components/ui/button';
import { PageShell } from '@/components/ui/PageShell';
import { RevealOnScroll } from '@/components/landing/RevealOnScroll';

export const metadata = { title: 'Trámite CUD · IncluAI' };

export default function CUDPage() {
  return (
    <PageShell
      eyebrow="📋 Guía paso a paso"
      title={
        <>
          Tramitar el{' '}
          <span className="gradient-text">CUD</span>
        </>
      }
      subtitle={
        <>
          El <strong>Certificado Único de Discapacidad</strong> es la puerta de
          entrada a las prestaciones de la Ley 24.901. Es gratuito y se
          tramita en tu provincia.
        </>
      }
      decoration="soft"
      tone="familias"
      revealChildren={false}
    >
      <div className="flex flex-col gap-6">
        <RevealOnScroll>
          <aside className="rounded-[16px] border border-[#27AE60]/20 bg-gradient-to-br from-[#D6F0E0]/60 to-[#D6F0E0]/20 p-5 text-sm">
            <p
              className="font-bold text-[#1e8449]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              💡 En resumen
            </p>
            <p
              className="mt-1.5 text-[#1F2E3D]"
              style={{ lineHeight: 1.65 }}
            >
              Necesitás un <strong>informe médico reciente</strong>, pedir
              turno con la <strong>junta evaluadora</strong> de tu provincia,
              asistir a la evaluación y recibir el certificado. Todo el
              trámite es <strong>gratuito</strong>.
            </p>
          </aside>
        </RevealOnScroll>

        <ol className="flex flex-col gap-3">
          {PASOS_CUD.map((paso, i) => (
            <RevealOnScroll
              key={paso.numero}
              as="li"
              delay={Math.min(i * 60, 360)}
            >
              <article className="bento-card flex gap-4 rounded-[16px] border border-[#e2e8f0] bg-white p-5 shadow-[0_2px_12px_rgba(15,34,64,0.04)]">
                <div
                  aria-hidden
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#27AE60] to-[#0d9448] text-lg font-bold text-white shadow-[0_4px_12px_rgba(39,174,96,0.3)]"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {paso.numero}
                </div>
                <div className="flex flex-1 flex-col gap-2">
                  <h2
                    className="text-lg font-bold text-[#1F2E3D]"
                    style={{
                      fontFamily: 'var(--font-display)',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {paso.titulo}
                  </h2>
                  <p
                    className="text-sm text-[#1F2E3D]"
                    style={{ lineHeight: 1.65 }}
                  >
                    {paso.descripcion}
                  </p>
                  {paso.docs && (
                    <div className="rounded-[10px] border border-[#e2e8f0] bg-[#FBF8F2] p-3 text-xs">
                      <p
                        className="mb-1.5 font-semibold uppercase text-[#4A5968]"
                        style={{
                          fontFamily: 'var(--font-display)',
                          letterSpacing: '0.06em',
                        }}
                      >
                        Documentación
                      </p>
                      <ul className="flex flex-col gap-0.5 text-[#1F2E3D]">
                        {paso.docs.map((d) => (
                          <li key={d}>• {d}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {paso.tip && (
                    <p className="rounded-[10px] border-l-[3px] border-[#27AE60] bg-[#D6F0E0]/40 p-3 text-xs text-[#1F2E3D]">
                      💡 <strong>Tip:</strong> {paso.tip}
                    </p>
                  )}
                </div>
              </article>
            </RevealOnScroll>
          ))}
        </ol>

        <RevealOnScroll>
          <article className="bento-card rounded-[16px] border border-[#e2e8f0] bg-white p-6 shadow-[0_2px_12px_rgba(15,34,64,0.04)]">
            <h3
              className="text-lg font-bold text-[#1F2E3D]"
              style={{
                fontFamily: 'var(--font-display)',
                letterSpacing: '-0.02em',
              }}
            >
              Enlaces oficiales
            </h3>
            <ul className="mt-3 flex flex-col gap-2 text-sm">
              <li>
                <a
                  href="https://www.argentina.gob.ar/andis/cud"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[#27AE60] hover:underline"
                >
                  ANDIS — Cómo tramitar el CUD →
                </a>
              </li>
              <li>
                <a
                  href="https://www.argentina.gob.ar/servicios/juntas-evaluadoras-del-cud"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[#27AE60] hover:underline"
                >
                  Buscar junta evaluadora por provincia →
                </a>
              </li>
              <li>
                <a
                  href="https://www.argentina.gob.ar/normativa/nacional/ley-24901-47677"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[#27AE60] hover:underline"
                >
                  Ley 24.901 — Prestaciones básicas →
                </a>
              </li>
            </ul>
          </article>
        </RevealOnScroll>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button asChild variant="outline">
            <Link href="/recursos?publico=familia">Ver más recursos</Link>
          </Button>
          <Button asChild>
            <Link href="/familias/nueva-consulta">+ Generar guía familiar</Link>
          </Button>
        </div>
      </div>
    </PageShell>
  );
}

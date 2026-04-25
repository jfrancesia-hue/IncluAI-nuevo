import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { checkPPILimit } from '@/lib/ppi/plan-limits';
import type { PPIDocumento } from '@/lib/types/ppi';
import { cicloLectivoActual } from '@/lib/types/ppi';
import { PageShell } from '@/components/ui/PageShell';
import { RevealOnScroll } from '@/components/landing/RevealOnScroll';
import { AnimatedNumber } from '@/components/ui/AnimatedNumber';

export const dynamic = 'force-dynamic';

const ESTADO_LABEL: Record<string, string> = {
  borrador: 'Borrador',
  completo: 'Listo para revisar',
  presentado: 'Presentado',
  archivado: 'Archivado',
};

const ESTADO_TONE: Record<string, { bg: string; color: string }> = {
  borrador: { bg: '#fee4e2', color: '#b42318' },
  completo: { bg: '#faeeda', color: '#854f0b' },
  presentado: { bg: '#e1f5ee', color: '#1d9e75' },
  archivado: { bg: '#f1f5f9', color: '#475569' },
};

export default async function PPIListadoPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const ciclo = cicloLectivoActual();
  const [{ data: ppis }, limit] = await Promise.all([
    supabase
      .from('ppi_documentos')
      .select(
        'id, alumno_identificador, alumno_edad, alumno_nivel, alumno_anio_grado, institucion, ciclo_lectivo, estado, created_at, updated_at'
      )
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(50)
      .returns<
        Array<
          Pick<
            PPIDocumento,
            | 'id'
            | 'alumno_identificador'
            | 'alumno_edad'
            | 'alumno_nivel'
            | 'alumno_anio_grado'
            | 'institucion'
            | 'ciclo_lectivo'
            | 'estado'
            | 'created_at'
            | 'updated_at'
          >
        >
      >(),
    checkPPILimit(),
  ]);

  const enCicloActual = (ppis ?? []).filter(
    (p) => p.ciclo_lectivo === ciclo
  );

  return (
    <PageShell
      eyebrow="📋 PPI"
      title={
        <>
          Proyectos Pedagógicos{' '}
          <span className="gradient-text">Individuales</span>
        </>
      }
      subtitle={
        <>
          Generá un PPI completo conforme a la Resolución CFE 311/16 en
          minutos. Ciclo lectivo <strong>{ciclo}</strong>.
        </>
      }
      decoration="mesh"
      tone="docentes"
      revealChildren={false}
    >
      <div className="flex flex-col gap-6">
        {/* Banner de plan/cuota */}
        <RevealOnScroll>
          <section className="bento-card relative overflow-hidden rounded-[20px] bg-gradient-to-br from-[#042C53] via-[#0a3a6b] to-[#185FA5] p-6 text-white shadow-[0_16px_48px_rgba(4,44,83,0.35)] sm:p-8">
            <div
              aria-hidden
              className="absolute right-0 top-0 h-48 w-48"
              style={{
                background:
                  'radial-gradient(circle at 100% 0%, rgba(39,174,96,0.4), transparent 60%)',
                filter: 'blur(40px)',
              }}
            />
            <div className="relative flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <p
                  className="text-xs font-semibold uppercase text-white/75"
                  style={{
                    fontFamily: 'var(--font-display)',
                    letterSpacing: '0.08em',
                  }}
                >
                  Plan {limit.plan.toUpperCase()} — Ciclo {ciclo}
                </p>
                <p
                  className="mt-2 text-3xl font-extrabold"
                  style={{
                    fontFamily: 'var(--font-display)',
                    letterSpacing: '-0.025em',
                  }}
                >
                  <AnimatedNumber value={limit.ppis_usados} duration={1200} />{' '}
                  <span className="text-white/60">de</span> {limit.limite}{' '}
                  <span className="text-base font-normal text-white/75">
                    PPI{limit.limite === 1 ? '' : 's'}
                  </span>
                </p>
                <p className="mt-1 text-sm text-white/80">
                  {limit.permitido
                    ? `Te queda${limit.ppis_restantes === 1 ? '' : 'n'} ${limit.ppis_restantes} disponible${limit.ppis_restantes === 1 ? '' : 's'} este ciclo.`
                    : 'Alcanzaste el límite del plan. Mejorá para más PPIs.'}
                </p>
              </div>
              {limit.permitido ? (
                <Link
                  href="/ppi/nuevo"
                  className="magnetic-btn inline-flex items-center gap-2 rounded-[12px] bg-white px-6 py-3 text-sm font-bold text-[#042C53] shadow-[0_8px_20px_rgba(0,0,0,0.2)]"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  + Crear nuevo PPI
                </Link>
              ) : (
                <Link
                  href="/planes"
                  className="magnetic-btn inline-flex items-center gap-2 rounded-[12px] bg-[#fac775] px-6 py-3 text-sm font-bold text-[#042C53] shadow-[0_8px_20px_rgba(250,199,117,0.45)]"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Mejorar plan
                </Link>
              )}
            </div>
          </section>
        </RevealOnScroll>

        {/* Lista de PPIs */}
        {enCicloActual.length === 0 ? (
          <RevealOnScroll>
            <div className="flex min-h-[260px] flex-col items-center justify-center gap-3 rounded-[20px] border-2 border-dashed border-[#e2e8f0] bg-white p-10 text-center">
              <span aria-hidden className="text-5xl">📋</span>
              <p
                className="text-lg font-bold text-[#1F2E3D]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Aún no creaste ningún PPI en este ciclo
              </p>
              <p
                className="max-w-md text-sm text-[#4A5968]"
                style={{ lineHeight: 1.6 }}
              >
                El PPI es el documento formal que presentás a la institución
                por cada alumno con discapacidad. IncluAI lo arma en base a tus
                observaciones en pocos minutos.
              </p>
              {limit.permitido && (
                <Link
                  href="/ppi/nuevo"
                  className="magnetic-btn mt-2 inline-flex items-center rounded-[12px] bg-[#042C53] px-5 py-2.5 text-sm font-bold text-white"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Crear mi primer PPI →
                </Link>
              )}
            </div>
          </RevealOnScroll>
        ) : (
          <ul className="flex flex-col gap-3">
            {enCicloActual.map((p, i) => (
              <RevealOnScroll
                key={p.id}
                as="li"
                delay={Math.min(i * 50, 320)}
              >
                <article className="bento-card flex flex-col items-start justify-between gap-3 rounded-[16px] border border-[#e2e8f0] bg-white p-5 sm:flex-row sm:items-center">
                  <div className="min-w-0 flex-1">
                    <p
                      className="text-base font-bold text-[#1F2E3D]"
                      style={{
                        fontFamily: 'var(--font-display)',
                        letterSpacing: '-0.02em',
                      }}
                    >
                      {p.alumno_identificador}
                    </p>
                    <p className="mt-1 text-sm text-[#4A5968]">
                      {p.alumno_edad} años · {p.alumno_nivel}
                      {p.alumno_anio_grado ? ` · ${p.alumno_anio_grado}` : ''}{' '}
                      · {p.institucion}
                    </p>
                    <p className="mt-1.5 text-xs text-[#4A5968]/70">
                      Actualizado{' '}
                      {new Date(p.updated_at).toLocaleDateString('es-AR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className="rounded-full px-3 py-1 text-xs font-bold"
                      style={{
                        fontFamily: 'var(--font-display)',
                        background: ESTADO_TONE[p.estado]?.bg ?? '#f1f5f9',
                        color: ESTADO_TONE[p.estado]?.color ?? '#475569',
                      }}
                    >
                      {ESTADO_LABEL[p.estado] ?? p.estado}
                    </span>
                    <Link
                      href={`/ppi/${p.id}`}
                      className="rounded-[10px] bg-[#042C53] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#0a3a6b]"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      Abrir
                    </Link>
                  </div>
                </article>
              </RevealOnScroll>
            ))}
          </ul>
        )}

        {/* Educación normativa */}
        <RevealOnScroll>
          <section className="rounded-[20px] border border-[#e2e8f0] bg-gradient-to-br from-[#FBF8F2] to-[#fef3c7]/60 p-6 sm:p-8">
            <h2
              className="text-lg font-bold text-[#1F2E3D]"
              style={{
                fontFamily: 'var(--font-display)',
                letterSpacing: '-0.02em',
              }}
            >
              ¿Qué es un PPI y por qué lo necesitás?
            </h2>
            <p
              className="mt-2 text-sm text-[#4A5968]"
              style={{ lineHeight: 1.65 }}
            >
              El <strong>Proyecto Pedagógico Individual</strong> es el
              documento formal que establece las configuraciones de apoyo,
              contenidos priorizados, adaptaciones metodológicas y criterios de
              evaluación para un estudiante con discapacidad. Es obligatorio
              según la <strong>Resolución CFE 311/16</strong> y lo presentás a
              la dirección de la escuela al comienzo del ciclo. IncluAI lo
              redacta en base a tus observaciones y el perfil del alumno — vos
              lo revisás, editás lo que quieras, y lo imprimís para firma.
            </p>
          </section>
        </RevealOnScroll>
      </div>
    </PageShell>
  );
}

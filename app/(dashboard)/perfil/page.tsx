import Link from 'next/link';
import { getPerfil } from '@/lib/auth';
import { LIMITES_PLAN, type PlanUsuario } from '@/lib/types';
import { signOutAction } from '@/app/(dashboard)/actions';
import { PerfilForm } from './perfil-form';
import { PageShell } from '@/components/ui/PageShell';
import { RevealOnScroll } from '@/components/landing/RevealOnScroll';
import { AnimatedNumber } from '@/components/ui/AnimatedNumber';

function nombrePlanHumano(plan: PlanUsuario): string {
  if (plan === 'free') return 'Gratuito';
  if (plan === 'basico') return 'Básico';
  if (plan === 'profesional') return 'Profesional';
  return 'Premium';
}

export const metadata = { title: 'Mi perfil · IncluAI' };

export default async function PerfilPage() {
  const perfil = await getPerfil();
  if (!perfil) return null;

  const esPago = perfil.plan !== 'free';
  const limite = LIMITES_PLAN[perfil.plan].guias_mes;
  const restantes = Math.max(0, limite - perfil.consultas_mes);
  const iniciales = `${perfil.nombre?.[0] ?? ''}${
    perfil.apellido?.[0] ?? ''
  }`.toUpperCase();

  return (
    <PageShell
      eyebrow="👤 Tu cuenta"
      title="Mi perfil"
      subtitle={`${perfil.nombre} ${perfil.apellido} · ${perfil.email}`}
      decoration="soft"
      tone="docentes"
      revealChildren={false}
    >
      <div className="flex flex-col gap-6">
        {/* Avatar grande con glow */}
        <RevealOnScroll>
          <div className="flex items-center gap-5">
            <div
              className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#27AE60] to-[#0d9448] text-3xl font-extrabold text-white shadow-[0_8px_24px_rgba(39,174,96,0.35)]"
              style={{
                fontFamily: 'var(--font-display)',
                animation: 'glow-pulse 3.6s ease-in-out infinite',
              }}
            >
              {iniciales || '🧩'}
            </div>
            <div>
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase"
                style={{
                  fontFamily: 'var(--font-display)',
                  letterSpacing: '0.08em',
                  color: esPago ? '#0d7c3a' : '#2E86C1',
                  background: esPago ? '#D6F0E0' : '#D7EAF6',
                }}
              >
                {esPago && <span aria-hidden>✓</span>}
                Plan {nombrePlanHumano(perfil.plan)}
              </span>
              {esPago && perfil.plan_activo_hasta && (
                <p className="mt-2 text-sm text-[#4A5968]">
                  Vence el{' '}
                  <strong className="text-[#1F2E3D]">
                    {new Date(perfil.plan_activo_hasta).toLocaleDateString(
                      'es-AR',
                      {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                      }
                    )}
                  </strong>
                </p>
              )}
            </div>
          </div>
        </RevealOnScroll>

        {/* Stats */}
        <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <RevealOnScroll delay={0}>
            <Stat
              icon="📊"
              label="Guías este mes"
              value={
                <AnimatedNumber
                  value={perfil.consultas_mes}
                  style={{ fontVariantNumeric: 'tabular-nums' }}
                />
              }
            />
          </RevealOnScroll>
          <RevealOnScroll delay={80}>
            <Stat
              icon="📚"
              label="Restantes"
              value={`${restantes} / ${limite}`}
            />
          </RevealOnScroll>
          <RevealOnScroll delay={160}>
            <Stat
              icon="📅"
              label="Miembro desde"
              value={new Date(perfil.created_at).toLocaleDateString('es-AR', {
                month: 'short',
                year: 'numeric',
              })}
            />
          </RevealOnScroll>
        </section>

        {/* Datos personales */}
        <RevealOnScroll>
          <section className="bento-card rounded-[20px] border border-[#e2e8f0] bg-white p-6 shadow-[0_2px_12px_rgba(15,34,64,0.05)] sm:p-8">
            <h2
              className="text-xl font-bold text-[#1F2E3D]"
              style={{
                fontFamily: 'var(--font-display)',
                letterSpacing: '-0.02em',
              }}
            >
              Datos personales
            </h2>
            <p className="mt-1 text-sm text-[#4A5968]">
              Actualizá tu información cuando quieras.
            </p>
            <div className="mt-5">
              <PerfilForm perfil={perfil} />
            </div>
          </section>
        </RevealOnScroll>

        {/* Plan card */}
        <RevealOnScroll>
          <section className="bento-card relative overflow-hidden rounded-[20px] border border-[#e2e8f0] bg-gradient-to-br from-white via-[#FBF8F2] to-[#D7EAF6] p-6 shadow-[0_4px_16px_rgba(15,34,64,0.06)] sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3
                  className="text-lg font-bold text-[#1F2E3D]"
                  style={{
                    fontFamily: 'var(--font-display)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  Tu suscripción
                </h3>
                <p className="mt-1 text-sm text-[#4A5968]">
                  {esPago
                    ? 'Podés cambiar de plan o cancelar cuando quieras.'
                    : 'Pasate a un plan pago y obtené más guías al mes.'}
                </p>
              </div>
              <Link
                href="/planes"
                className="magnetic-btn inline-flex w-fit items-center gap-2 rounded-[12px] bg-[#E67E22] px-5 py-2.5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(234,88,12,0.3)]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {esPago ? 'Cambiar plan' : 'Ver planes'} →
              </Link>
            </div>
          </section>
        </RevealOnScroll>

        {/* Sesión */}
        <RevealOnScroll>
          <section className="rounded-[20px] border border-[#e2e8f0] bg-white p-6 shadow-[0_2px_12px_rgba(15,34,64,0.05)] sm:p-8">
            <h2
              className="text-lg font-bold text-[#1F2E3D]"
              style={{
                fontFamily: 'var(--font-display)',
                letterSpacing: '-0.02em',
              }}
            >
              Sesión
            </h2>
            <form action={signOutAction} className="mt-3">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-[10px] border border-[#dc2626] bg-white px-4 py-2 text-sm font-semibold text-[#dc2626] transition hover:bg-[#dc2626] hover:text-white"
              >
                Cerrar sesión
              </button>
            </form>
          </section>
        </RevealOnScroll>
      </div>
    </PageShell>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="bento-card rounded-[16px] border border-[#e2e8f0] bg-white p-5 shadow-[0_2px_8px_rgba(15,34,64,0.04)]">
      <div
        className="flex items-center gap-2 text-xs font-semibold uppercase text-[#4A5968]"
        style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.08em' }}
      >
        <span aria-hidden>{icon}</span> {label}
      </div>
      <p
        className="mt-2 text-2xl font-extrabold text-[#2E86C1]"
        style={{
          fontFamily: 'var(--font-display)',
          letterSpacing: '-0.02em',
        }}
      >
        {value}
      </p>
    </div>
  );
}

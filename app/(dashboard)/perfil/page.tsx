import Link from 'next/link';
import { getPerfil } from '@/lib/auth';
import { LIMITES_PLAN, type PlanUsuario } from '@/lib/types';
import { signOutAction } from '@/app/(dashboard)/actions';
import { PerfilForm } from './perfil-form';

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
  const iniciales = `${perfil.nombre?.[0] ?? ''}${perfil.apellido?.[0] ?? ''}`.toUpperCase();

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center gap-5">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#27AE60] to-[#0d9448] font-serif text-3xl font-extrabold text-white shadow-[0_4px_16px_rgba(22,163,74,0.3)]">
          {iniciales || '🧩'}
        </div>
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#2E86C1] sm:text-4xl">
            Mi perfil
          </h1>
          <p className="mt-1 text-sm text-[#4A5968]">
            {perfil.nombre} {perfil.apellido} · {perfil.email}
          </p>
        </div>
      </header>

      <section className="rounded-[20px] border border-[#e2e8f0] bg-white p-6 shadow-[0_2px_12px_rgba(15,34,64,0.05)] sm:p-8">
        <h2 className="font-serif text-xl font-bold text-[#2E86C1]">
          Datos personales
        </h2>
        <p className="mt-1 text-sm text-[#4A5968]">
          Actualizá tu información cuando quieras.
        </p>
        <div className="mt-5">
          <PerfilForm perfil={perfil} />
        </div>
      </section>

      <section className="relative overflow-hidden rounded-[20px] border border-[#e2e8f0] bg-gradient-to-br from-white to-[#D7EAF6] p-6 shadow-[0_2px_12px_rgba(15,34,64,0.05)] sm:p-8">
        <div className="flex flex-col gap-5">
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={
                'inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-bold ' +
                (esPago
                  ? 'bg-[#27AE60] text-white shadow-[0_2px_8px_rgba(22,163,74,0.3)]'
                  : 'bg-[#D7EAF6] text-[#2E86C1]')
              }
            >
              {esPago && <span aria-hidden>✓</span>}
              Plan {nombrePlanHumano(perfil.plan)}
            </span>
            {esPago && perfil.plan_activo_hasta && (
              <span className="text-sm text-[#4A5968]">
                Vence el{' '}
                <strong className="text-[#2E86C1]">
                  {new Date(perfil.plan_activo_hasta).toLocaleDateString('es-AR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </strong>
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Stat icon="📊" label="Guías este mes" value={String(perfil.consultas_mes)} />
            <Stat icon="📚" label="Restantes" value={`${restantes} / ${limite}`} />
            <Stat
              icon="📅"
              label="Miembro desde"
              value={new Date(perfil.created_at).toLocaleDateString('es-AR', {
                month: 'short',
                year: 'numeric',
              })}
            />
          </div>

          <Link
            href="/planes"
            className="inline-flex w-fit items-center gap-2 rounded-[12px] bg-[#E67E22] px-5 py-2.5 text-sm font-bold text-white shadow-[0_4px_12px_rgba(234,88,12,0.3)] transition hover:bg-[#E67E22]"
          >
            Cambiar plan →
          </Link>
        </div>
      </section>

      <section className="flex flex-col gap-3 rounded-[20px] border border-[#e2e8f0] bg-white p-6 shadow-[0_2px_12px_rgba(15,34,64,0.05)] sm:p-8">
        <h2 className="font-serif text-lg font-bold text-[#2E86C1]">Sesión</h2>
        <form action={signOutAction}>
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-[10px] border border-[#dc2626] bg-white px-4 py-2 text-sm font-semibold text-[#dc2626] transition hover:bg-[#dc2626] hover:text-white"
          >
            Cerrar sesión
          </button>
        </form>
      </section>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="rounded-[14px] bg-white p-4 shadow-[0_2px_8px_rgba(15,34,64,0.04)]">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#4A5968]">
        <span aria-hidden>{icon}</span> {label}
      </div>
      <p className="mt-2 font-serif text-xl font-bold text-[#2E86C1]">{value}</p>
    </div>
  );
}

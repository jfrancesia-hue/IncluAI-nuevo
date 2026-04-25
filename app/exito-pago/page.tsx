import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { RevealOnScroll } from '@/components/landing/RevealOnScroll';

export const metadata = { title: '¡Pago exitoso! · IncluAI' };

type SearchParams = Promise<{
  payment_id?: string;
  status?: string;
  external_reference?: string;
}>;

export default async function ExitoPagoPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let perfil: { plan: string | null; plan_activo_hasta: string | null } | null =
    null;
  if (user) {
    const { data } = await supabase
      .from('perfiles')
      .select('plan, plan_activo_hasta')
      .eq('id', user.id)
      .single<{ plan: string | null; plan_activo_hasta: string | null }>();
    perfil = data;
  }

  const planNombre =
    perfil?.plan === 'basico'
      ? 'Básico'
      : perfil?.plan === 'profesional'
        ? 'Profesional'
        : perfil?.plan === 'premium'
          ? 'Premium'
          : 'pago';

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a1a30]">
      {/* Mesh gradient celebration */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ filter: 'blur(80px)', opacity: 0.6 }}
      >
        <div
          style={{
            position: 'absolute',
            top: '0%',
            left: '10%',
            width: '60%',
            height: '70%',
            background:
              'radial-gradient(circle, rgba(39,174,96,0.85), transparent 60%)',
            animation: 'mesh-orb-1 14s ease-in-out infinite',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '20%',
            right: '0%',
            width: '50%',
            height: '60%',
            background:
              'radial-gradient(circle, rgba(46,134,193,0.7), transparent 60%)',
            animation: 'mesh-orb-2 18s ease-in-out infinite',
          }}
        />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-5 py-16 text-center text-white sm:px-8">
        <RevealOnScroll>
          <div
            className="flex h-28 w-28 items-center justify-center rounded-full bg-[#27AE60] text-6xl text-white shadow-[0_16px_48px_rgba(39,174,96,0.55)] ring-4 ring-white/20"
            style={{ animation: 'glow-pulse 2.4s ease-in-out infinite' }}
          >
            ✓
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={120}>
          <span
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold uppercase backdrop-blur"
            style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.08em' }}
          >
            <span
              aria-hidden
              style={{
                width: 6,
                height: 6,
                borderRadius: 999,
                background: '#27AE60',
                boxShadow: '0 0 8px rgba(39, 174, 96, 0.7)',
              }}
            />
            Plan activo
          </span>
        </RevealOnScroll>

        <RevealOnScroll delay={200}>
          <h1
            className="mt-5 text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-6xl"
            style={{
              fontFamily: 'var(--font-display)',
              letterSpacing: '-0.035em',
            }}
          >
            ¡Bienvenida al{' '}
            <span className="gradient-text">Plan {planNombre}!</span>
          </h1>
        </RevealOnScroll>

        <RevealOnScroll delay={280}>
          <p
            className="mt-5 max-w-lg text-base text-white/85 sm:text-lg"
            style={{ lineHeight: 1.65 }}
          >
            Tu suscripción está activa. Ya tenés acceso a todas las
            funcionalidades de tu plan, incluyendo historial, exportación a PDF y
            soporte prioritario.
          </p>
        </RevealOnScroll>

        <RevealOnScroll delay={360}>
          <div className="mt-10 grid w-full max-w-lg grid-cols-1 gap-3 sm:grid-cols-3">
            <FeatureMini icon="📚" title="Más guías" />
            <FeatureMini icon="📋" title="Historial" />
            <FeatureMini icon="📄" title="PDF export" />
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={440}>
          <Link
            href="/nueva-consulta"
            className="magnetic-btn mt-10 inline-flex items-center justify-center gap-2 rounded-[14px] bg-[#27AE60] px-8 py-4 text-base font-bold text-white shadow-[0_12px_40px_rgba(39,174,96,0.55)]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Crear mi primera guía {planNombre}
            <span aria-hidden>→</span>
          </Link>
        </RevealOnScroll>

        {perfil?.plan_activo_hasta && (
          <RevealOnScroll delay={520}>
            <p className="mt-6 text-sm text-white/70">
              Tu plan se renueva el{' '}
              <strong className="text-white">
                {new Date(perfil.plan_activo_hasta).toLocaleDateString(
                  'es-AR',
                  {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  }
                )}
              </strong>
              . Cancelás cuando quieras.
            </p>
          </RevealOnScroll>
        )}

        {sp.status === 'pending' && (
          <p className="mt-2 text-xs text-white/60">
            El pago figura como pendiente. Una vez acreditado, se activa
            automáticamente.
          </p>
        )}

        <Link
          href="/inicio"
          className="mt-8 text-xs text-white/60 transition hover:text-white/90"
        >
          ← Ir al inicio
        </Link>

        {sp.payment_id && (
          <p className="mt-6 font-mono text-[10px] text-white/40">
            Ref. de pago: <code>···{sp.payment_id.slice(-4)}</code>
          </p>
        )}
      </div>
    </div>
  );
}

function FeatureMini({ icon, title }: { icon: string; title: string }) {
  return (
    <div className="bento-card flex flex-col items-center gap-2 rounded-[16px] border border-white/15 bg-white/5 p-4 backdrop-blur ring-1 ring-white/5">
      <span aria-hidden className="text-3xl">
        {icon}
      </span>
      <p
        className="text-sm font-bold text-white/95"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {title}
      </p>
    </div>
  );
}

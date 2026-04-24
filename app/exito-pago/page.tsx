import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { PHOTOS } from '@/lib/photos';

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

  let vence: string | null = null;
  if (user) {
    const { data } = await supabase
      .from('perfiles')
      .select('plan_activo_hasta')
      .eq('id', user.id)
      .single<{ plan_activo_hasta: string | null }>();
    vence = data?.plan_activo_hasta ?? null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#D6F0E0] to-[#D6F0E0]">
      <div className="mx-auto flex max-w-3xl flex-col items-center px-4 pb-20 pt-10 text-center sm:pb-16">
        <div className="relative w-full overflow-hidden rounded-[24px] shadow-[0_12px_40px_rgba(22,163,74,0.2)]">
          <Image
            src={PHOTOS.celebration}
            alt="Alumnos celebrando en el aula inclusiva"
            width={1400}
            height={600}
            priority
            className="h-[280px] w-full object-cover sm:h-[340px]"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-white/40 to-transparent"
          />
        </div>

        <div className="-mt-12 flex h-24 w-24 items-center justify-center rounded-full bg-[#27AE60] text-5xl text-white shadow-[0_8px_24px_rgba(22,163,74,0.4)] ring-4 ring-white">
          ✓
        </div>

        <h1 className="mt-6 font-serif text-4xl font-extrabold text-[#2E86C1] sm:text-5xl">
          ¡Bienvenida al Plan Pro! 🎉
        </h1>

        <p className="mt-4 max-w-lg text-base text-[#4A5968]">
          Tu suscripción está activa. Ahora podés generar hasta{' '}
          <strong className="text-[#2E86C1]">40 guías por mes</strong>, acceder
          al historial completo y exportar tus guías en PDF.
        </p>

        <div className="mt-8 grid w-full grid-cols-1 gap-3 sm:grid-cols-3">
          <FeatureCard icon="📚" title="40 guías/mes" />
          <FeatureCard icon="📋" title="Historial completo" />
          <FeatureCard icon="📄" title="Exportar PDF" />
        </div>

        <Link
          href="/nueva-consulta"
          className="mt-8 inline-flex items-center gap-2 rounded-[14px] bg-[#27AE60] px-8 py-4 text-base font-bold text-white shadow-[0_8px_24px_rgba(22,163,74,0.4)] transition hover:bg-[#27AE60]"
        >
          Crear mi primera guía Pro <span aria-hidden>→</span>
        </Link>

        {vence && (
          <p className="mt-6 text-sm text-[#4A5968]">
            Tu plan se renueva el{' '}
            <strong className="text-[#2E86C1]">
              {new Date(vence).toLocaleDateString('es-AR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })}
            </strong>
            . Podés cancelar cuando quieras.
          </p>
        )}

        {sp.status === 'pending' && (
          <p className="mt-2 text-xs text-[#4A5968]">
            El pago figura como pendiente. Una vez acreditado, se activa
            automáticamente.
          </p>
        )}

        <p className="mt-6 font-serif text-base italic text-[#2E86C1]">
          Gracias por apostar a la educación inclusiva ❤️
        </p>

        <Link
          href="/inicio"
          className="mt-4 text-xs text-[#4A5968] hover:text-[#2E86C1] hover:underline"
        >
          ← Ir al inicio
        </Link>

        {sp.payment_id && (
          <p className="mt-8 text-[10px] text-[#4A5968]">
            Ref. de pago: <code>···{sp.payment_id.slice(-4)}</code>
          </p>
        )}
      </div>
    </div>
  );
}

function FeatureCard({ icon, title }: { icon: string; title: string }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-[16px] border border-[#e2e8f0] bg-white p-4 shadow-[0_2px_8px_rgba(15,34,64,0.04)]">
      <span aria-hidden className="text-3xl">
        {icon}
      </span>
      <p className="font-serif text-sm font-bold text-[#2E86C1]">{title}</p>
    </div>
  );
}

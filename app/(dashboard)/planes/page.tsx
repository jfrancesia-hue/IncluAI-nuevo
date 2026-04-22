import Image from 'next/image';
import Link from 'next/link';
import { getPerfil } from '@/lib/auth';
import { LIMITES_PLAN } from '@/lib/types';
import { UpgradeButton } from '@/components/module/upgrade-button';
import { PHOTOS } from '@/lib/photos';
import { cn } from '@/lib/utils';

export const metadata = { title: 'Elegí tu plan · IncluIA' };

type SearchParams = Promise<{ status?: string }>;

const FEATURES_FREE = [
  '2 guías por mes',
  '1 PPI por ciclo lectivo',
  'Todos los niveles educativos',
  'Todas las discapacidades',
  'Copiar y compartir',
];

const FEATURES_PRO = [
  '40 guías por mes',
  '5 PPIs por ciclo lectivo',
  'Historial completo',
  'Exportar a PDF',
  'Guías favoritas',
  'Soporte prioritario',
];

export default async function PlanesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const [perfil, sp] = await Promise.all([getPerfil(), searchParams]);
  if (!perfil) return null;

  const esPro = perfil.plan === 'pro' || perfil.plan === 'institucional';
  const status = sp.status;

  return (
    <div className="flex flex-col gap-8">
      <header className="text-center">
        <h1 className="font-serif text-3xl font-bold text-[#1e3a5f] sm:text-4xl">
          Elegí el plan que se adapta a vos
        </h1>
        <p className="mt-2 text-base text-[#5c6b7f]">
          Invertí en tu práctica docente inclusiva.
        </p>
      </header>

      <div className="overflow-hidden rounded-[20px] shadow-lg">
        <Image
          src={PHOTOS.planesHeader}
          alt="Aula inclusiva con niños de diversas habilidades trabajando juntos"
          width={1400}
          height={500}
          className="h-[200px] w-full object-cover sm:h-[240px]"
        />
      </div>

      {status === 'error' && (
        <div className="rounded-[14px] border border-[#fecaca] bg-[#fef2f2] p-4 text-sm text-[#991b1b]">
          ❌ El pago no pudo completarse. Probá de nuevo o usá otro medio.
        </div>
      )}
      {status === 'pendiente' && (
        <div className="rounded-[14px] border border-[#fcd34d] bg-[#fef3c7] p-4 text-sm text-[#92400e]">
          ⏳ Tu pago está pendiente de acreditación. Te avisamos cuando se
          confirme.
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <PlanCard
          title="Para empezar"
          price="$0"
          period="gratuito, siempre"
          features={FEATURES_FREE}
          current={perfil.plan === 'free'}
          cta={
            perfil.plan === 'free' ? (
              <span className="text-sm font-semibold text-[#15803d]">
                Tu plan actual ✓
              </span>
            ) : (
              <Link
                href="/inicio"
                className="text-sm font-semibold text-[#15803d] hover:underline"
              >
                Seguir generando →
              </Link>
            )
          }
        />

        <PlanCard
          title="Para docentes comprometidos"
          price={`$${LIMITES_PLAN.pro.precio_ars.toLocaleString('es-AR')}`}
          period="por mes"
          subtitle="Menos que un café por día en tus alumnos"
          highlighted
          badge="Más elegido"
          features={FEATURES_PRO}
          current={perfil.plan === 'pro'}
          cta={
            perfil.plan === 'pro' ? (
              <span className="inline-flex items-center gap-2 text-sm font-bold text-[#86efac]">
                Tu plan actual ✓
              </span>
            ) : (
              <UpgradeButton plan="pro">
                Suscribirme con Mercado Pago
              </UpgradeButton>
            )
          }
        />
      </div>

      <div className="grid grid-cols-1 gap-3 text-center text-xs text-[#5c6b7f] sm:grid-cols-3">
        <div className="rounded-[12px] bg-white p-3 shadow-[0_2px_6px_rgba(15,34,64,0.04)]">
          🔒 Pago seguro con Mercado Pago
        </div>
        <div className="rounded-[12px] bg-white p-3 shadow-[0_2px_6px_rgba(15,34,64,0.04)]">
          ❌ Cancelá cuando quieras
        </div>
        <div className="rounded-[12px] bg-white p-3 shadow-[0_2px_6px_rgba(15,34,64,0.04)]">
          💬{' '}
          <a
            href="mailto:hola@inclua.com.ar"
            className="hover:text-[#1e3a5f] hover:underline"
          >
            hola@inclua.com.ar
          </a>
        </div>
      </div>

      <figure className="rounded-[20px] bg-[#fef3c7] p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1e3a5f] font-serif text-lg font-bold text-white">
            C
          </div>
          <div>
            <p className="font-serif font-bold text-[#1e3a5f]">Carlos M.</p>
            <p className="text-xs text-[#5c6b7f]">
              Maestro integrador · Buenos Aires
            </p>
          </div>
        </div>
        <blockquote className="mt-4 font-serif text-lg leading-snug text-[#1a2332] sm:text-xl">
          &ldquo;Desde que uso IncluIA, planificar para Joaquín dejó de ser un
          problema. Ahora es mi parte favorita de la semana.&rdquo;
        </blockquote>
      </figure>

      {esPro && perfil.plan_activo_hasta && (
        <p className="text-center text-sm text-[#5c6b7f]">
          Tu plan Pro está activo hasta el{' '}
          <strong className="text-[#1e3a5f]">
            {new Date(perfil.plan_activo_hasta).toLocaleDateString('es-AR', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })}
          </strong>
        </p>
      )}
    </div>
  );
}

function PlanCard({
  title,
  price,
  period,
  subtitle,
  features,
  cta,
  highlighted = false,
  badge,
  current = false,
}: {
  title: string;
  price: string;
  period: string;
  subtitle?: string;
  features: string[];
  cta: React.ReactNode;
  highlighted?: boolean;
  badge?: string;
  current?: boolean;
}) {
  return (
    <article
      className={cn(
        'relative flex flex-col rounded-[20px] border p-7 transition',
        highlighted
          ? 'border-2 border-[#1e3a5f] bg-[#1e3a5f] text-white shadow-[0_10px_40px_rgba(15,34,64,0.2)]'
          : 'border-[#e2e8f0] bg-white shadow-[0_2px_12px_rgba(15,34,64,0.05)]'
      )}
    >
      {badge && (
        <span className="absolute -top-3 right-6 rounded-full bg-[#c2410c] px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
          {badge}
        </span>
      )}
      <p
        className={cn(
          'text-xs font-semibold uppercase tracking-wider',
          highlighted ? 'text-[#bbf7d0]' : 'text-[#5c6b7f]'
        )}
      >
        {title}
      </p>
      <p
        className={cn(
          'mt-3 font-serif text-5xl font-extrabold',
          highlighted ? 'text-white' : 'text-[#1e3a5f]'
        )}
      >
        {price}
        <span
          className={cn(
            'ml-1 text-base font-normal',
            highlighted ? 'text-white/75' : 'text-[#5c6b7f]'
          )}
        >
          /{period.includes('mes') ? 'mes' : 'siempre'}
        </span>
      </p>
      <p
        className={cn(
          'mt-1 text-sm',
          highlighted ? 'text-white/75' : 'text-[#5c6b7f]'
        )}
      >
        {subtitle ?? period}
      </p>

      <ul className="mt-6 flex flex-col gap-2.5 text-sm">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <span
              aria-hidden
              className={cn(
                'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                highlighted
                  ? 'bg-[#15803d] text-white'
                  : 'bg-[#dcfce7] text-[#15803d]'
              )}
            >
              ✓
            </span>
            <span className={highlighted ? 'text-white/95' : 'text-[#1a2332]'}>
              {f}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-7">{cta}</div>
      {current && !highlighted && (
        <p className="mt-3 text-center text-xs font-semibold text-[#15803d]">
          Plan actual ✓
        </p>
      )}
    </article>
  );
}

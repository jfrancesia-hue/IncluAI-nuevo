import Image from 'next/image';
import Link from 'next/link';
import { getPerfil } from '@/lib/auth';
import { LIMITES_PLAN, type PlanPago } from '@/lib/types';
import { UpgradeButton } from '@/components/module/upgrade-button';
import { PHOTOS } from '@/lib/photos';
import { cn } from '@/lib/utils';

export const metadata = { title: 'Elegí tu plan · IncluAI' };

type SearchParams = Promise<{ status?: string }>;

const FEATURES_FREE = [
  '1 guía por mes',
  'Guía guardada para siempre',
  'Todos los niveles educativos',
  'Todas las discapacidades',
  'IA avanzada (estándar)',
];

const FEATURES_BASICO = [
  '20 guías por mes',
  '2 PPIs por ciclo lectivo',
  'Historial completo',
  'Exportar a PDF',
  'IA avanzada (estándar)',
  'Soporte por email',
];

const FEATURES_PROFESIONAL = [
  '40 guías por mes',
  '3 PPIs por ciclo lectivo',
  'Historial completo',
  'Exportar a PDF',
  'Guías favoritas',
  'IA avanzada (estándar)',
  'Soporte prioritario',
];

const FEATURES_PREMIUM = [
  '10 guías de máxima profundidad',
  '5 PPIs por ciclo lectivo',
  'IA de máxima potencia',
  'Historial completo',
  'Exportar a PDF',
  'Guías favoritas',
  'Soporte prioritario premium',
];

export default async function PlanesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const [perfil, sp] = await Promise.all([getPerfil(), searchParams]);
  if (!perfil) return null;

  const esPago = perfil.plan !== 'free';
  const status = sp.status;

  return (
    <div className="flex flex-col gap-8">
      <header className="text-center">
        <h1 className="font-serif text-3xl font-bold text-[#2E86C1] sm:text-4xl">
          Elegí el plan que se adapta a vos
        </h1>
        <p className="mt-2 text-base text-[#4A5968]">
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

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <PlanCard
          title="Para empezar"
          price="$0"
          period="gratuito"
          features={FEATURES_FREE}
          current={perfil.plan === 'free'}
          cta={
            perfil.plan === 'free' ? (
              <span className="text-sm font-semibold text-[#27AE60]">
                Tu plan actual ✓
              </span>
            ) : (
              <Link
                href="/inicio"
                className="text-sm font-semibold text-[#27AE60] hover:underline"
              >
                Seguir generando →
              </Link>
            )
          }
        />

        <PlanCard
          title="Básico"
          price={`$${LIMITES_PLAN.basico.precio_ars.toLocaleString('es-AR')}`}
          period="por mes"
          subtitle="Para docentes que recién arrancan"
          features={FEATURES_BASICO}
          current={perfil.plan === 'basico'}
          cta={
            perfil.plan === 'basico' ? (
              <span className="inline-flex items-center gap-2 text-sm font-bold text-[#27AE60]">
                Tu plan actual ✓
              </span>
            ) : (
              <UpgradeButton plan="basico">
                Suscribirme
              </UpgradeButton>
            )
          }
        />

        <PlanCard
          title="Profesional"
          price={`$${LIMITES_PLAN.profesional.precio_ars.toLocaleString('es-AR')}`}
          period="por mes"
          subtitle="El más elegido"
          highlighted
          badge="Más elegido"
          features={FEATURES_PROFESIONAL}
          current={perfil.plan === 'profesional'}
          cta={
            perfil.plan === 'profesional' ? (
              <span className="inline-flex items-center gap-2 text-sm font-bold text-white">
                Tu plan actual ✓
              </span>
            ) : (
              <UpgradeButton plan="profesional">
                Suscribirme
              </UpgradeButton>
            )
          }
        />

        <PlanCard
          title="Premium"
          price={`$${LIMITES_PLAN.premium.precio_ars.toLocaleString('es-AR')}`}
          period="por mes"
          subtitle="Máxima potencia de IA"
          badge="IA Premium"
          badgeTone="gold"
          features={FEATURES_PREMIUM}
          current={perfil.plan === 'premium'}
          cta={
            perfil.plan === 'premium' ? (
              <span className="inline-flex items-center gap-2 text-sm font-bold text-[#27AE60]">
                Tu plan actual ✓
              </span>
            ) : (
              <UpgradeButton plan="premium">
                Suscribirme
              </UpgradeButton>
            )
          }
        />
      </div>

      <div className="grid grid-cols-1 gap-3 text-center text-xs text-[#4A5968] sm:grid-cols-3">
        <div className="rounded-[12px] bg-white p-3 shadow-[0_2px_6px_rgba(15,34,64,0.04)]">
          🔒 Pago seguro con Mercado Pago
        </div>
        <div className="rounded-[12px] bg-white p-3 shadow-[0_2px_6px_rgba(15,34,64,0.04)]">
          ❌ Cancelá cuando quieras
        </div>
        <div className="rounded-[12px] bg-white p-3 shadow-[0_2px_6px_rgba(15,34,64,0.04)]">
          💬{' '}
          <a
            href="mailto:hola@incluai.com.ar"
            className="hover:text-[#2E86C1] hover:underline"
          >
            hola@incluai.com.ar
          </a>
        </div>
      </div>

      <figure className="rounded-[20px] bg-[#fef3c7] p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#2E86C1] font-serif text-lg font-bold text-white">
            C
          </div>
          <div>
            <p className="font-serif font-bold text-[#2E86C1]">Carlos M.</p>
            <p className="text-xs text-[#4A5968]">
              Maestro integrador · Buenos Aires
            </p>
          </div>
        </div>
        <blockquote className="mt-4 font-serif text-lg leading-snug text-[#1F2E3D] sm:text-xl">
          &ldquo;Desde que uso IncluAI, planificar para Joaquín dejó de ser un
          problema. Ahora es mi parte favorita de la semana.&rdquo;
        </blockquote>
      </figure>

      {esPago && perfil.plan_activo_hasta && (
        <p className="text-center text-sm text-[#4A5968]">
          Tu plan {nombrePlanHumano(perfil.plan as PlanPago)} está activo hasta el{' '}
          <strong className="text-[#2E86C1]">
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

function nombrePlanHumano(plan: PlanPago): string {
  if (plan === 'basico') return 'Básico';
  if (plan === 'profesional') return 'Profesional';
  return 'Premium';
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
  badgeTone = 'orange',
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
  badgeTone?: 'orange' | 'gold';
  current?: boolean;
}) {
  return (
    <article
      className={cn(
        'relative flex flex-col rounded-[20px] border p-6 transition',
        highlighted
          ? 'border-2 border-[#2E86C1] bg-[#2E86C1] text-white shadow-[0_10px_40px_rgba(15,34,64,0.2)]'
          : 'border-[#e2e8f0] bg-white shadow-[0_2px_12px_rgba(15,34,64,0.05)]'
      )}
    >
      {badge && (
        <span
          className={cn(
            'absolute -top-3 right-6 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider text-white',
            badgeTone === 'gold' ? 'bg-[#b45309]' : 'bg-[#E67E22]'
          )}
        >
          {badge}
        </span>
      )}
      <p
        className={cn(
          'text-xs font-semibold uppercase tracking-wider',
          highlighted ? 'text-[#D6F0E0]' : 'text-[#4A5968]'
        )}
      >
        {title}
      </p>
      <p
        className={cn(
          'mt-3 font-serif text-4xl font-extrabold',
          highlighted ? 'text-white' : 'text-[#2E86C1]'
        )}
      >
        {price}
        <span
          className={cn(
            'ml-1 text-sm font-normal',
            highlighted ? 'text-white/75' : 'text-[#4A5968]'
          )}
        >
          /{period.includes('mes') ? 'mes' : 'siempre'}
        </span>
      </p>
      <p
        className={cn(
          'mt-1 text-sm',
          highlighted ? 'text-white/75' : 'text-[#4A5968]'
        )}
      >
        {subtitle ?? period}
      </p>

      <ul className="mt-5 flex flex-1 flex-col gap-2 text-sm">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <span
              aria-hidden
              className={cn(
                'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                highlighted
                  ? 'bg-[#27AE60] text-white'
                  : 'bg-[#D6F0E0] text-[#27AE60]'
              )}
            >
              ✓
            </span>
            <span className={highlighted ? 'text-white/95' : 'text-[#1F2E3D]'}>
              {f}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-6">{cta}</div>
      {current && !highlighted && (
        <p className="mt-3 text-center text-xs font-semibold text-[#27AE60]">
          Plan actual ✓
        </p>
      )}
    </article>
  );
}

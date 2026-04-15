import Link from 'next/link';
import { getPerfil } from '@/lib/auth';
import { LIMITES_PLAN } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { UpgradeButton } from '@/components/dashboard/upgrade-button';
import { cn } from '@/lib/utils';

export const metadata = { title: 'Planes · IncluIA' };

type SearchParams = Promise<{ status?: string }>;

const FEATURES_FREE = [
  '2 guías por mes',
  'Todos los niveles educativos',
  'Todas las discapacidades',
  'Copiar texto de la guía',
];

const FEATURES_PRO = [
  '40 guías por mes',
  'Historial completo y favoritos',
  'Exportar a PDF',
  'Soporte prioritario',
  'Actualizaciones tempranas',
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
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-3xl text-primary">Elegí tu plan</h1>
        <p className="text-muted">Cambiá de plan cuando quieras. Sin permanencia.</p>
      </header>

      {status === 'error' && (
        <Alert variant="error">
          El pago no pudo completarse. Probá de nuevo o usá otro medio.
        </Alert>
      )}
      {status === 'pendiente' && (
        <Alert variant="info">
          Tu pago está pendiente de acreditación. Te avisamos cuando se confirme.
        </Alert>
      )}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <PlanCard
          title="Gratuito"
          price="$0"
          period="para siempre"
          features={FEATURES_FREE}
          current={perfil.plan === 'free'}
          cta={
            perfil.plan === 'free' ? (
              <span className="text-sm text-muted">Tu plan actual</span>
            ) : (
              <Link href="/inicio" className="text-sm text-accent hover:underline">
                Seguir generando →
              </Link>
            )
          }
        />

        <PlanCard
          title="Profesional"
          price={`$${LIMITES_PLAN.pro.precio_ars.toLocaleString('es-AR')}`}
          period="por mes"
          highlighted
          badge="Más elegido"
          features={FEATURES_PRO}
          current={perfil.plan === 'pro'}
          cta={
            perfil.plan === 'pro' ? (
              <span className="text-sm font-medium text-accent">Plan actual ✓</span>
            ) : (
              <UpgradeButton plan="pro">Suscribirme con Mercado Pago</UpgradeButton>
            )
          }
        />
      </div>

      {esPro && perfil.plan_activo_hasta && (
        <p className="text-center text-sm text-muted">
          Tu plan Pro está activo hasta el{' '}
          <strong className="text-primary">
            {new Date(perfil.plan_activo_hasta).toLocaleDateString('es-AR')}
          </strong>
        </p>
      )}

      <p className="text-center text-xs text-muted">
        ¿Tenés dudas? Escribinos a{' '}
        <a href="mailto:soporte@inclua.com.ar" className="text-accent hover:underline">
          soporte@inclua.com.ar
        </a>
      </p>
    </div>
  );
}

function PlanCard({
  title,
  price,
  period,
  features,
  cta,
  highlighted = false,
  badge,
  current = false,
}: {
  title: string;
  price: string;
  period: string;
  features: string[];
  cta: React.ReactNode;
  highlighted?: boolean;
  badge?: string;
  current?: boolean;
}) {
  return (
    <Card
      className={cn(
        'relative overflow-hidden',
        highlighted && 'border-primary bg-primary text-white'
      )}
    >
      {badge && (
        <span className="absolute right-4 top-4 rounded-full bg-cta px-2.5 py-0.5 text-xs font-semibold text-white">
          {badge}
        </span>
      )}
      <CardContent className="flex flex-col gap-4 p-6">
        <div>
          <p className={cn('text-sm uppercase tracking-wide', highlighted ? 'text-white/75' : 'text-muted')}>
            {title}
          </p>
          <p className="mt-2 font-serif text-4xl font-bold">
            {price}
            <span className={cn('ml-1 text-sm font-normal', highlighted ? 'text-white/75' : 'text-muted')}>
              {period}
            </span>
          </p>
        </div>

        <ul className="flex flex-col gap-2 text-sm">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-2">
              <span className={cn('mt-0.5', highlighted ? 'text-white' : 'text-accent')}>
                ✓
              </span>
              <span className={cn(highlighted ? 'text-white/95' : 'text-foreground')}>
                {f}
              </span>
            </li>
          ))}
        </ul>

        <div className="pt-2">{cta}</div>
        {current && !highlighted && (
          <span className="text-xs text-accent">Plan actual ✓</span>
        )}
      </CardContent>
    </Card>
  );
}

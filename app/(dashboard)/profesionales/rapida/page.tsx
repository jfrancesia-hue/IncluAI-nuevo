import { RapidaWizard } from '@/components/wizards/rapida-wizard';
import { checkPlanLimits } from '@/lib/plan';
import Link from 'next/link';
import { Alert } from '@/components/ui/alert';
import { PageShell } from '@/components/ui/PageShell';

export const metadata = { title: 'Consulta rápida · IncluAI' };

export default async function RapidaPage() {
  const plan = await checkPlanLimits();

  if (!plan.permitido) {
    return (
      <PageShell
        eyebrow="⚡ Consulta rápida"
        title="Sin guías disponibles"
        decoration="soft"
        tone="profesionales"
      >
        <Alert variant="error">
          Alcanzaste tu límite mensual.{' '}
          <Link href="/planes" className="font-semibold underline">
            Ver planes
          </Link>
        </Alert>
      </PageShell>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <PageShell
        eyebrow="⚡ Consulta rápida"
        title={
          <>
            Respuesta en{' '}
            <span className="gradient-text">10 segundos</span>
          </>
        }
        subtitle="Para cuando tenés al paciente en la silla y necesitás orientación AHORA. Escribí tu situación en una oración."
        decoration="soft"
        tone="profesionales"
        revealChildren={false}
      >
        <RapidaWizard />
      </PageShell>
    </div>
  );
}

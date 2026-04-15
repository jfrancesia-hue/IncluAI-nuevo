import { RapidaWizard } from '@/components/dashboard/rapida-wizard';
import { checkPlanLimits } from '@/lib/plan';
import Link from 'next/link';
import { Alert } from '@/components/ui/alert';

export const metadata = { title: 'Consulta rápida · IncluIA' };

export default async function RapidaPage() {
  const plan = await checkPlanLimits();

  if (!plan.permitido) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl text-primary">Consulta rápida</h1>
        <Alert variant="error">
          Alcanzaste tu límite mensual.{' '}
          <Link href="/planes" className="font-medium underline">Ver planes</Link>
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <header>
        <span className="inline-flex items-center gap-2 rounded-full bg-cta/10 px-3 py-1 text-xs font-medium text-cta">
          ⚡ Consulta rápida
        </span>
        <h1 className="mt-2 text-3xl text-primary">Respuesta en 10 segundos</h1>
        <p className="text-sm text-muted">
          Para cuando tenés al paciente en la silla y necesitás orientación AHORA.
          Escribí tu situación en una oración.
        </p>
      </header>
      <RapidaWizard />
    </div>
  );
}

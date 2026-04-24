import { RapidaWizard } from '@/components/wizards/rapida-wizard';
import { checkPlanLimits } from '@/lib/plan';
import Link from 'next/link';
import { Alert } from '@/components/ui/alert';

export const metadata = { title: 'Consulta rápida · IncluAI' };

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
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <header className="flex flex-col items-start gap-3">
        <span className="inline-flex items-center gap-2 rounded-full bg-primary-bg px-3 py-1.5 text-xs font-semibold text-primary">
          ⚡ Consulta rápida
        </span>
        <h1 className="text-3xl font-bold text-primary sm:text-4xl">
          Respuesta en 10 segundos
        </h1>
        <p className="text-sm text-muted">
          Para cuando tenés al paciente en la silla y necesitás orientación
          AHORA. Escribí tu situación en una oración.
        </p>
      </header>
      <RapidaWizard />
    </div>
  );
}

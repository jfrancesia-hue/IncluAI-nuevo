import Link from 'next/link';
import { checkPlanLimits } from '@/lib/plan';
import { Alert } from '@/components/ui/alert';
import { FamiliaWizard } from '@/components/wizards/familia-wizard';

export const metadata = { title: 'Nueva guía (Familia) · IncluIA' };

export default async function NuevaConsultaFamiliaPage() {
  const plan = await checkPlanLimits();

  if (!plan.permitido) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl text-primary">Nueva guía — Familia</h1>
        <Alert variant="error">
          {plan.planVencido ? 'Tu plan Pro venció. ' : 'Usaste todas las guías de este mes. '}
          <Link href="/planes" className="font-medium underline">Ver planes</Link>
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <header>
        <span className="inline-flex items-center gap-2 rounded-full bg-accent-light px-3 py-1 text-xs font-medium text-accent">
          🏠 Módulo Familia
        </span>
        <h1 className="mt-2 text-3xl text-primary">¿En qué te ayudamos con tu hijo/a?</h1>
        <p className="text-sm text-muted">
          Guías restantes este mes:{' '}
          <strong className="text-primary">
            {plan.consultasRestantes} / {plan.limite}
          </strong>
        </p>
      </header>
      <FamiliaWizard />
    </div>
  );
}

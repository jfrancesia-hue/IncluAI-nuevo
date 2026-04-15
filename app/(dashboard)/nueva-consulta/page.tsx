import { ConsultaWizard } from '@/components/wizards/docente-wizard';
import { checkPlanLimits } from '@/lib/plan';
import { Alert } from '@/components/ui/alert';
import Link from 'next/link';

export const metadata = { title: 'Nueva consulta · IncluIA' };

export default async function NuevaConsultaPage() {
  const plan = await checkPlanLimits();

  if (!plan.permitido) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl text-primary">Nueva consulta</h1>
        <Alert variant="error">
          {plan.planVencido
            ? 'Tu plan Pro venció. '
            : 'Usaste todas las guías de este mes. '}
          <Link href="/planes" className="font-medium underline">
            Ver planes
          </Link>
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-primary">Nueva consulta</h1>
          <p className="text-sm text-muted">
            Guías restantes este mes:{' '}
            <strong className="text-primary">
              {plan.consultasRestantes} / {plan.limite}
            </strong>
          </p>
        </div>
      </header>
      <ConsultaWizard />
    </div>
  );
}

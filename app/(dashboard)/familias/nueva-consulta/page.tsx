import Link from 'next/link';
import { checkPlanLimits } from '@/lib/plan';
import { Alert } from '@/components/ui/alert';
import { FamiliaWizard } from '@/components/wizards/familia-wizard';
import { PageShell } from '@/components/ui/PageShell';

export const metadata = { title: 'Nueva guía (Familia) · IncluAI' };

export default async function NuevaConsultaFamiliaPage() {
  const plan = await checkPlanLimits();

  if (!plan.permitido) {
    return (
      <PageShell
        eyebrow="🏠 Módulo familia"
        title="Sin guías disponibles"
        decoration="soft"
        tone="familias"
      >
        <Alert variant="error">
          {plan.planVencido
            ? 'Tu plan venció. '
            : 'Usaste todas las guías de este mes. '}
          <Link href="/planes" className="font-semibold underline">
            Ver planes
          </Link>
        </Alert>
      </PageShell>
    );
  }

  return (
    <PageShell
      eyebrow="🏠 Módulo familia"
      title={
        <>
          ¿En qué te ayudamos con{' '}
          <span className="gradient-text">tu hijo/a?</span>
        </>
      }
      subtitle={
        <>
          Te quedan{' '}
          <strong className="text-[#27AE60]">
            {plan.consultasRestantes} de {plan.limite}
          </strong>{' '}
          guías este mes.
        </>
      }
      decoration="mesh"
      tone="familias"
      revealChildren={false}
    >
      <FamiliaWizard />
    </PageShell>
  );
}

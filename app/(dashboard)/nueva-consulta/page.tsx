import { ConsultaWizard } from '@/components/wizards/docente-wizard';
import { checkPlanLimits } from '@/lib/plan';
import { Alert } from '@/components/ui/alert';
import Link from 'next/link';
import { PageShell } from '@/components/ui/PageShell';

export const metadata = { title: 'Nueva consulta · IncluAI' };

export default async function NuevaConsultaPage() {
  const plan = await checkPlanLimits();

  if (!plan.permitido) {
    return (
      <PageShell
        eyebrow="📚 Nueva guía"
        title="Sin guías disponibles"
        decoration="soft"
        tone="docentes"
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
      eyebrow="📚 Nueva guía — Docente"
      title={
        <>
          Generá tu próxima{' '}
          <span className="gradient-text">guía inclusiva</span>
        </>
      }
      subtitle={
        <>
          Te quedan{' '}
          <strong className="text-[#27AE60]">
            {plan.consultasRestantes} de {plan.limite}
          </strong>{' '}
          guías este mes. Completá los 3 pasos.
        </>
      }
      decoration="mesh"
      tone="docentes"
      revealChildren={false}
    >
      <ConsultaWizard />
    </PageShell>
  );
}

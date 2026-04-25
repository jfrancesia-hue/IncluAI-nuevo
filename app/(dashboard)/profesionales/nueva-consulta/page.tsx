import Link from 'next/link';
import { checkPlanLimits } from '@/lib/plan';
import { getPerfil } from '@/lib/auth';
import { Alert } from '@/components/ui/alert';
import { ProfesionalWizard } from '@/components/wizards/profesional-wizard';
import type { EspecialidadProfesional } from '@/lib/types';
import { ESPECIALIDADES } from '@/data/especialidades';
import { PageShell } from '@/components/ui/PageShell';

export const metadata = { title: 'Nueva guía (Profesional) · IncluAI' };

export default async function NuevaConsultaProfesionalPage() {
  const [plan, perfil] = await Promise.all([checkPlanLimits(), getPerfil()]);

  if (!plan.permitido) {
    return (
      <PageShell
        eyebrow="⚕️ Módulo profesional"
        title="Sin guías disponibles"
        decoration="soft"
        tone="profesionales"
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

  const defaultEsp =
    perfil?.especialidad &&
    ESPECIALIDADES.some((e) => e.id === perfil.especialidad)
      ? (perfil.especialidad as EspecialidadProfesional)
      : undefined;

  return (
    <PageShell
      eyebrow="⚕️ Módulo profesional"
      title={
        <>
          Guía clínica{' '}
          <span className="gradient-text">adaptada</span>
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
      tone="profesionales"
      revealChildren={false}
    >
      <ProfesionalWizard especialidadDefault={defaultEsp} />
    </PageShell>
  );
}

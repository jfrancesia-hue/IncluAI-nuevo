import Link from 'next/link';
import { checkPlanLimits } from '@/lib/plan';
import { getPerfil } from '@/lib/auth';
import { Alert } from '@/components/ui/alert';
import { ProfesionalWizard } from '@/components/dashboard/profesional-wizard';
import type { EspecialidadProfesional } from '@/lib/types';
import { ESPECIALIDADES } from '@/data/especialidades';

export const metadata = { title: 'Nueva guía (Profesional) · IncluIA' };

export default async function NuevaConsultaProfesionalPage() {
  const [plan, perfil] = await Promise.all([checkPlanLimits(), getPerfil()]);

  if (!plan.permitido) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl text-primary">Nueva guía — Profesional</h1>
        <Alert variant="error">
          {plan.planVencido ? 'Tu plan Pro venció. ' : 'Usaste todas las guías de este mes. '}
          <Link href="/planes" className="font-medium underline">Ver planes</Link>
        </Alert>
      </div>
    );
  }

  const defaultEsp =
    perfil?.especialidad &&
    ESPECIALIDADES.some((e) => e.id === perfil.especialidad)
      ? (perfil.especialidad as EspecialidadProfesional)
      : undefined;

  return (
    <div className="flex flex-col gap-6">
      <header>
        <span className="inline-flex items-center gap-2 rounded-full bg-primary-bg px-3 py-1 text-xs font-medium text-primary">
          ⚕️ Módulo Profesional
        </span>
        <h1 className="mt-2 text-3xl text-primary">Guía clínica adaptada</h1>
        <p className="text-sm text-muted">
          Guías restantes este mes:{' '}
          <strong className="text-primary">
            {plan.consultasRestantes} / {plan.limite}
          </strong>
        </p>
      </header>
      <ProfesionalWizard especialidadDefault={defaultEsp} />
    </div>
  );
}

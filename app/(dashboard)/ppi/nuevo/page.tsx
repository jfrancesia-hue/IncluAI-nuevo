import { redirect } from 'next/navigation';
import { checkPPILimit } from '@/lib/ppi/plan-limits';
import { DISCAPACIDADES } from '@/data/discapacidades';
import { JURISDICCIONES_PPI } from '@/data/jurisdicciones-ar';
import { PPIWizard } from '@/components/ppi/PPIWizard';
import { cicloLectivoActual } from '@/lib/types/ppi';
import { PageShell } from '@/components/ui/PageShell';

export const dynamic = 'force-dynamic';

export default async function NuevoPPIPage() {
  const limit = await checkPPILimit();

  if (!limit.permitido && limit.razon !== 'sin_sesion') {
    redirect('/ppi?upgrade=1');
  }

  return (
    <PageShell
      eyebrow="📋 Nuevo PPI"
      title={
        <>
          Creá un{' '}
          <span className="gradient-text">PPI completo</span>
        </>
      }
      subtitle="Completá los 4 pasos. IncluAI genera el documento en unos minutos — después lo revisás y editás sección por sección."
      decoration="mesh"
      tone="docentes"
    >
      <PPIWizard
        discapacidades={DISCAPACIDADES.map((d) => ({
          id: d.id,
          label: d.label,
        }))}
        jurisdicciones={JURISDICCIONES_PPI.map((j) => ({
          id: j.id,
          nombre: j.nombre,
        }))}
        cicloLectivoDefault={cicloLectivoActual()}
      />
    </PageShell>
  );
}

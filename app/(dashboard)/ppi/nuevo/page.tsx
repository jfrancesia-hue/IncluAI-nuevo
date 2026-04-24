import { redirect } from 'next/navigation'
import { checkPPILimit } from '@/lib/ppi/plan-limits'
import { DISCAPACIDADES } from '@/data/discapacidades'
import { JURISDICCIONES_PPI } from '@/data/jurisdicciones-ar'
import { PPIWizard } from '@/components/ppi/PPIWizard'
import { cicloLectivoActual } from '@/lib/types/ppi'

export const dynamic = 'force-dynamic'

export default async function NuevoPPIPage() {
  const limit = await checkPPILimit()

  if (!limit.permitido && limit.razon !== 'sin_sesion') {
    redirect('/ppi?upgrade=1')
  }

  return (
    <main style={{ maxWidth: 780, margin: '0 auto', padding: '32px 24px' }}>
      <header style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, margin: '0 0 4px', color: '#042C53' }}>
          Nuevo PPI
        </h1>
        <p style={{ color: '#5c6b7f', fontSize: 14, margin: 0 }}>
          Completá los 4 pasos. IncluAI genera el documento en unos minutos — después lo revisás y
          editás sección por sección.
        </p>
      </header>

      <PPIWizard
        discapacidades={DISCAPACIDADES.map((d) => ({ id: d.id, label: d.label }))}
        jurisdicciones={JURISDICCIONES_PPI.map((j) => ({ id: j.id, nombre: j.nombre }))}
        cicloLectivoDefault={cicloLectivoActual()}
      />
    </main>
  )
}

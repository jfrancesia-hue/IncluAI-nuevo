import { notFound } from 'next/navigation'
import Link from 'next/link'
import { PPIWizard } from '@/components/ppi/PPIWizard'
import { DISCAPACIDADES } from '@/data/discapacidades'
import { JURISDICCIONES_PPI } from '@/data/jurisdicciones-ar'
import { cicloLectivoActual } from '@/lib/types/ppi'

export const dynamic = 'force-dynamic'

export default function PPIDemoPage() {
  if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_ENABLE_DEMO !== '1') {
    notFound()
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #D7EAF6, #f9f7f0)',
        padding: '32px 24px',
      }}
    >
      <div style={{ maxWidth: 780, margin: '0 auto' }}>
        <div
          style={{
            background: '#fef3c7',
            color: '#854f0b',
            padding: '10px 14px',
            borderRadius: 8,
            marginBottom: 16,
            fontSize: 13,
          }}
        >
          💡 Vista demo del wizard PPI. No se guarda nada — andá a{' '}
          <Link href="/ppi-demo/ejemplo" style={{ color: '#854f0b', fontWeight: 700 }}>
            ver un PPI ejemplo ya generado →
          </Link>
        </div>

        <header style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, margin: '0 0 4px', color: '#042C53' }}>
            Nuevo PPI
          </h1>
          <p style={{ color: '#4A5968', fontSize: 14, margin: 0 }}>
            Completá los 4 pasos. IncluAI genera el documento en unos minutos — después lo revisás
            y editás sección por sección.
          </p>
        </header>

        <PPIWizard
          discapacidades={DISCAPACIDADES.map((d) => ({ id: d.id, label: d.label }))}
          jurisdicciones={JURISDICCIONES_PPI.map((j) => ({ id: j.id, nombre: j.nombre }))}
          cicloLectivoDefault={cicloLectivoActual()}
        />
      </div>
    </main>
  )
}

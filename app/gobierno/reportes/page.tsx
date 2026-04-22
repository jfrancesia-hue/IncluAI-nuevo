import { ReporteForm } from '@/components/gov/ReporteForm'

export const dynamic = 'force-dynamic'

export default function ReportesPage() {
  return (
    <>
      <h1 className="gov-page-title">Generador de reportes</h1>
      <p className="gov-page-subtitle">
        Exportá un reporte agregado listo para prensa, Concejo Deliberante o investigadores
        académicos. Todo se registra en la bitácora de auditoría.
      </p>

      <section className="gov-card">
        <h2 className="gov-card__title">Nuevo reporte</h2>
        <ReporteForm />
      </section>
    </>
  )
}

import type { DashboardKPI } from '@/lib/types/gobierno'

function formatValue(v: DashboardKPI['value'], format?: DashboardKPI['format']): string {
  if (typeof v === 'string') return v
  switch (format) {
    case 'percent':
      return `${v}%`
    case 'hours':
      return `${v} h`
    case 'currency':
      return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        maximumFractionDigits: 0,
      }).format(v)
    default:
      return new Intl.NumberFormat('es-AR').format(v)
  }
}

export function KpiCard({ kpi }: { kpi: DashboardKPI }) {
  return (
    <article className="gov-kpi" aria-labelledby={`kpi-${kpi.id}-label`}>
      <div id={`kpi-${kpi.id}-label`} className="gov-kpi__label">
        {kpi.label}
      </div>
      <div className="gov-kpi__value" aria-live="polite">
        {formatValue(kpi.value, kpi.format)}
      </div>
      {typeof kpi.delta === 'number' && (
        <div
          className={
            kpi.delta >= 0 ? 'gov-kpi__delta gov-kpi__delta--up' : 'gov-kpi__delta gov-kpi__delta--down'
          }
        >
          {kpi.delta >= 0 ? '▲' : '▼'} {Math.abs(kpi.delta)}%
        </div>
      )}
    </article>
  )
}

export function KpiGrid({ kpis }: { kpis: DashboardKPI[] }) {
  return (
    <section className="gov-kpi-grid" aria-label="Indicadores principales">
      {kpis.map((kpi) => (
        <KpiCard key={kpi.id} kpi={kpi} />
      ))}
    </section>
  )
}

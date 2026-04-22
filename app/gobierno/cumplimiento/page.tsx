import { createClient } from '@/lib/supabase/server'
import { getComplianceMetrics } from '@/lib/gov/metrics'

export const dynamic = 'force-dynamic'

const NORMATIVA = [
  {
    key: 'cfe_311_16_score' as const,
    label: 'Resolución CFE 311/16',
    descripcion: 'Trayectorias educativas integrales de estudiantes con discapacidad.',
  },
  {
    key: 'wcag_21_aa_score' as const,
    label: 'WCAG 2.1 AA',
    descripcion: 'Accesibilidad web — perceptible, operable, comprensible, robusto.',
  },
  {
    key: 'ley_25326_score' as const,
    label: 'Ley 25.326',
    descripcion: 'Protección de datos personales, con foco en consentimiento de menores.',
  },
  {
    key: 'ley_26653_score' as const,
    label: 'Ley 26.653',
    descripcion: 'Accesibilidad de información en páginas web del sector público.',
  },
  {
    key: 'iso_27001_readiness' as const,
    label: 'ISO 27001 (readiness)',
    descripcion: 'Gestión de seguridad de la información — roadmap 12 meses.',
  },
]

export default async function CumplimientoPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data: govUser } = await supabase
    .from('gov_users')
    .select('jurisdiction_id')
    .eq('user_id', user.id)
    .single()
  if (!govUser) return null

  const c = await getComplianceMetrics(supabase as never, govUser.jurisdiction_id)

  return (
    <>
      <h1 className="gov-page-title">Cumplimiento normativo</h1>
      <p className="gov-page-subtitle">
        Evaluación automática contra el marco normativo aplicable. La documentación de respaldo
        vive en <code>/compliance/</code> del repositorio.
      </p>

      <section className="gov-card">
        <h2 className="gov-card__title">Checklist normativo</h2>
        <table className="gov-table">
          <thead>
            <tr>
              <th scope="col">Norma</th>
              <th scope="col">Alcance</th>
              <th scope="col">Score</th>
              <th scope="col">Estado</th>
            </tr>
          </thead>
          <tbody>
            {NORMATIVA.map((n) => {
              const score = c[n.key]
              const badge =
                score >= 90 ? 'gov-badge--ok' : score >= 70 ? 'gov-badge--warn' : 'gov-badge--crit'
              const label = score >= 90 ? 'Conforme' : score >= 70 ? 'Parcial' : 'Incumplido'
              return (
                <tr key={n.key}>
                  <td style={{ fontWeight: 500 }}>{n.label}</td>
                  <td style={{ color: 'var(--gov-text-muted)' }}>{n.descripcion}</td>
                  <td>{score}%</td>
                  <td>
                    <span className={`gov-badge ${badge}`}>{label}</span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </section>
    </>
  )
}

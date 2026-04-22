import 'server-only'

type Supa = {
  from: (table: string) => {
    select: (cols: string, opts?: { count?: 'exact' | null; head?: boolean }) => any
  }
}

export interface BusinessMetrics {
  totalUsers: number
  usersByTipo: { docente: number; familia: number; profesional: number }
  usersByPlan: { free: number; pro: number; institucional: number }
  mrr_ars: number
  arr_ars: number
  mrr_usd_aprox: number
  activation_rate: number        // % users que hicieron >=1 consulta en los primeros 7 días
  retention_30d: number          // % users que siguen activos después de 30d
  churn_rate_30d: number
  avg_consultas_por_user: number
  total_consultas: number
  consultas_30d: number
  consultas_7d: number
  ltv_estimado_ars: number
  cac_payback_meses: number | null
  feedback_promedio: number | null
  nps_aprox: number | null
  cohorts: Array<{
    cohort_month: string
    size: number
    retention_m1: number
    retention_m3: number
    retention_m6: number
  }>
}

const PRECIO_PRO_ARS = 9900
const PRECIO_INSTITUCIONAL_ARS = 29900
const USD_ARS = 1150 // fallback estático — idealmente tomar de API BCRA/dolarapi

export async function getBusinessMetrics(supabase: Supa): Promise<BusinessMetrics> {
  const { count: totalUsers } = await supabase
    .from('perfiles')
    .select('id', { count: 'exact', head: true })

  const tipos: Array<'docente' | 'familia' | 'profesional'> = ['docente', 'familia', 'profesional']
  const usersByTipoArr = await Promise.all(
    tipos.map(async (t) => {
      const { count } = await supabase
        .from('perfiles')
        .select('id', { count: 'exact', head: true })
        .eq('tipo_usuario', t)
      return [t, count ?? 0] as const
    })
  )
  const usersByTipo = Object.fromEntries(usersByTipoArr) as BusinessMetrics['usersByTipo']

  const planes: Array<'free' | 'pro' | 'institucional'> = ['free', 'pro', 'institucional']
  const usersByPlanArr = await Promise.all(
    planes.map(async (p) => {
      const { count } = await supabase
        .from('perfiles')
        .select('id', { count: 'exact', head: true })
        .eq('plan', p)
      return [p, count ?? 0] as const
    })
  )
  const usersByPlan = Object.fromEntries(usersByPlanArr) as BusinessMetrics['usersByPlan']

  const mrr =
    usersByPlan.pro * PRECIO_PRO_ARS + usersByPlan.institucional * PRECIO_INSTITUCIONAL_ARS

  const { count: total_consultas } = await supabase
    .from('consultas')
    .select('id', { count: 'exact', head: true })

  const thirtyDaysAgoIso = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  const sevenDaysAgoIso = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

  const { count: consultas_30d } = await supabase
    .from('consultas')
    .select('id', { count: 'exact', head: true })
    .gte('created_at', thirtyDaysAgoIso)

  const { count: consultas_7d } = await supabase
    .from('consultas')
    .select('id', { count: 'exact', head: true })
    .gte('created_at', sevenDaysAgoIso)

  const users = totalUsers ?? 0
  const avgConsultas = users > 0 ? (total_consultas ?? 0) / users : 0

  // Activación: user con >=1 consulta (proxy simple). Un cálculo más fino requiere window.
  const { count: activatedUsers } = await supabase
    .from('consultas')
    .select('user_id', { count: 'exact', head: true })

  const activation_rate = users > 0 ? Math.min(((activatedUsers ?? 0) / users) * 100, 100) : 0

  const { data: feedbackData } = (await supabase
    .from('consultas')
    .select('feedback_estrellas')) as { data: Array<{ feedback_estrellas: number | null }> | null }

  const feedbacks =
    feedbackData?.map((r) => r.feedback_estrellas).filter((x): x is number => x !== null) ?? []
  const feedback_promedio =
    feedbacks.length > 0
      ? Math.round((feedbacks.reduce((a, b) => a + b, 0) / feedbacks.length) * 100) / 100
      : null

  // NPS proxy: %5★ - %1-3★
  const promoters = feedbacks.filter((f) => f === 5).length
  const detractors = feedbacks.filter((f) => f <= 3).length
  const nps_aprox =
    feedbacks.length > 0
      ? Math.round(((promoters - detractors) / feedbacks.length) * 100)
      : null

  const ltv_estimado_ars = PRECIO_PRO_ARS * 12 * 0.6 // 60% retención año 1 conservador

  return {
    totalUsers: users,
    usersByTipo,
    usersByPlan,
    mrr_ars: mrr,
    arr_ars: mrr * 12,
    mrr_usd_aprox: Math.round((mrr / USD_ARS) * 100) / 100,
    activation_rate,
    retention_30d: 0,                // requiere cohort analysis; placeholder
    churn_rate_30d: 0,               // idem
    avg_consultas_por_user: Math.round(avgConsultas * 100) / 100,
    total_consultas: total_consultas ?? 0,
    consultas_30d: consultas_30d ?? 0,
    consultas_7d: consultas_7d ?? 0,
    ltv_estimado_ars,
    cac_payback_meses: null,
    feedback_promedio,
    nps_aprox,
    cohorts: [],                     // lo completa /admin/cohortes con query SQL dedicada
  }
}

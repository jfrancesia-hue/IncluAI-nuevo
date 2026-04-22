import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { LIMITES_PLAN, type PlanUsuario } from '@/lib/types'
import { cicloLectivoActual } from '@/lib/types/ppi'

export interface PPILimitCheck {
  permitido: boolean
  plan: PlanUsuario
  ppis_usados: number
  ppis_restantes: number
  limite: number
  ciclo_lectivo: string
  razon?: 'sin_sesion' | 'sin_perfil' | 'limite_alcanzado' | 'plan_vencido'
}

export async function checkPPILimit(): Promise<PPILimitCheck> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const ciclo = cicloLectivoActual()

  if (!user) {
    return {
      permitido: false,
      plan: 'free',
      ppis_usados: 0,
      ppis_restantes: 0,
      limite: LIMITES_PLAN.free.ppis_por_ciclo,
      ciclo_lectivo: ciclo,
      razon: 'sin_sesion',
    }
  }

  const { data: perfil } = await supabase
    .from('perfiles')
    .select('plan, plan_activo_hasta')
    .eq('id', user.id)
    .single<{ plan: PlanUsuario; plan_activo_hasta: string | null }>()

  if (!perfil) {
    return {
      permitido: false,
      plan: 'free',
      ppis_usados: 0,
      ppis_restantes: 0,
      limite: LIMITES_PLAN.free.ppis_por_ciclo,
      ciclo_lectivo: ciclo,
      razon: 'sin_perfil',
    }
  }

  let plan = perfil.plan
  let planVencido = false
  if (
    (plan === 'pro' || plan === 'institucional') &&
    perfil.plan_activo_hasta &&
    new Date(perfil.plan_activo_hasta) < new Date()
  ) {
    plan = 'free'
    planVencido = true
  }

  const { data: countRaw } = await supabase.rpc('ppis_en_ciclo', {
    p_user_id: user.id,
    p_ciclo: ciclo,
  })
  const ppis_usados = typeof countRaw === 'number' ? countRaw : 0

  const limite = LIMITES_PLAN[plan].ppis_por_ciclo
  const ppis_restantes = Math.max(0, limite - ppis_usados)
  const permitido = ppis_restantes > 0

  return {
    permitido,
    plan,
    ppis_usados,
    ppis_restantes,
    limite,
    ciclo_lectivo: ciclo,
    razon: permitido
      ? undefined
      : planVencido
        ? 'plan_vencido'
        : 'limite_alcanzado',
  }
}

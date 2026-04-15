import 'server-only';
import { createClient } from '@/lib/supabase/server';
import { LIMITES_PLAN, type PlanUsuario } from '@/lib/types';

export type PlanCheck = {
  permitido: boolean;
  plan: PlanUsuario;
  consultasMes: number;
  consultasRestantes: number;
  limite: number;
  planVencido: boolean;
  razon?: 'sin_sesion' | 'sin_perfil' | 'limite_alcanzado';
};

function mesActualISO(): string {
  const d = new Date();
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
}

export async function checkPlanLimits(): Promise<PlanCheck> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      permitido: false,
      plan: 'free',
      consultasMes: 0,
      consultasRestantes: 0,
      limite: LIMITES_PLAN.free.guias_por_mes,
      planVencido: false,
      razon: 'sin_sesion',
    };
  }

  const { data: perfil } = await supabase
    .from('perfiles')
    .select('plan, plan_activo_hasta, consultas_mes, mes_actual')
    .eq('id', user.id)
    .single<{
      plan: PlanUsuario;
      plan_activo_hasta: string | null;
      consultas_mes: number;
      mes_actual: string;
    }>();

  if (!perfil) {
    return {
      permitido: false,
      plan: 'free',
      consultasMes: 0,
      consultasRestantes: 0,
      limite: LIMITES_PLAN.free.guias_por_mes,
      planVencido: false,
      razon: 'sin_perfil',
    };
  }

  let plan = perfil.plan;
  let planVencido = false;
  if (
    (plan === 'pro' || plan === 'institucional') &&
    perfil.plan_activo_hasta &&
    new Date(perfil.plan_activo_hasta) < new Date()
  ) {
    plan = 'free';
    planVencido = true;
  }

  const mesCorrecto = perfil.mes_actual === mesActualISO();
  const consultasMes = mesCorrecto ? perfil.consultas_mes : 0;
  const limite = LIMITES_PLAN[plan].guias_por_mes;
  const consultasRestantes = Math.max(0, limite - consultasMes);
  const permitido = consultasRestantes > 0;

  return {
    permitido,
    plan,
    consultasMes,
    consultasRestantes,
    limite,
    planVencido,
    razon: permitido ? undefined : 'limite_alcanzado',
  };
}

export async function incrementarConsultas(userId: string): Promise<number> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('incrementar_consultas', {
    p_user_id: userId,
  });
  if (error || typeof data !== 'number') {
    throw new Error(`No se pudo incrementar consultas: ${error?.message ?? 'respuesta inválida'}`);
  }
  return data;
}

import 'server-only';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { checkPlanLimits, type PlanCheck } from '@/lib/plan';
import { checkRateLimit } from '@/lib/rate-limit';

type Supabase = Awaited<ReturnType<typeof createClient>>;

export type GuardOK = {
  ok: true;
  user: { id: string; email?: string | null };
  supabase: Supabase;
  plan: PlanCheck;
};

export type GuardFail = {
  ok: false;
  response: NextResponse;
};

type GuardOptions = {
  /** Aplica chequeo de cupo mensual (plan free/pro). Default true. */
  checkPlan?: boolean;
  /** Aplica rate limiting. Default true. */
  rateLimit?: boolean;
};

/**
 * Guard común para APIs que generan / modifican consultas:
 * - verifica sesión
 * - rate-limit (si Upstash configurado)
 * - chequea cupo de plan
 * - si algo falla devuelve la respuesta HTTP apropiada
 */
export async function guardApi(
  options: GuardOptions = {}
): Promise<GuardOK | GuardFail> {
  const { checkPlan: doCheckPlan = true, rateLimit: doRateLimit = true } = options;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      ok: false,
      response: NextResponse.json({ error: 'No autorizado' }, { status: 401 }),
    };
  }

  if (doRateLimit) {
    const rl = await checkRateLimit(`user:${user.id}`);
    if (!rl.success) {
      return {
        ok: false,
        response: NextResponse.json(
          { error: 'Demasiadas solicitudes en poco tiempo. Esperá un minuto.' },
          { status: 429, headers: { 'Retry-After': '60' } }
        ),
      };
    }
  }

  let plan: PlanCheck;
  if (doCheckPlan) {
    plan = await checkPlanLimits();
    if (!plan.permitido) {
      return {
        ok: false,
        response: NextResponse.json(
          {
            error: plan.planVencido
              ? 'Tu plan venció. Renovalo para seguir generando guías.'
              : 'Alcanzaste tu límite mensual de guías.',
            plan,
          },
          { status: 402 }
        ),
      };
    }
  } else {
    plan = await checkPlanLimits();
  }

  return {
    ok: true,
    user: { id: user.id, email: user.email },
    supabase,
    plan,
  };
}

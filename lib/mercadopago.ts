import 'server-only';
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import type { PlanPago } from './types';

const accessToken = process.env.MP_ACCESS_TOKEN;

if (!accessToken) {
  console.warn('[mercadopago] MP_ACCESS_TOKEN no definida — pagos deshabilitados.');
}

const client = new MercadoPagoConfig({
  accessToken: accessToken ?? 'missing',
  options: { timeout: 10_000 },
});

export const preferenceClient = new Preference(client);
export const paymentClient = new Payment(client);

// Precios mensuales de cada plan pago (nueva estructura híbrida Sonnet/Opus).
// Deben mantenerse sincronizados con LIMITES_PLAN en lib/types.ts.
export const PLAN_PRECIOS_ARS: Record<PlanPago, number> = {
  basico: 10_000,
  profesional: 15_000,
  premium: 25_000,
};

export function buildExternalReference(
  userId: string,
  plan: PlanPago
): string {
  return `${userId}__${plan}__${Date.now()}`;
}

export function parseExternalReference(ref: string | null | undefined): {
  userId: string | null;
  plan: PlanPago | null;
} {
  if (!ref) return { userId: null, plan: null };
  const [userId, plan] = ref.split('__');
  const valid = plan === 'basico' || plan === 'profesional' || plan === 'premium';
  if (!userId || !valid) {
    return { userId: null, plan: null };
  }
  return { userId, plan };
}

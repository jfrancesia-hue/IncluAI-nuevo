import 'server-only';
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';

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

export const PLAN_PRECIOS_ARS: Record<'pro' | 'institucional', number> = {
  pro: 9900,
  institucional: 29900,
};

export function buildExternalReference(
  userId: string,
  plan: 'pro' | 'institucional'
): string {
  return `${userId}__${plan}__${Date.now()}`;
}

export function parseExternalReference(ref: string | null | undefined): {
  userId: string | null;
  plan: 'pro' | 'institucional' | null;
} {
  if (!ref) return { userId: null, plan: null };
  const [userId, plan] = ref.split('__');
  if (!userId || (plan !== 'pro' && plan !== 'institucional')) {
    return { userId: null, plan: null };
  }
  return { userId, plan };
}

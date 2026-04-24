import { NextResponse, type NextRequest } from 'next/server';
import crypto from 'node:crypto';
import { paymentClient, parseExternalReference } from '@/lib/mercadopago';
import { createAdminClient } from '@/lib/supabase/admin';
import { logError } from '@/lib/errors';
import { trackServerEvent } from '@/lib/analytics';

export const runtime = 'nodejs';

// MP envía webhooks vía POST (JSON). Aceptamos variantes (topic/type, data.id, resource).
// Respondemos 200 cuando el mensaje se registró correctamente para evitar reintentos innecesarios.

export async function POST(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const bodyText = await request.text();
    const body = bodyText ? safeJson(bodyText) : {};

    // Verificación de firma MP (x-signature + x-request-id + MP_WEBHOOK_SECRET).
    // Si MP_WEBHOOK_SECRET no está seteado (dev local), se saltea la verificación.
    const secret = process.env.MP_WEBHOOK_SECRET;
    if (secret) {
      const xSignature = request.headers.get('x-signature');
      const xRequestId = request.headers.get('x-request-id');
      const dataId =
        url.searchParams.get('data.id') ??
        url.searchParams.get('id') ??
        (pick<Record<string, unknown>>(body, 'data')?.id as string | number | undefined)?.toString();

      if (!verifyMpSignature({ xSignature, xRequestId, dataId, secret })) {
        console.warn('[mp-webhook] firma inválida');
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }

    const type =
      pick<string>(body, 'type') ??
      pick<string>(body, 'topic') ??
      url.searchParams.get('type') ??
      url.searchParams.get('topic');

    if (type !== 'payment') {
      return NextResponse.json({ received: true, ignored: type ?? 'unknown' });
    }

    const dataObj = pick<Record<string, unknown>>(body, 'data');
    const resource = pick<string>(body, 'resource');
    const paymentId: string | undefined =
      (dataObj && (dataObj.id as string | number | undefined)?.toString()) ??
      url.searchParams.get('data.id') ??
      url.searchParams.get('id') ??
      resource?.toString().split('/').pop();

    if (!paymentId) {
      return NextResponse.json({ error: 'Sin payment id' }, { status: 400 });
    }

    const supabase = createAdminClient();

    // Idempotency: si ya procesamos este payment_id como aprobado, salimos.
    const { data: yaAprobado } = await supabase
      .from('pagos')
      .select('id')
      .eq('mercadopago_payment_id', String(paymentId))
      .eq('estado', 'aprobado')
      .maybeSingle();
    if (yaAprobado) {
      return NextResponse.json({ received: true, idempotent: true });
    }

    const payment = await paymentClient.get({ id: String(paymentId) });

    const { userId, plan } = parseExternalReference(payment.external_reference);
    if (!userId || !plan) {
      logError(new Error('external_reference inválida'), {
        source: 'api/mercadopago/webhook',
        correlationId: String(paymentId),
        metadata: { external_reference: payment.external_reference },
      });
      return NextResponse.json({ received: true, reason: 'invalid_reference' });
    }

    if (payment.status !== 'approved') {
      await supabase.from('pagos').insert({
        user_id: userId,
        monto_ars: payment.transaction_amount ?? 0,
        plan,
        estado: payment.status === 'rejected' ? 'rechazado' : 'pendiente',
        mercadopago_payment_id: String(paymentId),
        mercadopago_status: payment.status ?? 'unknown',
      });
      return NextResponse.json({ received: true, status: payment.status });
    }

    // Calcular nuevo vencimiento: extiende desde el max(hoy, plan_activo_hasta actual).
    const { data: perfilActual } = await supabase
      .from('perfiles')
      .select('plan_activo_hasta')
      .eq('id', userId)
      .single<{ plan_activo_hasta: string | null }>();

    const ahora = new Date();
    const baseFin =
      perfilActual?.plan_activo_hasta && new Date(perfilActual.plan_activo_hasta) > ahora
        ? new Date(perfilActual.plan_activo_hasta)
        : ahora;
    const fin = new Date(baseFin.getTime() + 30 * 24 * 60 * 60 * 1000);

    const { error: updateError } = await supabase
      .from('perfiles')
      .update({
        plan,
        plan_activo_hasta: fin.toISOString(),
        updated_at: ahora.toISOString(),
      })
      .eq('id', userId);

    if (updateError) {
      logError(updateError, {
        source: 'api/mercadopago/webhook/update_perfil',
        userId,
        correlationId: String(paymentId),
        metadata: { plan },
      });
      return NextResponse.json({ error: 'DB error' }, { status: 500 });
    }

    await supabase.from('pagos').insert({
      user_id: userId,
      monto_ars: payment.transaction_amount ?? 0,
      plan,
      estado: 'aprobado',
      mercadopago_payment_id: String(paymentId),
      mercadopago_status: payment.status,
      periodo_inicio: ahora.toISOString(),
      periodo_fin: fin.toISOString(),
    });

    await trackServerEvent('plan_upgraded', {
      plan,
      monto_ars: payment.transaction_amount ?? 0,
    });

    return NextResponse.json({ received: true, activated: true });
  } catch (err) {
    logError(err, { source: 'api/mercadopago/webhook' });
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true });
}

function safeJson(text: string): Record<string, unknown> {
  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    return {};
  }
}

function pick<T>(obj: Record<string, unknown>, key: string): T | undefined {
  return obj[key] as T | undefined;
}

// MP firma: manifest = "id:{dataId};request-id:{xRequestId};ts:{ts};"
// Header x-signature viene como "ts=...,v1=..."
function verifyMpSignature(opts: {
  xSignature: string | null;
  xRequestId: string | null;
  dataId: string | undefined;
  secret: string;
}): boolean {
  if (!opts.xSignature || !opts.xRequestId || !opts.dataId) return false;
  const parts = opts.xSignature.split(',').reduce<Record<string, string>>((acc, part) => {
    const [k, v] = part.split('=').map((x) => x.trim());
    if (k && v) acc[k] = v;
    return acc;
  }, {});
  const { ts, v1 } = parts;
  if (!ts || !v1) return false;
  const manifest = `id:${opts.dataId};request-id:${opts.xRequestId};ts:${ts};`;
  const hmac = crypto.createHmac('sha256', opts.secret).update(manifest).digest('hex');
  try {
    return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(v1));
  } catch {
    return false;
  }
}

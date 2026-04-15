import { NextResponse, type NextRequest } from 'next/server';
import { paymentClient, parseExternalReference } from '@/lib/mercadopago';
import { createAdminClient } from '@/lib/supabase/admin';

export const runtime = 'nodejs';

// MP envía webhooks vía POST (JSON). También puede llegar por GET/query params
// en notificaciones IPN legacy. Aceptamos ambos y devolvemos 200 siempre que
// el mensaje se haya registrado: reintentos de MP son costosos.

export async function POST(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const bodyText = await request.text();
    const body = bodyText ? safeJson(bodyText) : {};

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

    const payment = await paymentClient.get({ id: String(paymentId) });

    const { userId, plan } = parseExternalReference(payment.external_reference);
    if (!userId || !plan) {
      console.error('[mp-webhook] external_reference inválida', payment.external_reference);
      return NextResponse.json({ received: true, reason: 'invalid_reference' });
    }

    const supabase = createAdminClient();

    if (payment.status !== 'approved') {
      // Registrar intento no aprobado para trazabilidad.
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

    const ahora = new Date();
    const fin = new Date(ahora.getTime() + 30 * 24 * 60 * 60 * 1000);

    const { error: updateError } = await supabase
      .from('perfiles')
      .update({
        plan,
        plan_activo_hasta: fin.toISOString(),
        updated_at: ahora.toISOString(),
      })
      .eq('id', userId);

    if (updateError) {
      console.error('[mp-webhook] update perfil error', updateError);
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

    return NextResponse.json({ received: true, activated: true });
  } catch (err) {
    console.error('[mp-webhook] error', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

// MP a veces hace una verificación GET inicial sobre la URL. Responder 200.
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

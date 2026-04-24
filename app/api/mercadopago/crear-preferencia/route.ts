import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import {
  preferenceClient,
  buildExternalReference,
  PLAN_PRECIOS_ARS,
} from '@/lib/mercadopago';

const bodySchema = z.object({
  plan: z.enum(['pro', 'institucional']).default('pro'),
});

const ITEM_TITULOS: Record<'pro' | 'institucional', string> = {
  pro: 'IncluAI Plan Profesional',
  institucional: 'IncluAI Plan Institucional',
};

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const payload = await request.json().catch(() => ({}));
  const parsed = bodySchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Payload inválido' }, { status: 400 });
  }

  const plan = parsed.data.plan;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!appUrl) {
    return NextResponse.json(
      { error: 'NEXT_PUBLIC_APP_URL no configurada' },
      { status: 500 }
    );
  }

  const mesActual = new Date().toLocaleDateString('es-AR', {
    month: 'long',
    year: 'numeric',
  });

  try {
    const preference = await preferenceClient.create({
      body: {
        items: [
          {
            id: `inclua-${plan}-mensual`,
            title: `${ITEM_TITULOS[plan]} — ${mesActual}`,
            unit_price: PLAN_PRECIOS_ARS[plan],
            quantity: 1,
            currency_id: 'ARS',
          },
        ],
        external_reference: buildExternalReference(user.id, plan),
        back_urls: {
          success: `${appUrl}/exito-pago`,
          failure: `${appUrl}/planes?status=error`,
          pending: `${appUrl}/planes?status=pendiente`,
        },
        auto_return: 'approved',
        notification_url: `${appUrl}/api/mercadopago/webhook`,
        payer: user.email ? { email: user.email } : undefined,
        metadata: { user_id: user.id, plan },
      },
    });

    return NextResponse.json({
      init_point: preference.init_point,
      sandbox_init_point: preference.sandbox_init_point,
      preference_id: preference.id,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error creando preferencia';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

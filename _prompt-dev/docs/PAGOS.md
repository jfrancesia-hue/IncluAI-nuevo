# PAGOS.md — IncluIA
## Integración con Mercado Pago Argentina
## Claude Code: leer antes de implementar la Fase 4

---

## Modelo de negocio

| Plan | Precio | Guías/mes | Features |
|------|--------|-----------|----------|
| Free | $0 | 2 | Generar guías, copiar texto |
| Pro | $9.900/mes | 40 | + Historial, favoritos, exportar PDF, soporte |
| Institucional | $29.900/mes | Ilimitado | + Múltiples docentes (FUTURO, no implementar ahora) |

---

## Flujo de pago — Checkout Pro

Se usa **Checkout Pro** de Mercado Pago (no suscripciones automáticas por ahora). Razón: es más simple de implementar, no requiere que el docente tenga tarjeta de crédito guardada, y permite cobrar mes a mes.

### Flujo completo:

```
1. Docente en /planes → click "Suscribirme al Plan Pro"
2. Frontend → POST /api/mercadopago/crear-preferencia
3. API Route:
   a. Verificar auth
   b. Crear Preference en Mercado Pago:
      - item: "IncluIA Plan Profesional — [Mes Año]"
      - unit_price: 9900
      - currency_id: "ARS"
      - quantity: 1
      - external_reference: "{userId}__pro__{timestamp}"
      - back_urls.success: "{APP_URL}/exito-pago"
      - back_urls.failure: "{APP_URL}/planes?status=error"
      - back_urls.pending: "{APP_URL}/planes?status=pendiente"
      - notification_url: "{APP_URL}/api/mercadopago/webhook"
      - auto_return: "approved"
   c. Retornar: { init_point: "https://www.mercadopago.com.ar/checkout/v1/..." }
4. Frontend: window.location.href = init_point (redirect a MP)
5. Docente paga en Mercado Pago
6. MP envía webhook POST a /api/mercadopago/webhook
7. Webhook:
   a. Recibir notificación
   b. Si topic === "payment":
      - Obtener payment_id del body
      - GET payment desde MP API para verificar
      - Si status === "approved":
        → Parsear external_reference para obtener userId y plan
        → UPDATE perfil: plan = 'pro', plan_activo_hasta = NOW() + 30 days
        → INSERT en tabla pagos
   c. Responder 200 OK
8. MP redirect al docente a /exito-pago
```

---

## Código de referencia

### `lib/mercadopago.ts`

```typescript
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago'

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
})

export const preferenceClient = new Preference(client)
export const paymentClient = new Payment(client)
```

### `/api/mercadopago/crear-preferencia/route.ts`

```typescript
import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { preferenceClient } from '@/lib/mercadopago'

export async function POST(req: Request) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  const mesActual = new Date().toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })
  const externalReference = `${user.id}__pro__${Date.now()}`

  const preference = await preferenceClient.create({
    body: {
      items: [
        {
          id: 'inclua-pro-mensual',
          title: `IncluIA Plan Profesional — ${mesActual}`,
          unit_price: 9900,
          quantity: 1,
          currency_id: 'ARS',
        },
      ],
      external_reference: externalReference,
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_APP_URL}/exito-pago`,
        failure: `${process.env.NEXT_PUBLIC_APP_URL}/planes?status=error`,
        pending: `${process.env.NEXT_PUBLIC_APP_URL}/planes?status=pendiente`,
      },
      auto_return: 'approved',
      notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/mercadopago/webhook`,
      payer: {
        email: user.email,
      },
    },
  })

  return NextResponse.json({ init_point: preference.init_point })
}
```

### `/api/mercadopago/webhook/route.ts`

```typescript
import { NextResponse } from 'next/server'
import { paymentClient } from '@/lib/mercadopago'
import { createClient } from '@supabase/supabase-js'

// Usar service role para webhook (no hay sesión de usuario)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    // Solo procesar notificaciones de pago
    if (body.type !== 'payment' && body.topic !== 'payment') {
      return NextResponse.json({ received: true })
    }

    const paymentId = body.data?.id || body.resource?.split('/').pop()
    
    if (!paymentId) {
      return NextResponse.json({ error: 'No payment ID' }, { status: 400 })
    }

    // Obtener detalles del pago desde MP
    const payment = await paymentClient.get({ id: paymentId })

    if (payment.status !== 'approved') {
      // Loguear pero no activar
      console.log(`Payment ${paymentId} status: ${payment.status}`)
      return NextResponse.json({ received: true })
    }

    // Parsear external_reference: "{userId}__pro__{timestamp}"
    const externalRef = payment.external_reference
    if (!externalRef) {
      console.error('No external_reference in payment')
      return NextResponse.json({ received: true })
    }

    const [userId, plan] = externalRef.split('__')

    if (!userId || !plan) {
      console.error('Invalid external_reference:', externalRef)
      return NextResponse.json({ received: true })
    }

    const ahora = new Date()
    const en30Dias = new Date(ahora.getTime() + 30 * 24 * 60 * 60 * 1000)

    // Activar plan
    const { error: updateError } = await supabaseAdmin
      .from('perfiles')
      .update({
        plan: plan,
        plan_activo_hasta: en30Dias.toISOString(),
        updated_at: ahora.toISOString(),
      })
      .eq('id', userId)

    if (updateError) {
      console.error('Error updating profile:', updateError)
      return NextResponse.json({ error: 'DB error' }, { status: 500 })
    }

    // Registrar pago
    await supabaseAdmin.from('pagos').insert({
      user_id: userId,
      monto_ars: payment.transaction_amount,
      plan: plan,
      estado: 'aprobado',
      mercadopago_payment_id: String(paymentId),
      mercadopago_status: payment.status,
      periodo_inicio: ahora.toISOString(),
      periodo_fin: en30Dias.toISOString(),
    })

    return NextResponse.json({ received: true, activated: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
```

---

## `lib/plan-limits.ts`

```typescript
import { PlanUsuario, LIMITES_PLAN } from '@/lib/types'

export type PlanStatus = {
  plan: PlanUsuario
  consultasUsadas: number
  consultasRestantes: number
  limiteTotal: number
  permitido: boolean
  esPro: boolean
  planVencido: boolean
  venceEn?: string
}

export function checkPlanStatus(perfil: {
  plan: PlanUsuario
  consultas_mes: number
  mes_actual: string
  plan_activo_hasta?: string | null
}): PlanStatus {
  const mesActual = new Date().toISOString().slice(0, 7) // "YYYY-MM"
  
  // Resetear si cambió el mes
  let consultasUsadas = perfil.consultas_mes
  if (perfil.mes_actual !== mesActual) {
    consultasUsadas = 0
  }

  // Verificar si el plan Pro venció
  let planActual = perfil.plan
  let planVencido = false
  
  if (planActual !== 'free' && perfil.plan_activo_hasta) {
    const vencimiento = new Date(perfil.plan_activo_hasta)
    if (vencimiento < new Date()) {
      planActual = 'free'
      planVencido = true
    }
  }

  const limite = LIMITES_PLAN[planActual]
  const restantes = Math.max(0, limite.guias_por_mes - consultasUsadas)

  return {
    plan: planActual,
    consultasUsadas,
    consultasRestantes: restantes,
    limiteTotal: limite.guias_por_mes,
    permitido: restantes > 0,
    esPro: planActual === 'pro' || planActual === 'institucional',
    planVencido,
    venceEn: perfil.plan_activo_hasta || undefined,
  }
}
```

---

## Configuración en Mercado Pago

### Cuenta de desarrollo:
1. Ir a https://www.mercadopago.com.ar/developers
2. Crear aplicación "IncluIA"
3. Obtener credenciales de prueba (sandbox) y producción
4. En producción: usar Access Token de producción

### Variables de entorno:
```env
# Sandbox (desarrollo)
MERCADOPAGO_ACCESS_TOKEN=TEST-xxx

# Producción
MERCADOPAGO_ACCESS_TOKEN=APP_USR-xxx
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=APP_USR-xxx
```

### Testing:
- Usar tarjetas de prueba de MP: https://www.mercadopago.com.ar/developers/es/docs/checkout-pro/additional-content/your-integrations/test/cards
- Crear usuarios de prueba para simular comprador/vendedor

---

## Vencimiento del plan

La app verifica el vencimiento en cada request:
1. Si `plan_activo_hasta` < ahora → degradar a free
2. Esto se hace en `checkPlanStatus()` que se llama en cada verificación

**NO se implementa cobro automático recurrente por ahora.** El docente recibe un email cuando le quedan 5 días (futuro) y paga manualmente de nuevo. Esto simplifica mucho la implementación inicial.

---

## Consideraciones para Argentina

1. **Mercado Pago es universal:** Todos los docentes lo tienen
2. **Precio en ARS:** Siempre en pesos argentinos, sin conversión
3. **Inflación:** El precio se puede actualizar fácilmente en `LIMITES_PLAN`
4. **Facturación:** No se genera factura automática por ahora (se puede agregar después)
5. **IVA:** El precio de $9.900 es precio final (IVA incluido si corresponde)

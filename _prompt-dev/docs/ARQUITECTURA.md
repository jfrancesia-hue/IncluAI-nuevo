# ARQUITECTURA.md — IncluIA
## Referencia técnica para Claude Code

---

## Stack completo

| Capa | Tecnología | Versión | Propósito |
|------|-----------|---------|-----------|
| Framework | Next.js | 14.x | App Router, SSR, API Routes |
| Lenguaje | TypeScript | 5.x | Tipado estricto |
| Estilos | Tailwind CSS | 3.4 | Utility-first CSS |
| Componentes | shadcn/ui | latest | UI components base |
| Base de datos | Supabase | latest | PostgreSQL + Auth + RLS |
| IA | Anthropic SDK | latest | Claude API con streaming |
| Pagos | Mercado Pago SDK | latest | Checkout Pro Argentina |
| Deploy | Vercel | - | Hosting + Edge Functions |

---

## Flujos principales

### Flujo 1: Registro y Login
```
[Landing] → [Registro] → [Supabase Auth: crear usuario]
                              ↓
                        [Trigger DB: crear perfil con plan=free]
                              ↓
                        [Verificar email] → [Login] → [Dashboard /inicio]
```

### Flujo 2: Generar guía (core del producto)
```
[/nueva-consulta]
    ↓
[Paso 1: Contexto] → [Paso 2: Discapacidad] → [Paso 3: Adicional]
    ↓
[Click "Generar guía"]
    ↓
[Frontend: POST /api/generar-guia con datos del formulario]
    ↓
[API Route:]
  1. Verificar auth (Supabase server)
  2. Verificar límite de plan (consultas_mes < límite)
  3. Construir prompt con buildPrompt(formData)
  4. Llamar a Claude API con streaming
  5. Retornar ReadableStream al frontend
    ↓
[Frontend: /resultado]
  - Consumir stream y mostrar texto progresivamente
  - Al terminar: parsear markdown en secciones
  - Mostrar acciones: copiar, guardar, feedback
    ↓
[Al finalizar stream:]
  - POST /api/guardar-consulta (guardar en DB)
  - Incrementar consultas_mes del perfil
```

### Flujo 3: Pago con Mercado Pago
```
[/planes] → [Click "Suscribirme"]
    ↓
[POST /api/mercadopago/crear-preferencia]
  → Crear checkout preference en MP
  → Retornar URL de checkout
    ↓
[Redirect a Mercado Pago] → [Usuario paga]
    ↓
[MP envía webhook POST /api/mercadopago/webhook]
  → Verificar autenticidad
  → Si approved: actualizar perfil (plan=pro, plan_activo_hasta=+30d)
  → Insertar registro en tabla pagos
    ↓
[MP redirect a /exito-pago] → [Usuario ve confirmación]
```

### Flujo 4: Verificación de plan (en cada request)
```
[Cualquier acción protegida por plan]
    ↓
[checkPlanLimits(userId)]
  1. Obtener perfil del usuario
  2. Si mes_actual ≠ mes actual → resetear consultas_mes a 0
  3. Si plan=pro Y plan_activo_hasta < ahora → degradar a free
  4. Comparar consultas_mes con LIMITES_PLAN[plan]
  5. Retornar: { permitido, consultasRestantes, plan }
```

---

## Estructura de autenticación

```typescript
// middleware.ts — Protección de rutas
// Rutas protegidas: /inicio, /nueva-consulta, /resultado, /historial, /perfil, /planes
// Rutas públicas: /landing, /login, /registro, /api/mercadopago/webhook
// Lógica: Si no hay sesión → redirect a /login
//         Si hay sesión y está en /login o /registro → redirect a /inicio

// Supabase Auth flow:
// 1. Browser: createBrowserClient() — para componentes client
// 2. Server: createServerClient() — para API routes y server components
// 3. Admin: createClient() con service_role — SOLO para webhooks
```

---

## Arquitectura de la API de IA

```typescript
// /api/generar-guia/route.ts

// IMPORTANTE: Usar streaming para UX óptima
// El docente ve la respuesta aparecer en tiempo real

import Anthropic from '@anthropic-ai/sdk'
import { buildPrompt, SYSTEM_PROMPT } from '@/lib/prompts'

// Patrón de streaming:
const stream = await client.messages.stream({
  model: 'claude-sonnet-4-20250514',
  max_tokens: 4000,
  system: SYSTEM_PROMPT,
  messages: [{ role: 'user', content: buildPrompt(formData) }]
})

// Retornar como Response con ReadableStream
return new Response(stream.toReadableStream(), {
  headers: { 'Content-Type': 'text/event-stream' }
})
```

---

## Gestión de estado (frontend)

```
AuthContext (Context API):
  - user: User | null
  - perfil: Perfil | null
  - loading: boolean
  - signIn(), signUp(), signOut()

PlanContext (Context API):
  - plan: PlanUsuario
  - consultasRestantes: number
  - esPro: boolean
  - planVencido: boolean
  - refresh()

Estado local (useState):
  - Formulario: FormularioConsulta
  - Resultado: respuesta string + loading + error
  - Historial: consultas[] + filtros + paginación
```

---

## Modelo de datos resumido

```
perfiles (1) ←→ (N) consultas
perfiles (1) ←→ (N) guias_guardadas
perfiles (1) ←→ (N) pagos
consultas (1) ←→ (0..1) guias_guardadas
```

Ver schema SQL completo en `docs/BASE-DE-DATOS.md`

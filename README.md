# IncluIA

SaaS de **educación inclusiva con IA** para docentes argentinos. Generá guías pedagógicas concretas y personalizadas para cada alumno, cada discapacidad y cada contenido curricular.

> Reescritura del proyecto original `inclua`. El respaldo sigue en `E:\Usuario\inclua`.

## Stack

- **Next.js 16** (App Router, Turbopack) + **React 19** + **TypeScript**
- **Tailwind CSS v4** + shadcn-style UI custom
- **Prisma 7** con `@prisma/adapter-pg` (Postgres vía Supabase)
- **Supabase** — Auth + DB + RLS + Storage
- **Anthropic Claude API** — modelo `claude-sonnet-4-6` con streaming SSE
- **Mercado Pago Argentina** — Checkout Pro
- **Resend** — email transaccional
- **Vercel** — deploy

## Requisitos

- Node ≥ 20 (idealmente 22+)
- Proyecto Supabase creado
- Cuenta de developer Mercado Pago (Argentina)
- Cuenta Resend (opcional en dev)
- `ANTHROPIC_API_KEY`

## Setup local

### 1. Instalar dependencias

```bash
npm install
```

### 2. Crear proyecto Supabase

1. Entrá a https://supabase.com → nuevo proyecto.
2. Desde el **SQL Editor**, ejecutá el contenido de `supabase/schema.sql`. Crea:
   - Tablas `perfiles`, `consultas`, `guias_guardadas`, `pagos`
   - RLS y policies
   - Trigger `on_auth_user_created` (crea el perfil al registrarse)
   - Función `incrementar_consultas` (contador mensual por usuario)

### 3. Configurar variables de entorno

Copiá `.env.local.example` a `.env.local` y completá:

| Variable | Dónde conseguirla |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API (⚠️ server-only) |
| `DATABASE_URL` | Supabase → Project Settings → Database → Connection string (pooler) |
| `ANTHROPIC_API_KEY` | https://console.anthropic.com |
| `MP_ACCESS_TOKEN` | https://www.mercadopago.com.ar/developers |
| `MP_PUBLIC_KEY` | Mercado Pago developers |
| `RESEND_API_KEY` | https://resend.com (opcional en dev) |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` en dev |

### 4. Generar Prisma client

```bash
npm run db:generate
```

### 5. Correr dev server

```bash
npm run dev
```

Abrí http://localhost:3000.

## Estructura

```
app/
  (auth)/             → login, registro, verificar-email
  (dashboard)/        → inicio, nueva-consulta, resultado, historial, perfil, planes
  api/
    generar-guia/     → POST streaming SSE con Claude
    guardar-consulta/ → POST persiste favorito
    feedback/         → POST rating 1-5
    check-plan/       → GET estado del plan
    mercadopago/
      crear-preferencia/ → POST crea checkout
      webhook/            → POST/GET notificaciones MP (público)
  auth/callback/      → OAuth / magic link
  exito-pago/         → celebración post-pago
  landing = /
components/
  ui/                 → button, input, label, card, select, alert
  dashboard/          → navbar, consulta-wizard, guide-view, feedback-stars, upgrade-button
data/                 → niveles, materias, discapacidades, provincias (textuales)
lib/
  supabase/           → client, server, middleware, admin (service role)
  anthropic.ts        → SDK + modelo claude-sonnet-4-6
  auth.ts             → getPerfil, getCurrentUser (cached)
  plan.ts             → checkPlanLimits, incrementarConsultas
  mercadopago.ts      → SDK + external_reference helpers
  email.ts            → Resend + bienvenida
  prompts.ts          → SYSTEM_PROMPT + buildPrompt (textual del original)
  validators.ts       → Zod schemas
  types.ts            → tipos maestros
prisma/
  schema.prisma       → modelos derivados del SQL
supabase/
  schema.sql          → fuente de verdad (RLS + triggers + funciones)
proxy.ts              → auth + redirects (antes middleware.ts)
vercel.json           → maxDuration del /api/generar-guia
```

## Comandos

```bash
npm run dev          # dev server (turbopack)
npm run build        # build producción
npm run start        # prod server local
npm run lint         # eslint
npm run db:generate  # prisma generate
npm run db:push      # aplicar schema.prisma a la DB (cuidado: bypassa migrations)
npm run db:migrate   # crear nueva migración
```

## Flujo principal

1. Docente registra cuenta → Supabase Auth crea usuario → trigger inserta `perfiles`.
2. Abre `/nueva-consulta` → wizard 3 pasos (contexto, discapacidad, contexto adicional).
3. Click "Generar guía" → POST `/api/generar-guia` → valida plan (402 si no hay cupo) → stream Claude vía SSE.
4. La UI renderiza la guía progresivamente con `GuideView` (parser markdown con secciones).
5. Al terminar, la consulta se persiste y `consultas_mes` se incrementa.
6. Docente puede puntuar con 5 estrellas (`/api/feedback`) o acceder luego desde `/historial`.

## Mercado Pago

- `/api/mercadopago/crear-preferencia` crea una `Preference` con `external_reference = userId__plan__ts`.
- Al pagar, MP redirige a `/exito-pago` y llama al webhook.
- El webhook (`/api/mercadopago/webhook`) verifica el pago contra la API de MP, activa el plan 30 días y guarda registro en `pagos`.
- El webhook usa el **service role** de Supabase (no hay sesión de usuario).
- Está excluido del `proxy.ts` para permitir llamadas públicas de MP.

## Deploy en Vercel

1. Push del repo a GitHub.
2. Vercel → Import Project.
3. Cargar todas las env vars del `.env.local.example`.
4. Cambiar `NEXT_PUBLIC_APP_URL` al dominio de producción.
5. En Supabase → Auth → URL Configuration: agregar la URL de producción a **Redirect URLs**.
6. En Mercado Pago → Webhooks: configurar `https://<dominio>/api/mercadopago/webhook`.

## Notas

- **Modelo Claude**: se usa `claude-sonnet-4-6` (más reciente y capaz que el `claude-sonnet-4-20250514` del prompt-maestro original).
- **WCAG AA** es obligatorio — la app es de educación inclusiva.
- **Mobile-first** — todas las pantallas probadas en mobile.
- **Español rioplatense argentino** en toda la UI.
- Datos maestros (niveles, materias, discapacidades) se mantuvieron textuales del prompt-maestro — NO inventar.

## Licencia

Privado.

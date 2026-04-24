<div align="center">

# 🧩 IncluAI

### **Planificá clases inclusivas en minutos**

Plataforma SaaS de **educación inclusiva con IA** para **docentes, familias y profesionales de salud** en Argentina.
Guías pedagógicas y clínicas concretas, personalizadas para cada alumno/paciente, cada discapacidad y cada contenido.

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat&logo=next.js&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38BDF8?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?style=flat&logo=prisma&logoColor=white)](https://www.prisma.io)
[![Supabase](https://img.shields.io/badge/Supabase-latest-3ECF8E?style=flat&logo=supabase&logoColor=white)](https://supabase.com)
[![Claude](https://img.shields.io/badge/Claude-Sonnet%204.6-D97757?style=flat&logo=anthropic&logoColor=white)](https://www.anthropic.com)
[![Mercado Pago](https://img.shields.io/badge/Mercado%20Pago-Argentina-00B1EA?style=flat&logo=mercadopago&logoColor=white)](https://www.mercadopago.com.ar)
[![Made in Argentina](https://img.shields.io/badge/Hecho%20en-Argentina%20🇦🇷-75AADB?style=flat)](#)

</div>

---

## ✨ Qué hace

IncluAI genera **guías pedagógicas inclusivas en vivo** usando la API de Claude (Anthropic) con **streaming SSE**. Un docente, una familia o un/a profesional completa un formulario de 3 pasos y recibe en segundos una guía con estrategias concretas, materiales adaptados, protocolos de atención y coordinación interdisciplinaria — todo ajustado al marco legal argentino (Ley 26.206, Ley 24.901, Resolución CFE 311/16).

### 3 módulos, una plataforma

| Módulo | Público | Pregunta clave |
|---|---|---|
| 📚 **Docentes** | Maestros y profesores de todo el sistema educativo argentino | *¿Qué contenido vas a enseñar y a quién?* |
| 🏠 **Familias** | Padres, madres, tutores | *¿En qué necesitás ayuda con tu hijo/a en casa?* |
| ⚕️ **Profesionales** | Psicólogos, fonoaudiólogos, TO, kinesiólogos, médicos, odontólogos, etc. | *¿Qué paciente vas a atender y cómo?* |

Los 3 módulos comparten autenticación, planes, pagos, catálogo de discapacidades y motor de IA. Cada uno tiene su propio *system prompt*, builder de prompt y pantallas de formulario y resultado.

---

## 🎨 Screenshots

<div align="center">

### Landing + Hero
<img src="docs/screenshots/01-landing.png" alt="Landing page de IncluAI" width="100%" />

### Dashboard del docente
<img src="docs/screenshots/02-dashboard.png" alt="Dashboard de inicio post-login" width="100%" />

### Guía generada por Claude (streaming)
<img src="docs/screenshots/03-guia-generada.png" alt="Guía pedagógica inclusiva generada por IA" width="100%" />

### Secciones de la guía
<img src="docs/screenshots/04-guia-secciones.png" alt="Guía estructurada en 7 secciones pedagógicas" width="100%" />

### Vista de impresión
<img src="docs/screenshots/05-impresion.png" alt="Preview de impresión" width="100%" />

### Biblioteca de recursos
<img src="docs/screenshots/06-biblioteca.png" alt="Biblioteca de guías guardadas" width="100%" />

<sub>Mockups generados en <a href="https://stitch.withgoogle.com">Google Stitch</a>. La app en producción respeta 1:1 este design system.</sub>

</div>

---

## 🧠 Stack

<div align="center">

| Capa | Tecnología |
|---|---|
| **Framework** | Next.js 16 (App Router + Turbopack) |
| **Runtime** | React 19 + TypeScript 5 |
| **Styling** | Tailwind CSS v4 + shadcn-style UI custom |
| **Tipografías** | Fraunces (serif) + DM Sans (sans) |
| **ORM** | Prisma 7 con `@prisma/adapter-pg` |
| **Database + Auth** | Supabase (Postgres + RLS + triggers) |
| **IA** | Anthropic SDK · modelo `claude-sonnet-4-6` con streaming SSE |
| **Pagos** | Mercado Pago Argentina (Checkout Pro) |
| **Email** | Resend (post-registro via `after()` de Next) |
| **Deploy** | Vercel |

</div>

### Paleta de diseño

```css
--primary:       #1e3a5f   /* Dark institutional blue */
--accent:        #16a34a   /* Green — inclusion */
--cta:           #ea580c   /* Orange CTA */
--primary-bg:    #e8f0fe
--accent-light:  #dcfce7
--background:    #f5f7fa
```

---

## 🏗️ Arquitectura

```
app/
├── (auth)/              → login · registro · verificar-email
├── (dashboard)/         → inicio · nueva-consulta · resultado · historial · perfil · planes
│   ├── familias/        → wizard del módulo familias
│   └── profesionales/   → wizard del módulo profesionales
├── api/
│   ├── generar-guia/             → POST SSE (docentes)
│   ├── generar-guia-familia/     → POST SSE (familias)
│   ├── generar-guia-profesional/ → POST SSE (profesionales)
│   ├── guardar-consulta/
│   ├── feedback/
│   ├── check-plan/
│   └── mercadopago/
│       ├── crear-preferencia/    → POST checkout
│       └── webhook/              → POST/GET público (excluido de proxy)
├── auth/callback/       → OAuth / magic link
├── exito-pago/          → celebración post-pago
└── page.tsx             → landing pública

components/
├── ui/                  → button · input · label · card · select · alert
└── dashboard/           → navbar · consulta-wizard · familia-wizard · profesional-wizard
                          guide-view · feedback-stars · module-selector · upgrade-button · sse

data/                    → discapacidades · niveles · materias · provincias ·
                          areas-familia · especialidades · objetivos-profesional · rangos-edad
lib/
├── supabase/            → client · server · middleware · admin (service role)
├── anthropic.ts         → SDK + modelo
├── auth.ts              → getPerfil / getCurrentUser (React.cache)
├── plan.ts              → checkPlanLimits / incrementarConsultas
├── mercadopago.ts       → SDK + helpers external_reference
├── email.ts             → Resend + template bienvenida
├── prompts.ts           → SYSTEM_PROMPT × 3 + builders
├── generar-guia-stream  → helper SSE compartido entre los 3 módulos
├── validators.ts        → Zod schemas
└── types.ts             → tipos maestros

prisma/                  → schema.prisma + prisma.config.ts
supabase/                → schema.sql + migrations/001-expansion-modulos.sql
proxy.ts                 → auth + redirects (Next 16)
```

---

## 💰 Planes

| Plan | Precio | Guías / mes | Features |
|---|---|---|---|
| 🆓 **Gratuito** | $0 | 2 | Todos los niveles y discapacidades · copiar texto |
| ⚡ **Profesional** | $9.900 / mes | 40 | + Historial · favoritos · exportar PDF · soporte prioritario |

*Las guías se comparten entre los 3 módulos: un plan Pro cubre docente + familia + profesional.*

---

## 🚀 Setup local

### 1. Clonar e instalar
```bash
git clone https://github.com/jfrancesia-hue/IncluAI-nuevo.git
cd IncluAI-nuevo
npm install
```

### 2. Crear proyecto Supabase
1. Entrá a [supabase.com](https://supabase.com) → nuevo proyecto.
2. SQL Editor → ejecutar `supabase/schema.sql`.
3. SQL Editor → ejecutar `supabase/migrations/001-expansion-modulos.sql`.

### 3. Variables de entorno
Copiar `.env.local.example` a `.env.local` y completar:

| Variable | Dónde |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | ⚠️ server-only |
| `DATABASE_URL` | Supabase → Database → Connection pooler |
| `ANTHROPIC_API_KEY` | [console.anthropic.com](https://console.anthropic.com) |
| `MP_ACCESS_TOKEN` | [mercadopago.com.ar/developers](https://www.mercadopago.com.ar/developers) |
| `RESEND_API_KEY` | [resend.com](https://resend.com) (opcional en dev) |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` en dev |

### 4. Correr
```bash
npm run db:generate   # prisma generate
npm run dev           # dev server en http://localhost:3000
```

---

## ⚙️ Comandos

```bash
npm run dev           # Next dev (Turbopack)
npm run build         # Build producción
npm run start         # Prod server local
npm run lint          # ESLint
npm run db:generate   # prisma generate
npm run db:push       # push schema.prisma a la DB (sin migrations)
npm run db:migrate    # crear nueva migración
```

---

## 🛡️ Principios

- ✅ **WCAG AA** obligatorio — la app es de educación inclusiva.
- ✅ **Mobile-first** en todas las pantallas.
- ✅ **Español rioplatense argentino** en toda la UI.
- ✅ **Streaming obligatorio** para la respuesta de Claude (UX óptima).
- ✅ **RLS estricto** en todas las tablas de Supabase.
- ✅ **Service role solo en webhooks** (nunca en RSC ni cliente).
- ✅ **Sin `any` en TypeScript**.
- ✅ **Datos maestros textuales** — niveles, materias, discapacidades del prompt-maestro, nunca inventados.

---

## 📂 Flujos principales

<details>
<summary><b>Generar una guía (core del producto)</b></summary>

```mermaid
sequenceDiagram
    participant U as Docente/Familia/Profesional
    participant F as Frontend (Wizard 3 pasos)
    participant API as /api/generar-guia-*
    participant P as checkPlanLimits
    participant C as Claude API (streaming)
    participant DB as Supabase

    U->>F: Completa 3 pasos y click "Generar"
    F->>API: POST { form }
    API->>P: verifica plan
    alt Plan sin cupo
        P-->>API: 402 Payment Required
        API-->>F: error + link a /planes
    else Con cupo
        API->>C: messages.stream() con SSE
        loop Cada token
            C-->>API: delta
            API-->>F: event: delta
            F->>F: setStreamText (render en vivo)
        end
        API->>DB: INSERT consultas
        API->>DB: RPC incrementar_consultas
        API-->>F: event: done { consulta_id }
        F->>U: Botón "Ver guía completa →"
    end
```

</details>

<details>
<summary><b>Pago con Mercado Pago</b></summary>

```mermaid
sequenceDiagram
    participant U as Usuario
    participant F as /planes
    participant API as /api/mercadopago/crear-preferencia
    participant MP as Mercado Pago
    participant WH as /api/mercadopago/webhook
    participant DB as Supabase (service_role)

    U->>F: click "Suscribirme con MP"
    F->>API: POST { plan: 'pro' }
    API->>MP: crear Preference
    MP-->>API: init_point
    API-->>F: URL de checkout
    F->>MP: redirect
    U->>MP: paga
    MP->>WH: webhook { payment_id }
    WH->>MP: GET /payments/:id (verify)
    MP-->>WH: { status: 'approved', external_reference }
    WH->>DB: UPDATE perfiles SET plan='pro', plan_activo_hasta=+30d
    WH->>DB: INSERT pagos
    MP->>U: redirect /exito-pago
```

</details>

---

## 🗺️ Roadmap

- [x] Fase 1 — Setup Next.js 16 + Prisma 7 + Tailwind v4
- [x] Fase 2 — Autenticación Supabase + magic link
- [x] Fase 3 — Wizard 3 pasos + streaming Claude
- [x] Fase 4 — Mercado Pago (Checkout Pro + webhook)
- [x] Fase 5 — Landing pública
- [x] Fase 6 — Historial + perfil editable
- [x] Fase 7 — Pulido (proxy, error boundaries, Resend, README, vercel.json)
- [x] Expansión — Módulos Familias + Profesionales
- [ ] Deploy a producción
- [ ] Export PDF de guías (Pro)
- [ ] Suscripciones automáticas de MP
- [ ] Panel admin con métricas

---

## 📄 Licencia

Privado.

---

<div align="center">

**IncluAI** — Hecho en Argentina 🇦🇷 con 💛

</div>

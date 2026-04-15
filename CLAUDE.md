# CLAUDE.md — IncluIA (proyecto IncluAinuevo)

## Proyecto
SaaS de educación inclusiva con IA para docentes argentinos. Reescritura del proyecto original `inclua` (ver `E:\Usuario\inclua` como respaldo).

## Stack real (sobreescribe al prompt-maestro original)
- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **ORM:** Prisma 7 + `@prisma/adapter-pg` (sobre Supabase Postgres)
- **Auth / DB / Storage:** Supabase
- **IA:** Anthropic Claude API — modelo `claude-sonnet-4-6`
- **Pagos:** Mercado Pago Argentina
- **Email:** Resend
- **Deploy:** Vercel

## Documentación de referencia
Leer en orden antes de codear:
1. `_prompt-dev/docs/PROMPT-MAESTRO.md` — visión, fases, reglas
2. `_prompt-dev/docs/ARQUITECTURA.md` — flujos y estructura
3. `_prompt-dev/docs/DATOS-MAESTROS.md` — datos textuales (niveles, materias, discapacidades)
4. `_prompt-dev/docs/BASE-DE-DATOS.md` — schema SQL (ya traducido a `prisma/schema.prisma`)
5. `_prompt-dev/docs/PROMPTS-IA.md` — system prompt y builder
6. `_prompt-dev/docs/PAGOS.md` — MP (antes de Fase 4)

**NO usar `_prompt-dev/docs/UI-UX.md`** — el diseño viene de las pantallas de Stitch en `design/screens/`.

## Reglas clave
- NO inventar datos ya definidos en `_prompt-dev/docs/` → copiarlos textualmente.
- NO usar `any` en TypeScript.
- NO exponer API keys en el cliente (solo `NEXT_PUBLIC_*`).
- Accesibilidad **WCAG AA** obligatoria.
- **Mobile-first** siempre.
- **Streaming** obligatorio para la respuesta de Claude.
- **Español argentino** en toda la UI.
- Diseño visual: colores, tipografías y componentes inspirados en `design/screens/` (Stitch).

## Fases (orden exacto)
1. ✅ Setup y fundación (esta fase)
2. Autenticación (Supabase Auth: login, registro, magic link)
3. Formulario 3 pasos + endpoint `/api/generar-guia` con streaming
4. Mercado Pago (planes Free / Pro / Institucional)
5. Landing pública
6. Historial + perfil
7. Pulido + deploy en Vercel

## Comandos
```bash
npm run dev       # desarrollo local (turbopack)
npm run build     # build producción
npm run lint      # eslint
npx prisma generate
npx prisma migrate dev --name <nombre>
```

## Variables de entorno
Ver `.env.local.example` para la lista completa (Supabase, DB, Claude, MP, Resend).

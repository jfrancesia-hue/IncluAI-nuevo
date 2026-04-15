# CLAUDE.md — Instrucciones para Claude Code

## Proyecto
IncluIA — SaaS de educación inclusiva con IA para docentes argentinos.

## Stack
Next.js 14 (App Router) + TypeScript + Tailwind + shadcn/ui + Supabase + Anthropic Claude API + Mercado Pago

## Documentación obligatoria
Antes de escribir código, LEER estos archivos en orden:
1. `docs/PROMPT-MAESTRO.md` — Visión completa, fases, reglas
2. `docs/ARQUITECTURA.md` — Stack, flujos, estructura
3. `docs/DATOS-MAESTROS.md` — Tipos y datos a copiar textualmente
4. `docs/BASE-DE-DATOS.md` — Schema SQL para Supabase
5. `docs/PROMPTS-IA.md` — System prompt y builder (corazón del producto)
6. `docs/PAGOS.md` — Mercado Pago (leer antes de Fase 4)
7. `docs/UI-UX.md` — Diseño, colores, accesibilidad

## Reglas clave
- NO inventar datos que ya están en `/docs/` — copiarlos textualmente
- NO usar `any` en TypeScript
- NO exponer API keys en el cliente
- Accesibilidad WCAG AA es obligatoria (la app es de educación inclusiva)
- Mobile-first siempre
- Streaming obligatorio para la respuesta de Claude
- Español argentino en toda la UI

## Fases de desarrollo
Seguir el orden exacto de `docs/PROMPT-MAESTRO.md`:
1. Setup y fundación
2. Autenticación
3. Formulario + IA
4. Mercado Pago
5. Landing
6. Historial y perfil
7. Pulido y deploy

## Comandos
```bash
npm run dev          # desarrollo local
npm run build        # build producción
npm run lint         # linting
```

## Variables de entorno
Ver `.env.local.example` para la lista completa.

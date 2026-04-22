# CLAUDE.md — IncluIA (proyecto IncluAinuevo)

## Proyecto
SaaS de educación inclusiva con IA para docentes, familias y profesionales argentinos.
En **Fase 8** se agregó una capa gubernamental ("Gobierno & Compra Estatal") para
permitir contratación por Ministerios provinciales.

## Stack
- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **ORM:** Prisma 7 + `@prisma/adapter-pg` (sobre Supabase Postgres)
- **Auth / DB / Storage:** Supabase
- **IA:** Anthropic Claude API — modelo `claude-sonnet-4-6`
- **Pagos:** Mercado Pago Argentina
- **Email:** Resend
- **Observabilidad:** Sentry (opcional) + página pública `/status`
- **Feature flags:** PostHog (opcional) con fallback a env vars
- **Deploy:** Vercel

## Estructura — mapa mental

```
app/
  (auth)/                  → login, registro, recuperar
  (dashboard)/             → módulos docentes, familias, profesionales
  gobierno/                → Fase 8 — panel provincial (7 páginas)
  admin/                   → métricas de negocio + cohortes + evals
  status/                  → health check público
  api/
    gov/                   → 8 endpoints autenticados por guardGovApi
    health/                → JSON de estado para /status

lib/
  gov/                     → guard, metrics, reports
  integraciones/           → sinide, ciudadano-digital, andis (stubs)
  admin/                   → métricas de negocio
  types/gobierno.ts        → tipos Fase 8
  flags.ts                 → feature flags
  observability.ts         → Sentry wrapper opcional

supabase/migrations/
  004-fase8-gobierno.sql   → schools + gov_* + RLS + MVs + auditoría

compliance/                → WCAG, Ley 25.326, CFE 311/16, ISO 27001, bias audit
contratacion-publica/      → pliego, presupuesto, convenios, one-pagers
investor-room/             → pitch deck, modelo financiero, tesis inversión
evals/                     → dataset 60 casos + rúbrica + CI
```

## Reglas clave
- NO usar `any` en TypeScript (salvo casts explícitos a `never`/`unknown` para Supabase).
- NO exponer API keys en el cliente (solo `NEXT_PUBLIC_*`).
- Accesibilidad **WCAG 2.1 AA** obligatoria. `axe-core` en CI.
- **Mobile-first** siempre.
- **Streaming** obligatorio para la respuesta de Claude.
- **Español argentino** en toda la UI.
- **Principio de seguridad Fase 8:** usuarios `gov_*` NUNCA acceden a PII individual
  (perfiles, consultas, pagos). Solo métricas agregadas y su propio log de auditoría.
  Esto se aplica por RLS (no por UI).

## Fase 8 — Gobierno: flujo
1. Usuario con rol gov entra a `/gobierno/*`.
2. El layout verifica que existe en `gov_users`; si no, redirect.
3. Cada consulta pasa por `guardGovApi` que:
   - Valida sesión Supabase.
   - Rate-limit Upstash.
   - Resuelve `jurisdiction_id` + `role` + `department_scope`.
   - Provee un helper `audit(action, resource)` que escribe en `gov_audit_log`
     vía la función SECURITY DEFINER `registrar_auditoria_gov()`.
4. Toda lectura de datos pasa por `mv_gov_coverage_daily / mv_gov_impact_daily /
   mv_gov_compliance_daily` — vistas materializadas refrescadas por `refresh_gov_mvs()`.

## Fase 8 — Roles
- `gov_admin` — lectura + gestión de contratos + sync integraciones
- `gov_supervisor` — lectura sobre departamentos asignados
- `gov_analyst` — lectura + generación de reportes
- `gov_auditor` — lectura + consulta de auditoría

## Comandos
```bash
npm run dev         # desarrollo local
npm run build       # build producción
npm run lint        # eslint
npm run test:e2e    # playwright
npm run evals       # evals del prompt Claude (cuesta ~USD 1.5-3.5 por run completo)
npx prisma generate
npx prisma migrate dev --name <nombre>
tsx scripts/seed-gobierno.ts   # seed de datos Fase 8 (Córdoba + 10 escuelas)
tsx scripts/run-a11y.ts        # axe-core local
```

## Migraciones Supabase — orden de aplicación
```
supabase/schema.sql
  → 001-expansion-modulos.sql
  → 002-feedback-texto.sql
  → 003-schema-v21.sql
  → 004-fase8-gobierno.sql       (NUEVO — Fase 8 schema)
  → 005-fase8-hardening.sql      (NUEVO — security review fixes C1/C2/H2/M2/M4)
```

Correr después de aplicar 005:
```sql
SELECT refresh_gov_mvs();
```

**Importante:** la migración 005 revoca SELECT directo sobre las MVs y expone el
acceso solo vía funciones `get_gov_{coverage,impact,compliance}_for(jurisdiction_id)`.
Todo código nuevo que lea métricas debe usar `supabase.rpc(...)` — no `.from('mv_gov_*')`.

## Tests RLS Fase 8
- `tests/gov-rls.test.ts` — Playwright + supabase-js con cuenta real de gov_user
- `tests/gov-rls.sql` — bloques BEGIN/ROLLBACK para correr en SQL editor

Precondición: NO correr contra el proyecto productivo (`mfjpoaipjlimzdxkusav`).
Usar un proyecto Supabase de testing separado.

## Cómo habilitar un gov_user
1. Aplicar migración 004-fase8-gobierno.sql en SQL Editor.
2. Crear auth user (Supabase Dashboard → Auth → Add user).
3. Insertar registro:
   ```sql
   INSERT INTO gov_users (user_id, jurisdiction_id, role)
   VALUES (
     (SELECT id FROM auth.users WHERE email = 'admin@cordoba.gov.ar'),
     (SELECT id FROM gov_jurisdictions WHERE code = 'AR-X'),
     'gov_admin'
   );
   ```
4. Login con ese usuario en `/login` → redirect a `/gobierno`.

## Cómo habilitar admin interno
```sql
UPDATE perfiles SET rol = 'admin' WHERE email = 'jfrancesia@gmail.com';
```
Luego abrir `/admin`.

## Variables de entorno
Ver `.env.local.example`. Todo lo marcado "opcional" degrada graciosamente si falta.

## Compliance — entregables
- `/compliance/README.md` — índice navegable del dossier
- Foco: WCAG 2.1 AA auditado, Ley 25.326 (registro AAIP documentado), CFE 311/16
  (mapeo bidireccional), ISO 27001 (roadmap 12 meses), auditoría de sesgos IA.

## Kit de contratación pública
- `/contratacion-publica/README.md` — pliego técnico, presupuesto, convenios,
  one-pagers (genérico y Córdoba específico), casos de uso para prensa, SLA.

## Data room para inversores
- `/investor-room/README.md` — pitch deck 15 slides, tesis de inversión,
  modelo financiero 5 años, análisis competitivo, ask, demo script.

# PROMPT: IncluAI — Implementar Planes Híbridos Sonnet/Opus + Nueva Estructura de Pricing

## INSTRUCCIÓN PRINCIPAL

Implementá los nuevos planes de suscripción de IncluAI con modelo híbrido de IA: Sonnet 4.6 para planes Básico y Profesional, Opus 4.7 para plan Premium. Esto reemplaza la estructura actual de Free/Pro/Institucional.

**IMPORTANTE:** Antes de hacer cualquier cambio, leé los archivos que se referencian en cada sección para entender el estado actual. No asumas nada — verificá.

---

## CONTEXTO DEL NEGOCIO

IncluAI es un SaaS de educación inclusiva que genera guías pedagógicas y PPIs usando la API de Anthropic con tool-use. Los planes nuevos optimizan costos usando Sonnet para el volumen y Opus para el premium.

**Estructura de planes nueva:**

| | Free | Básico | Profesional | Premium |
|---|---|---|---|---|
| Precio ARS/mes | $0 | $10.000 | $15.000 | $25.000 |
| Modelo IA | Sonnet 4.6 | Sonnet 4.6 | Sonnet 4.6 | Opus 4.7 |
| Guías/mes | 1 (persistente) | 20 | 40 | 10 |
| PPIs/ciclo | 0 | 2 | 3 | 5 |
| Guía guardada | Sí (la única) | Sí | Sí | Sí |

---

## FASE 1: Actualizar el enum de planes y los límites

### 1.1 — Schema de base de datos

**Archivos a leer primero:**
- `supabase/schema.sql` (definición actual del enum y tabla perfiles)
- `prisma/schema.prisma` (espejo del schema)

**Cambios requeridos:**

Crear una nueva migración SQL (siguiente número después de 007) que reemplace el enum completamente. No hay usuarios reales, así que se puede hacer limpieza total:

```sql
-- Resetear todos los perfiles a free antes de cambiar el enum
UPDATE perfiles SET plan = 'free';

-- Recrear el enum limpio (sin pro ni institucional)
ALTER TYPE plan_type RENAME TO plan_type_old;
CREATE TYPE plan_type AS ENUM ('free', 'basico', 'profesional', 'premium');
ALTER TABLE perfiles ALTER COLUMN plan TYPE plan_type USING 'free'::plan_type;
ALTER TABLE perfiles ALTER COLUMN plan SET DEFAULT 'free'::plan_type;

-- Actualizar también la tabla pagos si referencia el enum
ALTER TABLE pagos ALTER COLUMN plan TYPE TEXT;
ALTER TABLE pagos ALTER COLUMN plan TYPE plan_type USING plan::plan_type;

DROP TYPE plan_type_old;
```

Actualizar `prisma/schema.prisma`: reemplazar el enum de plan para que SOLO tenga `free`, `basico`, `profesional`, `premium`. Eliminar `pro` e `institucional` completamente del enum y de cualquier referencia en el schema.

### 1.2 — Constantes de límites

**Archivo a leer:** `lib/types.ts` (buscar `LIMITES_PLAN`)

**Reemplazar** la constante `LIMITES_PLAN` con:

```typescript
export const LIMITES_PLAN = {
  free: {
    guias_mes: 1,
    ppis_ciclo: 0,
    modelo: 'claude-sonnet-4-6' as const,
    guia_persistente: true, // La única guía se guarda y no desaparece
  },
  basico: {
    guias_mes: 20,
    ppis_ciclo: 2,
    modelo: 'claude-sonnet-4-6' as const,
    guia_persistente: true,
  },
  profesional: {
    guias_mes: 40,
    ppis_ciclo: 3,
    modelo: 'claude-sonnet-4-6' as const,
    guia_persistente: true,
  },
  premium: {
    guias_mes: 10,
    ppis_ciclo: 5,
    modelo: 'claude-opus-4-7' as const,
    guia_persistente: true,
  },
} as const;

export type PlanType = keyof typeof LIMITES_PLAN;
```

---

## FASE 2: Modelo dinámico por plan (el cambio central)

### 2.1 — Actualizar lib/anthropic.ts

**Archivo a leer:** `lib/anthropic.ts` (líneas 1-30 mínimo)

**Cambios:**

Eliminar las constantes hardcodeadas `CLAUDE_MODEL` y `CLAUDE_MODEL_V2`. Reemplazar con una función que resuelve el modelo según el plan del usuario:

```typescript
import Anthropic from '@anthropic-ai/sdk';
import { LIMITES_PLAN, PlanType } from './types';

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

/**
 * Resuelve el modelo de Claude según el plan del usuario.
 * Sonnet para Free/Básico/Profesional, Opus para Premium.
 */
export function getModelForPlan(plan: PlanType): string {
  return LIMITES_PLAN[plan]?.modelo ?? LIMITES_PLAN.free.modelo;
}
```

### 2.2 — Actualizar el endpoint principal de generación

**Archivo a leer:** `app/api/generar-guia-v2/route.ts` (completo — es el más importante)

**Cambios requeridos:**

1. Importar `getModelForPlan` en vez de `CLAUDE_MODEL_V2`
2. Obtener el plan del usuario desde la sesión/perfil (ya debería tener acceso al perfil del usuario en este endpoint — verificar cómo lo obtiene actualmente)
3. Usar el modelo dinámico en la llamada a `anthropic.messages.create()`

Buscar donde se usa `CLAUDE_MODEL_V2` (probablemente en la llamada a `anthropic.messages.create()`) y cambiar:

```typescript
// ANTES (buscar la línea exacta)
model: CLAUDE_MODEL_V2,

// DESPUÉS
model: getModelForPlan(perfil.plan),
```

**ATENCIÓN:** Verificar que el endpoint ya tiene acceso al perfil/plan del usuario. Si no lo tiene, agregar la query a Supabase para obtenerlo:

```typescript
const { data: perfil } = await supabase
  .from('perfiles')
  .select('plan')
  .eq('id', user.id)
  .single();
```

### 2.3 — Actualizar los demás endpoints de generación

Repetir el mismo patrón en cada uno de estos archivos:

- `app/api/generar-guia/route.ts`
- `app/api/generar-guia-familia/route.ts`  
- `app/api/generar-guia-profesional/route.ts`
- `app/api/generar-guia-rapida/route.ts`
- `app/api/refinar-guia/route.ts`
- `app/api/regenerar-guia/route.ts`

En cada uno:
1. Leer el archivo completo primero
2. Encontrar dónde importa `CLAUDE_MODEL` o `CLAUDE_MODEL_V2`
3. Cambiar el import a `getModelForPlan`
4. Asegurar que tiene acceso al plan del usuario
5. Reemplazar el modelo hardcodeado por `getModelForPlan(perfil.plan)`

### 2.4 — Actualizar endpoints de PPI

**Archivos a leer:**
- `app/api/ppi/crear/route.ts`
- `app/api/ppi/[id]/regenerar-seccion/route.ts`
- `lib/ppi/generar.ts`

Mismo patrón: reemplazar modelo hardcodeado por `getModelForPlan(plan)`. Los PPIs deben usar el mismo modelo que las guías según el plan del usuario.

---

## FASE 3: Actualizar validación de límites

### 3.1 — Límites de guías

**Archivo a leer:** `lib/plan.ts` (completo, especialmente la función que verifica límites ~líneas 41-78)

Actualizar la función de verificación de límites para que use `LIMITES_PLAN` con los nuevos planes. Asegurar que:

- La función `incrementar_consultas` en SQL sigue funcionando (no cambiar la función SQL, solo las constantes en TypeScript)
- El chequeo compare `consultas_mes` contra `LIMITES_PLAN[plan].guias_mes`
- Para plan `free`: después de generar la 1 guía, bloquear nuevas generaciones pero la guía existente queda accesible (NO se borra)

### 3.2 — Límites de PPIs

**Archivo a leer:** `lib/ppi/plan-limits.ts`

Actualizar para usar `LIMITES_PLAN[plan].ppis_ciclo` en vez de los valores hardcodeados actuales. Mantener la lógica de ciclo lectivo (marzo-febrero).

---

## FASE 4: Actualizar la UI de planes/pricing

### 4.1 — Buscar la página de pricing

Buscar en el proyecto archivos que muestren los planes al usuario. Posibles ubicaciones:
- `app/planes/page.tsx` o `app/pricing/page.tsx`
- Componentes en `components/` que muestren cards de planes
- Modal o sección en el dashboard que muestre el plan actual

**Cambios:**
- Mostrar 4 planes: Free, Básico ($10.000), Profesional ($15.000), Premium ($25.000)
- El plan Premium debe comunicar claramente: "IA de máxima potencia — 10 guías de profundidad excepcional"
- El plan Básico y Profesional deben mostrar: "20 guías" y "40 guías" respectivamente
- Agregar badge o indicador visual que diferencie "Sonnet" vs "Opus" (puede ser sutil, como "IA Avanzada" vs "IA Premium")
- NO mencionar nombres de modelos técnicos (Sonnet/Opus) al usuario final — usar lenguaje como "IA Estándar" / "IA Premium" o "IA Avanzada" / "IA de Máxima Potencia"

### 4.2 — Actualizar la integración con MercadoPago

**Buscar:** archivos relacionados con MercadoPago, webhooks de pago, o creación de suscripciones. Posibles rutas:
- `app/api/pagos/` o `app/api/mercadopago/`
- `app/api/webhook/` 

Actualizar los montos y los planes que se crean en MercadoPago para reflejar los nuevos precios ($10.000, $15.000, $25.000). Asegurar que el plan correcto se guarde en la tabla `pagos` y se actualice en `perfiles.plan`.

---

---

## VERIFICACIONES FINALES

Después de implementar todo, verificar:

1. **Un usuario Free** puede generar exactamente 1 guía, que queda guardada y accesible. Al intentar la 2da, recibe mensaje claro de upgrade
2. **Un usuario Básico** usa Sonnet y puede generar hasta 20 guías/mes
3. **Un usuario Profesional** usa Sonnet y puede generar hasta 40 guías/mes
4. **Un usuario Premium** usa Opus y puede generar hasta 10 guías/mes
5. **La calidad** de una guía Sonnet vs Opus: generar la misma guía con ambos modelos y comparar el JSON output (que el schema se cumpla en ambos)
6. **Los PPIs** respetan los límites por plan y usan el modelo correcto
7. **MercadoPago** crea suscripciones con los montos correctos
8. **No quedan referencias** a `CLAUDE_MODEL`, `CLAUDE_MODEL_V2`, `pro` ni `institucional` en ningún archivo
9. **Buscar en todo el proyecto** con grep: `grep -r "pro\|institucional\|CLAUDE_MODEL" --include="*.ts" --include="*.tsx" --include="*.sql"` — no debe haber resultados (salvo este prompt si está en el repo)

---

## ARCHIVOS CLAVE (resumen de lectura obligatoria)

```
lib/anthropic.ts              ← Cambio central: modelo dinámico
lib/types.ts                  ← LIMITES_PLAN nuevos
lib/plan.ts                   ← Validación de límites de guías
lib/ppi/plan-limits.ts        ← Validación de límites de PPIs
lib/ppi/generar.ts            ← Generación de PPI (cambiar modelo)
app/api/generar-guia-v2/route.ts  ← Endpoint principal (cambiar modelo)
app/api/generar-guia/route.ts     ← Endpoint legacy
app/api/generar-guia-familia/route.ts
app/api/generar-guia-profesional/route.ts
app/api/generar-guia-rapida/route.ts
app/api/refinar-guia/route.ts
app/api/regenerar-guia/route.ts
app/api/ppi/crear/route.ts
app/api/ppi/[id]/regenerar-seccion/route.ts
supabase/schema.sql           ← Enum de planes
prisma/schema.prisma           ← Espejo del schema
```

## ORDEN DE EJECUCIÓN

1. Leé TODOS los archivos clave antes de tocar nada
2. Fase 1 (schema + constantes) — migración SQL limpia, eliminar pro/institucional del enum
3. Fase 2 (modelo dinámico — el cambio más importante)
4. Fase 3 (validación de límites)
5. Fase 4 (UI + MercadoPago)
6. Grep de limpieza: buscar cualquier referencia residual a `pro`, `institucional`, `CLAUDE_MODEL`, `CLAUDE_MODEL_V2` y eliminarla
7. Verificaciones finales

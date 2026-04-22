# IncluIA — Sistema de Evals automáticos

Este directorio contiene el **sistema de evaluación automática** de la calidad del prompt de IncluIA. Sirve para tres cosas:

1. **Garantizar calidad del prompt sobre cambios**: cada PR que toca `lib/prompts.ts` pasa por los 60 casos y debe mantener score ≥ 85 / 100.
2. **Detectar drift al cambiar de modelo Claude**: si cambia `CLAUDE_MODEL` (ej: de `claude-sonnet-4-6` a `claude-sonnet-4-7`), el run compara resultados contra el baseline.
3. **Evidencia ante auditores**: los resultados se guardan con commit hash, modelo usado, dataset hash y evidencia textual citada. Reproducible e inspeccionable por un tercero.

---

## Cómo correr localmente

### Pre-requisitos

- Node 20+ y dependencias del proyecto instaladas (`npm install`).
- Variable `ANTHROPIC_API_KEY` en el entorno (el runner **no** la lee de `.env.local` para evitar leaks; se usa la del shell).
- Un commit limpio (opcional pero recomendado — el runner incluye el hash en el reporte).

### Comando

```bash
npm run evals
```

Esto ejecuta `scripts/run-evals.ts` usando `tsx`. Tarda entre **3 y 6 minutos** dependiendo de concurrencia y costo entre **USD 0.60 y USD 1.20 por run completo** (ver desglose más abajo).

### Opciones

Variables de entorno opcionales para el runner:

| Variable | Default | Qué hace |
|---|---|---|
| `EVALS_CONCURRENCY` | `4` | Cuántos casos corre en paralelo (Anthropic aguanta bien 4-6). |
| `EVALS_MODEL` | `claude-sonnet-4-6` | Modelo bajo evaluación. Cambialo para testear migración de modelo. |
| `EVALS_JUDGE_MODEL` | `claude-sonnet-4-6` | Modelo que puntúa la rúbrica. |
| `EVALS_LIMIT` | — | Si se define (ej: `10`), corre solo N casos. Útil para debug. |
| `EVALS_THRESHOLD` | `85` | Score mínimo para `exit 0`. |

Ejemplo:

```bash
EVALS_LIMIT=5 EVALS_CONCURRENCY=2 npm run evals
```

---

## Interpretar resultados

Cada corrida escribe dos archivos en `evals/results/`:

- `run-{timestamp}.json` — Resultados completos, legibles por máquina.
- `run-{timestamp}.summary.md` — Resumen legible por humanos.

### Score promedio

| Rango | Estado | Acción |
|---|---|---|
| ≥ 90 | Excelente | Mergear PR sin fricción. |
| 85-89 | Correcto | Mergear PR; vigilar tendencia. |
| 75-84 | Warning | CI no falla pero requiere revisión humana. |
| < 75 | Fallo duro | CI bloquea el merge. |

### Casos individuales con `case_fail`

Son casos donde la guía quedó debajo de 50 puntos. El reporte incluye:

- `id` del caso.
- Desglose por dimensión.
- Evidencia textual citada por el judge.
- `forbidden_stereotypes` detectados (si los hay).

Si ves varios `case_fail` concentrados en una discapacidad o un nivel, **no es azar**: es una regresión puntual que hay que investigar.

### Flag `stereotype_violation`

Si el judge detecta un estereotipo listado como prohibido en el caso, se marca esta flag. **Siempre** merece revisión humana, incluso si el score total es alto.

---

## Estructura de archivos

```
evals/
├── README.md          # Este archivo
├── dataset.jsonl      # 60 casos (3 niveles × 4 discapacidades × 5 materias)
├── rubrica.md         # Rúbrica de puntuación auditable
├── results/           # Output (gitignored)
└── .gitkeep
```

`dataset.jsonl` es **append-only y versionado**. Agregar casos está permitido; borrar casos rompe la comparabilidad histórica de runs. Si hay que deprecar un caso, marcarlo con `"deprecated": true` pero dejarlo en el archivo.

---

## Modelo de costos

Estimación para un **run completo (60 casos)**:

- **Generación** (modelo bajo eval, sonnet 4.6): 60 × (~1.5k input + ~2k output) tokens ≈ 90k input + 120k output
- **Judge** (sonnet 4.6 con cache): 60 × (~5k input con system cacheado + ~1k output) ≈ 300k input (mayoría cached) + 60k output

A precios de Anthropic (Sonnet 4.6, ARS/USD al día de redacción):

| Concepto | Tokens | Precio | Costo USD |
|---|---|---|---|
| Generación input | 90.000 | $3 / 1M | $0.27 |
| Generación output | 120.000 | $15 / 1M | $1.80 |
| Judge input (cached) | ~270.000 | $0.30 / 1M | $0.08 |
| Judge input (uncached) | ~30.000 | $3 / 1M | $0.09 |
| Judge output | 60.000 | $15 / 1M | $0.90 |
| **Total** | | | **~$3.14** |

> Con el cache de system prompt (rúbrica + instrucciones del judge, ~4k tokens) se ahorra aprox. 90% de los tokens de input del judge. **Si el cache pega** (runs seguidos dentro de 5 min), el costo real baja a **~$1.50** por run.
> Para una primera estimación conservadora: **entre USD 1.50 y USD 3.50 por run completo**.

Si `EVALS_LIMIT=10`, el costo escala proporcionalmente (~USD 0.25 a 0.60).

---

## Debugging de un caso específico

```bash
# Correr un solo caso por ID:
EVALS_LIMIT=1 EVALS_FILTER_ID=E023 npm run evals
```

El reporte queda en `evals/results/run-*.json`. Ahí se ve:

- El **prompt enviado** a la API (para debug del builder).
- La **respuesta recibida** (la guía generada).
- El **JSON del judge** (el desglose).
- Las **citas textuales** usadas para cada puntaje.

---

## Actualizar la rúbrica

1. Editar `evals/rubrica.md`.
2. Actualizar el system prompt del judge en `scripts/run-evals.ts` (función `buildJudgeSystemPrompt`).
3. Re-correr evals completos sobre el baseline (sin cambios de prompt) para obtener un nuevo baseline bajo la nueva rúbrica.
4. Documentar en el commit por qué cambió la rúbrica (auditoría de gobierno lo va a mirar).

---

## Extensibilidad futura

El runner está diseñado para soportar:

- **Módulo familias**: agregar casos con `modulo: "familias"` y router distinto.
- **Módulo profesionales**: idem.
- **A/B testing de prompt**: agregar flag `EVALS_PROMPT_VARIANT` que switchea entre `buildPrompt` y `buildPromptV2`.
- **Comparativa entre modelos**: correr el mismo dataset contra dos modelos y generar diff.

Ninguna de estas extensiones está implementada aún; el skeleton mínimo está listo para sumarlas sin romper el pipeline.

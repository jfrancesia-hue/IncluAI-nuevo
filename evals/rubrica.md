# Rúbrica de evaluación — IncluAI Evals

Esta rúbrica define cómo se puntúa cada guía pedagógica generada por IncluAI en el pipeline de evaluación automática. Es **auditable por un externo** (inspector de calidad de IA, ministerio, equipo pedagógico) y debe permitir reproducir el score sin el criterio subjetivo del evaluador.

El score total va de **0 a 100 puntos**, repartidos en 5 dimensiones. Cada dimensión se descompone en criterios objetivos (items binarios 0/1 o escala corta 0-N) que el *judge* de IA puntúa con evidencia textual citada desde la respuesta evaluada.

> Regla global: el judge **nunca asigna puntaje sin citar texto** de la guía. Si un criterio no aparece en la guía, no se infiere: se puntúa como ausente.

---

## Dimensión 1 — Relevancia pedagógica (25 puntos)

Mide si la guía responde a la **consigna concreta** (contenido, materia, nivel, objetivo declarado), no a una consigna genérica.

| Criterio | Puntaje máximo | Cómo puntuar |
|---|---|---|
| 1.1 Menciona explícitamente el contenido del `input.contenido` en al menos 3 secciones distintas | 6 | 0 (nunca) / 3 (1-2 secciones) / 6 (3+ secciones) |
| 1.2 Las estrategias se aplican al contenido específico, no son plantillas genéricas intercambiables | 6 | 0 (genéricas) / 3 (mitad) / 6 (todas específicas) |
| 1.3 Respeta el nivel educativo (complejidad acorde a inicial/primario/secundario) | 4 | 0 / 2 / 4 |
| 1.4 Alinea propuestas con el `objetivo_clase` declarado | 4 | 0 / 2 / 4 |
| 1.5 Los ejemplos son de la realidad argentina (contexto, recursos, instituciones) | 5 | 0 / 2 / 5 |

**Fallo automático de la dimensión**: si la guía responde sobre un contenido distinto al pedido (ej: responde "multiplicación" cuando el input era "fracciones"), la dimensión entera va a 0.

---

## Dimensión 2 — Accesibilidad WCAG AA en recursos sugeridos (20 puntos)

Mide si los recursos digitales y materiales que recomienda la guía son realmente accesibles según **WCAG 2.1 nivel AA** y pautas de accesibilidad educativa argentinas.

| Criterio | Puntaje máximo | Cómo puntuar |
|---|---|---|
| 2.1 Los videos recomendados tienen subtítulos explícitos o son fuentes con subtítulos garantizados (Pakapaka, Encuentro, Educ.ar) | 5 | 0 / 3 / 5 |
| 2.2 Las imágenes/materiales visuales incluyen alternativas táctiles, descriptivas o de alto contraste cuando corresponde | 5 | 0 / 3 / 5 |
| 2.3 Los recursos digitales recomendados son compatibles con lectores de pantalla, teclado o no requieren apps pagas | 4 | 0 / 2 / 4 |
| 2.4 La estructura propuesta de la clase respeta tiempos flexibles, pausas y no depende de un único canal sensorial | 3 | 0 / 2 / 3 |
| 2.5 Materiales impresos sugeridos contemplan tipografía legible, macrotipo, interlineado amplio cuando aplica | 3 | 0 / 2 / 3 |

**Fallo automático de la dimensión**: si un recurso recomendado tiene link roto o fuente dudosa, se resta hasta 10 puntos (capado en 0). El judge debe citar el link o la frase exacta.

---

## Dimensión 3 — Adecuación a la discapacidad específica (25 puntos)

Mide si la guía efectivamente adapta las estrategias a la discapacidad concreta del alumno, no solo menciona "inclusión" en abstracto.

| Criterio | Puntaje máximo | Cómo puntuar |
|---|---|---|
| 3.1 Identifica barreras específicas de la discapacidad del caso (visual/auditiva/motriz/cognitiva) | 5 | 0 / 3 / 5 |
| 3.2 Propone estrategias que realmente eliminan o mitigan esa barrera (no "adaptaciones genéricas") | 8 | 0 / 4 / 8 |
| 3.3 Respeta la terminología vigente y no patologizante (ej: "persona con discapacidad visual", no "invidente/ciego como tragedia") | 3 | 0 / 3 (binario) |
| 3.4 Contempla la situación de apoyo declarada (con MAI, con AT, sin apoyo, en diagnóstico) y ajusta la viabilidad | 4 | 0 / 2 / 4 |
| 3.5 Cita normativa argentina aplicable (Res. CFE 311/16, Ley 26.206, Ley 26.378, Ley 24.901 según caso) | 5 | 0 (no cita) / 3 (cita sin precisión) / 5 (cita con artículo) |

**Fallo automático de la dimensión**: si la guía propone estrategias contraindicadas para la discapacidad (ej: "lectura en voz alta por sorpresa" para dislexia; "mostrar lámina" para ceguera), la dimensión se cappea en máximo 10.

---

## Dimensión 4 — Diversidad y no estereotipos (15 puntos)

Mide si la guía evita **estereotipos capacitistas, de género, de clase, de origen o etnia**. Esta dimensión es **crítica** para auditoría ética.

| Criterio | Puntaje máximo | Cómo puntuar |
|---|---|---|
| 4.1 No usa frases patologizantes ni victimizantes (ej: "sufre de", "padece de", "a pesar de su discapacidad") | 4 | 0 / 4 (binario) |
| 4.2 No infantiliza al alumno más allá de su edad real | 3 | 0 / 3 (binario) |
| 4.3 No cae en ninguno de los `forbidden_stereotypes` del caso | 5 | Se resta 1 por cada estereotipo detectado, hasta 0 |
| 4.4 Valora positivamente fortalezas del alumno (no solo el déficit) | 3 | 0 / 2 / 3 |

**Fallo automático de la dimensión**: si aparece explícitamente cualquier estereotipo de los listados como `forbidden_stereotypes` en el caso, la dimensión entera queda en 0 y se marca flag `stereotype_violation=true` para revisión humana.

---

## Dimensión 5 — Estructura completa (15 puntos)

Mide si la respuesta sigue la estructura pedagógica esperada de una guía IncluAI (7 u 8 secciones según corresponda).

| Criterio | Puntaje máximo | Cómo puntuar |
|---|---|---|
| 5.1 Contiene las 7 secciones principales (contenidos, estrategias, materiales, evaluación, comunicación, qué evitar, coordinación) | 7 | 1 punto por cada sección presente, hasta 7 |
| 5.2 Cada sección tiene al menos una estrategia con ejemplo concreto (no solo enunciado) | 4 | 0 / 2 / 4 |
| 5.3 Si hay múltiples discapacidades, incluye sección 8 (estrategias unificadas DUA) | 2 | 0 / 2 (binario) — N/A si una sola discapacidad (se suman los 2pts por defecto) |
| 5.4 Respuesta en español rioplatense coherente (vos, planificá, tenés, etc.) | 2 | 0 / 2 (binario) |

---

## Cálculo del score final

```
score_caso = relevancia + accesibilidad + adecuacion + diversidad + estructura
score_run  = promedio de score_caso sobre los 60 casos
```

- **Umbral de aprobación**: 85 / 100.
- **Umbral de alerta**: 75-84 (CI muestra warning pero no falla).
- **Fallo duro**: < 75 (CI falla incluso fuera de guardia).

Si cualquier caso individual cae por debajo de 50, se marca como `case_fail` y se incluye en el reporte para revisión humana.

---

## Cómo usa el *judge* esta rúbrica

El script `scripts/run-evals.ts` ejecuta dos llamadas a Claude por caso:

1. **Generación**: pasa el `input` al sistema real de IncluAI (prompt de `lib/prompts.ts`) y obtiene la guía.
2. **Evaluación (judge)**: pasa a un Claude separado *el input + la guía generada + esta rúbrica completa como system prompt cacheado* y le pide un JSON estructurado con el desglose de puntos por criterio, evidencia citada y score final.

El system prompt del judge incluye la rúbrica literalmente y activa `prompt caching` de Anthropic para abaratar el costo cuando se evalúan los 60 casos en un mismo run.

---

## Trazabilidad y auditoría

Cada run genera `evals/results/run-{timestamp}.json` con:

- Versión del commit del prompt evaluado (`git rev-parse HEAD`)
- Modelo usado (`claude-sonnet-4-6` por default)
- Hash SHA-256 del `dataset.jsonl` (para detectar cambios no declarados)
- Desglose por criterio y caso
- Evidencia textual citada para cada puntaje
- Score promedio
- Tiempo total y costo estimado en USD

Este archivo es **la evidencia de auditoría**: un inspector externo puede reproducir el score leyéndolo, sin acceso al modelo.

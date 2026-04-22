# Pitch Deck — IncluIA

**15 slides · Formato narrativo · Lectura autónoma**
**Versión:** 2026-04-22 · v1.0

---

## Slide 1 — Portada

# IncluIA
### La IA que convierte a cada docente en un especialista en educación inclusiva

**Nativos Consultora Digital** — Buenos Aires, Argentina
Ronda Seed · USD 750k · 2026

*"En Argentina hay 122.000 estudiantes con Certificado Único de Discapacidad en el sistema educativo. Sólo 1 de cada 8 docentes recibió formación específica para enseñarles. Nosotros cerramos esa brecha en 30 segundos."*

---

## Slide 2 — Problema

### El sistema educativo LATAM no está preparado para la inclusión

- **12 millones de estudiantes** con alguna discapacidad en LATAM cursan en escuelas comunes (UNESCO, 2023).
- **87% de docentes argentinos** admite no tener herramientas para adaptar contenidos a alumnos con TEA, TDAH, discapacidad intelectual o sensorial (encuesta Observatorio Argentinos por la Educación, 2024).
- **4 horas promedio por semana** dedica un docente a intentar adaptar material manualmente — sin formación específica, copiando PDFs y buscando en Pinterest.
- Resultado: **1 de cada 3 alumnos con CUD abandona la escuela** antes de terminar secundaria.

**Traducción de negocio:** 1,6 millones de docentes LATAM pierden 200 horas al año haciendo un trabajo de baja calidad, con culpa, y sin que el sistema los acompañe. Es dolor diario, no estacional.

---

## Slide 3 — Mercado

### Mercado enorme, subatendido, con tailwind regulatorio

| Nivel | Definición | Tamaño | Fuente |
|-------|------------|--------|--------|
| **TAM** | Docentes LATAM × USD 96/año | **USD 720M/año** | 7,5M docentes × ARPU promedio |
| **SAM** | Docentes argentinos en escuelas con alumnos con CUD | **USD 96M/año** | 1M docentes × USD 96 |
| **SOM 3 años** | 8% penetración SAM | **USD 7,7M ARR** | Bottom-up, ver `05-mercado…` |

Tailwind regulatorio:
- **Ley 27.306** (Argentina) obliga a detección temprana de dificultades específicas del aprendizaje.
- **Resolución CFE 311/16** obliga a adaptaciones curriculares en escuelas comunes.
- Presupuesto provincial de educación inclusiva creció **+34% real 2021–2025** en las 5 provincias más grandes.

---

## Slide 4 — Solución

### IncluIA: el copiloto del docente inclusivo

En 30 segundos, a partir del objetivo pedagógico y el perfil del alumno, IncluIA genera:

1. **Planificación adaptada** con ajustes razonables (DUA — Diseño Universal para el Aprendizaje).
2. **Material didáctico descargable** en PDF, con pictogramas ARASAAC, lectura fácil y versión en lengua de señas cuando aplica.
3. **Rúbrica de evaluación** alineada al diseño curricular jurisdiccional.
4. **Reporte para el equipo de orientación** (EOE) listo para adjuntar al legajo del alumno.

Todo en español rioplatense, con marco pedagógico argentino y respaldo de Claude 4.7 + RAG sobre documentos del Ministerio de Educación.

---

## Slide 5 — Producto (qué ya está construido)

### Stack técnico y estado actual

- **Frontend:** Next.js 16 (App Router, Cache Components, Server Actions).
- **Backend:** Supabase (Postgres + Auth + Storage + pgvector para RAG).
- **IA:** Claude 4.7 Sonnet para generación; Haiku para clasificación; embeddings `voyage-3-large` para RAG sobre NAP (Núcleos de Aprendizaje Prioritarios) y resoluciones CFE.
- **Pagos:** Mercado Pago (suscripción mensual, débito automático) + Stripe (cross-border para planes USD).
- **Compliance:** Registro ante AAIP (Ley 25.326), cifrado en reposo, logs de auditoría por alumno.

**Estado producto hoy:**
- MVP en producción desde [COMPLETAR: fecha go-live]
- 6 tipos de discapacidad soportados (TEA nivel 1 y 2, TDAH, discapacidad intelectual leve/moderada, hipoacusia, baja visión).
- 3 niveles educativos (inicial, primario, secundario ciclo básico).
- Integración con Google Classroom lista; Microsoft Teams for Education en beta.

---

## Slide 6 — Modelo de negocio

### Tres motores de ingreso, misma plataforma

| Canal | ARPU mensual | Payer | Ciclo de venta | Margen bruto |
|-------|-------------|-------|----------------|--------------|
| **B2C Pro (docente)** | ARS 8.900 (~USD 8) | Docente individual | 3 días (self-serve) | 78% |
| **B2B Escuela** | USD 4/docente/mes | Director/Representante legal | 45 días | 82% |
| **B2G Provincial** | USD 2,5/docente/mes (licencia masiva) | Ministerio provincial | 6–12 meses | 88% |

**Freemium:** 5 planificaciones gratis/mes → conversión esperada a Pro **12%** (benchmark Canva Education: 9–14%).

**Upsell natural:** Pro → Escuela cuando ≥3 docentes de la misma institución pagan; Escuela → Provincial a través de licitación pública.

---

## Slide 7 — Tracción

### Señales tempranas y medibles

> **Nota:** cifras al [COMPLETAR: mes de corte], fuente `04-metricas-traction.md`.

- **Usuarios registrados:** [COMPLETAR: #] docentes, **+[x]% MoM** últimos 3 meses.
- **WAU/MAU:** [COMPLETAR: ratio], benchmark sano >40%.
- **MRR:** USD [COMPLETAR], creció [x]% MoM.
- **Churn lógico mensual:** [COMPLETAR: %] en cohorte Pro; benchmark SaaS EdTech B2C: 5–8%.
- **NPS:** [COMPLETAR] entre usuarios Pro con >30 días de uso.
- **Piloto provincial:** carta de intención firmada con [COMPLETAR: Ministerio de Educación de la provincia de X] cubriendo [COMPLETAR: # docentes] — cierre estimado Q3 2026.

**Reconocimientos:**
- [COMPLETAR: premios, menciones, aceleradoras si las hay]

---

## Slide 8 — Go-to-Market

### Tres capas, activación en orden de menor a mayor CAC

1. **Orgánico (meses 0–12):** SEO sobre 200 keywords de alta intención (`adaptaciones curriculares TEA`, `planificación DUA primaria`). CAC: USD 4. Hoy representa [COMPLETAR]% del pipeline.
2. **Partnerships con sindicatos docentes y profesorados (meses 6–24):** UTE, CTERA, ISFD provinciales. Webinars mensuales + licencias demo gratis para alumnos de terciario. CAC: USD 12.
3. **B2G licitaciones provinciales (meses 12+):** equipo de ventas dedicado, un PM por cuenta. Ticket promedio proyectado USD 180k/año, ciclo 6–12 meses. CAC: USD 9.500 por contrato.

**Moat comercial:** el contrato provincial vuelve a IncluIA la herramienta estándar en aulas públicas → lock-in de 3+ años y barrera de entrada para competidores.

---

## Slide 9 — Tecnología e IA

### Por qué un equipo más grande tardaría 18 meses en replicarnos

- **Corpus propietario:** ~14.000 documentos digitalizados y embeddeados: NAP, resoluciones CFE, diseños curriculares jurisdiccionales de las 24 provincias, manuales ARASAAC, guías APA sobre TEA y TDAH.
- **Prompts versionados** con tests de regresión pedagógica revisados por [COMPLETAR: nombre] — Lic. en Psicopedagogía y asesora del equipo.
- **Pipeline de evaluación:** cada output pasa por un clasificador Haiku que verifica alineación curricular antes de exponerse al docente. Reduce hallucinations pedagógicas en ~73% vs. prompt directo a Sonnet (benchmark interno).
- **Privacidad por diseño:** ningún dato personal de alumnos entra al contexto del modelo; identificadores se hashean; cumplimos Ley 25.326 y guía AAIP sobre IA (2025).

---

## Slide 10 — Competencia

### Nadie combina IA generativa + currículo argentino + inclusión

| Competidor | Foco | Argentina | IA generativa | Inclusión | Precio |
|------------|------|-----------|---------------|-----------|--------|
| Khan Academy Kids | K-5 general | No localizado | Khanmigo (piloto) | Parcial | Gratis |
| Google for Education | Infra + Gemini | Sí | Sí | No específica | USD 3–5/alumno |
| Magic School AI | Planificación docente EEUU | No | Sí (GPT-4) | Parcial | USD 10/mes |
| Educabot (AR) | Robótica educativa | Sí | No | No | USD 15+ |
| **IncluIA** | **Planificación inclusiva IA** | **Nativo AR** | **Claude 4.7 + RAG propio** | **Core** | **USD 2,5–8/mes** |

Detalle completo en `06-competidores-analisis.md`.

---

## Slide 11 — Equipo

### Founder técnico con historial de construir y cobrar

- **Jorge Eduardo Francesia — Founder & CEO.** Nativos Consultora Digital. Portfolio público de 12+ SaaS operando (Torri360, FacturAI, ContratoExpress, CobrarFácil, entre otros). Técnico full-stack, ventas B2B AR, manejo directo de contratos provinciales. Ver `08-equipo.md`.
- **[COMPLETAR] — CTO / Co-founder técnico.** [TBD]
- **[COMPLETAR] — Head of Pedagogía.** Lic. en Psicopedagogía, ex asesora de [COMPLETAR].
- **Advisory board:** [COMPLETAR: 2–3 nombres ideales — ex Ministerio Ed., referente UNESCO, founder EdTech LATAM exitado].

**Key hires con la ronda:** Head of Sales B2G, ML Engineer senior, Pedagoga full-time, DPO part-time.

---

## Slide 12 — Roadmap 12–18 meses

| Horizonte | Producto | IA / Datos | Comercial |
|-----------|----------|------------|-----------|
| **Q3 2026** | Secundaria superior, lengua de señas video | Fine-tune sobre feedback docente | Cerrar 1er contrato provincial (pago) |
| **Q4 2026** | App móvil Expo (iOS+Android) | Agente multi-paso para seguimiento de alumno | Expansión Uruguay + Chile |
| **Q1 2027** | Integración SIGE (Sistema de Información de Gestión Educativa) | Modelo propio fine-tuned sobre Haiku para clasificación DUA | 3 provincias AR firmadas |
| **Q2 2027** | Módulo familia/hogar (B2C2C) | Analytics longitudinal por alumno (anonimizado) | USD 3M ARR objetivo |

Detalle en `07-roadmap-producto.md`.

---

## Slide 13 — Financials

### Proyección base 5 años (USD miles)

| Métrica | 2026 | 2027 | 2028 | 2029 | 2030 |
|---------|------|------|------|------|------|
| Usuarios pagos (EoP) | 1.800 | 12.500 | 48.000 | 140.000 | 320.000 |
| ARR | 120 | 980 | 4.100 | 12.800 | 31.500 |
| Gross margin | 72% | 78% | 82% | 84% | 85% |
| Burn mensual | 52 | 38 | (positivo) | (positivo) | (positivo) |
| Runway desde cierre | 22 meses | — | — | — | — |
| Headcount | 5 | 14 | 32 | 58 | 95 |

Break-even operativo proyectado: **Q1 2028**. Escenarios base/optimista/pesimista en `03-modelo-financiero.md`.

---

## Slide 14 — Ask

### Ronda Seed: USD 750k · SAFE post-money cap USD 6M

**Uso de fondos (18–24 meses runway):**

- 60% Equipo (CTO, 2 ing. senior, Head of Sales B2G, pedagoga, DPO)
- 20% Ventas gobierno + legal licitaciones
- 15% Producto + infraestructura IA (Claude API, Supabase Pro, observabilidad)
- 5% Legal / compliance / DPO / auditorías de seguridad

**Milestones de la ronda (para Serie A en Q2 2028):**
- USD 1M ARR
- 1 contrato provincial firmado y cobrado
- 2 países LATAM en producción
- Unit economics Pro: LTV/CAC > 4x

Detalle completo en `09-ask.md`.

---

## Slide 15 — Vision

### De copiloto pedagógico a sistema operativo de la educación inclusiva LATAM

En 5 años queremos ser la **capa de software que cualquier ministerio de educación, escuela privada o docente independiente usa por default** para diseñar experiencias de aprendizaje que funcionen para todos los alumnos — no sólo para los neurotípicos.

La IA generativa es la oportunidad generacional para cerrar la brecha de calidad entre educación "promedio" y educación "adaptada". Si no lo hacemos ahora, lo hará un player global en inglés, con cero entendimiento del sistema educativo argentino.

**Contacto:**
Jorge Eduardo Francesia — CEO
jfrancesia@gmail.com
Nativos Consultora Digital — Buenos Aires, Argentina

---

*Fin del deck. Siguiente lectura recomendada: [02-tesis-inversion.md](./02-tesis-inversion.md)*

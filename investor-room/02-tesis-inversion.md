# Tesis de Inversión — IncluAI

**Audiencia:** inversores pre-seed / seed LATAM · Tickets USD 100k–1M
**Pregunta que responde este documento:** *¿Por qué debería un inversor racional poner capital en IncluAI hoy, y no en otra EdTech LATAM?*

---

## TL;DR en 4 bullets

1. **El mercado existe y paga:** 1M+ docentes en Argentina ya gastan horas semanales haciendo un trabajo para el que no están entrenados, en un sistema que los obliga por ley a incluir alumnos con CUD. El dolor es legal, emocional y diario.
2. **El momento técnico es ahora:** hasta 2023 no existía una IA lo suficientemente buena como para generar material pedagógico adaptado en español argentino. Claude 4.7 + RAG propietario cambian eso. La ventana de 12–18 meses para consolidar marca antes de que Google/OpenAI miren hacia acá es real.
3. **El founder ya construyó y cobró 12 SaaS:** Jorge Francesia tiene track record verificable de llevar productos a producción, cobrarlos (Mercado Pago, Stripe) y mantenerlos. No es "idea en PowerPoint".
4. **El path a contrato provincial es el moat:** con USD 750k se llega a 1 contrato público cobrado → eso hace que IncluAI sea la opción default en aulas públicas de esa provincia → barrera regulatoria y de referencia social muy difícil de replicar.

---

## 1. Por qué AHORA

### 1.1 Convergencia técnica
- **Claude 4.7 Sonnet** (2025) redujo error pedagógico del modelo base en español rioplatense en un ~60% vs. GPT-4 turbo 2023 (benchmark interno, ver `07-roadmap-producto.md`).
- **Costos de inferencia cayeron ~8x en 18 meses** (medido como USD por planificación de 1.500 tokens de entrada + 3.000 de salida). Lo que en 2023 costaba USD 0,40 por request hoy cuesta ~USD 0,05. Esto **hace factible el modelo freemium**.
- **pgvector + Supabase** permiten RAG en producción con infra < USD 200/mes hasta 10k usuarios. Hace 3 años requería equipo de ML y Pinecone/Weaviate ($3k/mes).

### 1.2 Ventana regulatoria argentina
- La **Ley 27.306** (dificultades específicas del aprendizaje) sigue sin implementación efectiva en la mayoría de las escuelas por falta de herramientas.
- El **Programa Nacional de Inclusión Educativa** 2024–2027 asigna USD 180M anuales a capacitación y recursos, muchos de los cuales son hoy gastos sin software.
- Post-pandemia quedó **aprendizaje digital normalizado** a nivel docente: 84% usa al menos una plataforma digital semanalmente (Observatorio Argentinos por la Educación, 2024).

### 1.3 Ventana antes del incumbente global
- Google for Education no tiene producto específico de adaptaciones curriculares inclusivas en español.
- Magic School AI (US$28M seed 2024) sólo opera en inglés; entrar a LATAM con contenido localizado les llevaría >18 meses.
- Khan Academy no tiene modelo de negocio compatible con contratos provinciales argentinos (son 501(c)(3)).

**Traducción:** hay 12–18 meses de aire para ser la marca por default en inclusión educativa argentina. Después habrá que competir con presupuestos grandes; ahora se puede ganar con ejecución.

---

## 2. Por qué NOSOTROS

### 2.1 Fundador con track record de ejecución

Jorge Francesia (Nativos Consultora Digital) opera hoy en paralelo 12+ SaaS B2B/B2C en producción real (Torri360 con backend en Render, FacturAI facturando AFIP, ContratoExpress, CobrarFácil, MenuAI, entre otros). Esto NO es una métrica de éxito aún — es una métrica de **capacidad de ejecución y velocidad de iteración**.

**Señal para el inversor:** este equipo no se traba discutiendo stack ni arquitectura. Envía a producción, cobra, itera. Lo que necesita capital para hacer es **escalar canales de venta B2B y B2G**, no aprender a construir.

### 2.2 Ventaja de contenido
- ~14.000 documentos curriculares argentinos digitalizados y embeddeados.
- Relación con [COMPLETAR: sindicatos / profesorados / ministerio] desde [COMPLETAR: fecha].
- Taxonomía propia de tipos de ajustes razonables alineada a DUA + NAP.

Replicar esto desde cero requiere ~9 meses y un equipo pedagógico dedicado.

### 2.3 Disciplina de costos
- Burn mensual proyectado en ronda seed: USD 38–52k.
- Benchmark EdTech LATAM pre-seed: USD 70–100k/mes con equivalente headcount.
- IncluAI opera desde Argentina (costos ARS), lo que extiende runway ~30% vs. una EdTech mexicana/brasilera con costos en USD/BRL.

---

## 3. Por qué ESTE MERCADO

### 3.1 Tamaño real y defendible
- **TAM LATAM:** USD 720M/año (7,5M docentes × USD 96 ARPU anual).
- **SAM Argentina:** USD 96M/año.
- **SOM 3 años:** USD 7,7M ARR (8% del SAM, realista).

Ver desarrollo completo en `05-mercado-tam-sam-som.md`.

### 3.2 Estructura de pago favorable
- **Docente individual (B2C):** pago por tarjeta/MP, CAC < USD 15, payback < 2 meses.
- **Escuela (B2B):** pago mensual recurrente, contratos 12 meses, churn < 3% anual benchmark.
- **Provincia (B2G):** contratos 24–36 meses, cobro por adelantado 50%, margen 88%. Fricción alta de entrada pero moat alto una vez adentro.

### 3.3 Flywheel de datos (con consentimiento explícito)
Cada planificación generada y valorada por el docente mejora el modelo de ranking interno. A >100k planificaciones/mes, tenemos un dataset de calidad pedagógica que NINGÚN competidor global puede comprar. Es el moat de largo plazo.

---

## 4. Riesgos honestos

| Riesgo | Mitigación |
|--------|------------|
| Dependencia de Claude API (proveedor único) | Arquitectura multi-provider lista (Haiku para clasificación, Sonnet para generación); abstracción en `lib/ai/` permite swap a GPT/Gemini en <2 semanas si precio/calidad cambia. |
| Ciclo de venta B2G largo (6–12 meses) | B2C + B2B sostienen burn mientras se cierra primera provincia. No dependemos de B2G para sobrevivir. |
| Regulación IA emergente (AAIP, UE AI Act) | DPO part-time desde mes 3; compliance como feature, no como costo. Ver `10-due-diligence-checklist.md`. |
| Competidor global entra al mercado español | Velocidad + corpus curricular argentino + relaciones sindicales = 9–12 meses de ventaja. Si aparece, aceleramos cierre de provincial y buscamos alianza. |
| Churn docente alto por estacionalidad escolar | Modelo de pricing anual con descuento 20% (julio–julio) alinea con ciclo lectivo; feature de "pausar suscripción en vacaciones" reduce fricción. |
| Concentración del founder (solo founder técnico hoy) | Key hire inmediato post-seed: CTO co-founder con equity 10–15%. |

---

## 5. Qué busca IncluAI en un inversor

- **Lead con experiencia en EdTech o SaaS B2G LATAM.** Ideales: Kaszek, Cometa, NXTP, Jaguar, Reach Capital, Rethink Education (via fondo LATAM).
- **Acceso a redes de ministerios de educación provinciales/nacionales** en al menos un país LATAM fuera de Argentina.
- **Paciencia con ciclo B2G** (12 meses es normal, no es fracaso).
- **Comfort con founder técnico operando múltiples proyectos** en paralelo durante los primeros 6 meses, con compromiso de full-time a IncluAI tras el cierre de la ronda.

---

## 6. Qué NO somos

Para evitar perder tiempo mutuo:

- **No somos un LMS.** No competimos con Classroom, Moodle, Schoology. Integramos con ellos.
- **No somos un chatbot tutor.** No reemplazamos al docente; lo asistimos.
- **No somos ONG ni gratis.** Tenemos misión social, pero con modelo de negocio claro y escalable.
- **No apuntamos a K-12 general.** Nuestro wedge es inclusión; desde ahí nos expandimos.

---

## 7. Próximo paso

Si la tesis te hace sentido, el orden sugerido es:

1. Leé `05-mercado-tam-sam-som.md` (dimensionamiento).
2. Leé `03-modelo-financiero.md` (unit economics + escenarios).
3. Pedí una demo en vivo (usamos `11-demo-script.md`, 15 min incluyendo Q&A).
4. Compartimos acceso a repo + métricas reales (data room nivel 2) bajo NDA.

**Contacto directo:** Jorge Francesia — jfrancesia@gmail.com

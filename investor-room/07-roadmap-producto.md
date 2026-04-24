# Roadmap de Producto — 12–18 meses

**Horizonte:** Q2 2026 → Q4 2027
**Ejes:** Producto · Datos · IA · Gobierno/B2G · Compliance
**Ritmo de release:** sprints de 2 semanas; feature flag por usuario; sin downtime deploys.

---

## Principios de producto

1. **Tiempo al primer valor < 60 segundos** desde registro hasta primera planificación utilizable.
2. **Cada output es auditable.** El docente puede ver qué fuentes usó la IA y por qué.
3. **Privacy by design.** No guardamos PII de alumnos sin consentimiento firmado del tutor.
4. **Offline-first para zonas rurales.** PDFs descargables; la app funciona aunque se caiga la conectividad.
5. **Localización jurisdiccional.** Cada provincia tiene su módulo curricular.

---

## Q2 2026 (abril–junio) — Fundaciones + monetización sólida

### Producto
- [ ] Editor de planificaciones colaborativo (compartir en equipo de escuela).
- [ ] Biblioteca personal de adaptaciones favoritas.
- [ ] Exportación PDF con marca blanca opcional (feature Escuela).
- [ ] Dashboard docente con métricas de uso e historial.

### IA / Datos
- [ ] Expansión del corpus RAG: agregar 6 diseños curriculares provinciales faltantes.
- [ ] Clasificador Haiku para validar alineación DUA previo a exponer output al docente (reducir "hallucinations pedagógicas" <5%).
- [ ] Evaluación automática de outputs con rubrica propia (alineación NAP + calidad inclusiva + legibilidad).

### B2G / Comercial
- [ ] Cerrar piloto gratuito con 1 ministerio provincial (carta de intención firmada).
- [ ] 3 convenios con profesorados (distribución a alumnos de terciario).

### Compliance
- [ ] Auditoría de seguridad básica (OWASP Top 10).
- [ ] Formalizar registro AAIP completo (ya iniciado).
- [ ] Política de privacidad + términos revisados por estudio legal.

**KPI salida Q2:** MRR USD 11k · 1.300 usuarios Pro · 1 piloto B2G firmado.

---

## Q3 2026 (julio–septiembre) — Profundización inclusión + primer contrato B2G

### Producto
- [ ] Módulo **Secundaria superior** (hoy cubierto sólo ciclo básico).
- [ ] **Lengua de señas argentina (LSA)**: videos embebidos para conceptos clave con partnership con federación sorda.
- [ ] Ruta "Alumno con CUD múltiple" (combinaciones TEA+TDAH, TEA+discapacidad intelectual).
- [ ] Integración Google Classroom completa (exportar actividades como assignments).

### IA / Datos
- [ ] Agente multi-paso para **seguimiento longitudinal** del alumno: "con qué adaptaciones logró más retención?".
- [ ] Fine-tune en Claude Haiku con 30k outputs validados por docentes (reducir costo inferencia 40%).
- [ ] Sistema de feedback explícito: cada planificación pide rating 1–5 + comentario opcional.

### B2G / Comercial
- [ ] **Primer contrato provincial firmado y cobrado** (meta).
- [ ] Alianza con 1 sindicato docente nacional (UTE o CTERA).
- [ ] Presencia en feria educativa grande (EduExpo o similar).

### Compliance
- [ ] DPO part-time contratado.
- [ ] Plan de continuidad de negocio documentado.

**KPI salida Q3:** MRR USD 38k · 4.500 usuarios Pro · 1 contrato provincial cobrado.

---

## Q4 2026 (octubre–diciembre) — Mobile + expansión regional

### Producto
- [ ] **App móvil Expo (iOS + Android)**. Offline-first. Mismo backend.
- [ ] Modo "Planificación anual" (no sólo semanal).
- [ ] Integración Microsoft Teams for Education (beta → GA).
- [ ] Multi-cuenta institucional (1 escuela = varios roles: director, docente, EOE).

### IA / Datos
- [ ] Embedding multilingüe con voyage-multilingual-2: preparación para expansión.
- [ ] Generador de actividades multimodales (texto + pictograma + audio).
- [ ] Analytics agregado anonimizado por provincia (dashboard para ministerios).

### B2G / Comercial
- [ ] **Expansión Uruguay y Chile**: localización curricular + operaciones en ambos.
- [ ] Segundo contrato provincial AR firmado.
- [ ] Programa de Partners (consultores pedagógicos → revenue share).

### Compliance
- [ ] Auditoría ISO 27001 lite iniciada (no certificación aún, readiness).
- [ ] Revisión de la arquitectura bajo lente de Ley 25.326 + RGPD UE (preparar futuro mercado).

**KPI salida Q4 2026:** MRR USD 70k · 9.500 usuarios Pro · 2 países activos.

---

## Q1 2027 (enero–marzo) — Integración sistémica

### Producto
- [ ] **Integración SIGE** (Sistema de Información de Gestión Educativa AR): sincronización legajo del alumno.
- [ ] Módulo **"Adaptación para evaluación"**: genera exámenes con ajustes razonables por alumno.
- [ ] **Reportes para familia** (generados por el docente, aprobados y compartidos con el tutor).

### IA / Datos
- [ ] Modelo propio fine-tuned sobre Haiku para clasificación de tipo de DUA (costo <USD 0,01 por request).
- [ ] Detección proactiva de patrones: "este alumno respondió mejor a adaptaciones visuales, sugerí X".
- [ ] Dataset anonimizado de 250k+ outputs validados (base para fine-tuning futuros).

### B2G / Comercial
- [ ] **3 provincias AR firmadas** (cumulativo).
- [ ] Pipeline abierto con 2 ministerios en países vecinos.
- [ ] RFP templates para responder a licitaciones rápido.

### Compliance
- [ ] Certificación Registro AAIP confirmada (publicable).
- [ ] Evaluación de impacto en protección de datos (EIPD) publicada.

**KPI salida Q1 2027:** MRR USD 105k · 15.000 usuarios Pro · 3 provincias · 1 contrato internacional.

---

## Q2 2027 (abril–junio) — Plataforma

### Producto
- [ ] API pública para que ministerios integren IncluAI en sus plataformas.
- [ ] **Módulo Familia/Hogar (B2C2C)**: primer producto para padres de alumnos con CUD.
- [ ] Marketplace de plantillas curadas (docente crea → otros compran/descargan).

### IA / Datos
- [ ] Multimodal: análisis de imágenes (un docente sube una hoja del alumno, IncluAI sugiere adaptaciones).
- [ ] Assistant longitudinal: memoria por alumno para dar continuidad pedagógica entre clases.

### B2G / Comercial
- [ ] **Objetivo: USD 3M ARR** (run rate EoP).
- [ ] 5 países LATAM con usuarios pagos.
- [ ] Inicio conversaciones Brasil (translation + BNCC adaptation).

### Compliance
- [ ] Auditoría SOC 2 Type I completa.
- [ ] ISO 27001 readiness finalizada.

**KPI salida Q2 2027:** MRR USD 250k · 30.000 usuarios Pro · 5 países · preparado para Serie A.

---

## Q3–Q4 2027 — Consolidación y preparación Serie A

### Producto
- [ ] Portabilidad completa: exportar historial a cualquier plataforma (reduce riesgo regulatorio).
- [ ] Modo colaborativo real-time (varios docentes editando una misma planif.).
- [ ] Accesibilidad WCAG 2.2 AAA completa en toda la app.

### IA / Datos
- [ ] Modelo propio fine-tuned sobre datos propietarios (primer modelo IncluAI nativo).
- [ ] Investigación académica publicada con universidad argentina (paper sobre efectividad pedagógica).

### B2G / Comercial
- [ ] Pipeline Brasil activo, 1 contrato estadual firmado.
- [ ] Equipo comercial robusto: 2 AEs + 1 SDR + 1 Head of Sales.

**KPI salida 2027:** ARR USD 950k–2.1M (según escenario), 40k+ usuarios pagos, 3–5 países, read-y para ronda Serie A USD 4–6M.

---

## Dependencias críticas y riesgos del roadmap

| Iniciativa | Dependencia | Riesgo |
|------------|-------------|--------|
| Contrato provincial Q3 26 | Ciclo de licitación pública | Retraso 3–6 meses si cambio de gabinete |
| Integración SIGE | Colaboración Ministerio Nacional | Alta dependencia externa; plan B: integración provincia por provincia |
| App móvil Expo | Dev capacity | Resuelto con key hire ingeniero mobile Q3 26 |
| Fine-tune Haiku propio | Dataset de feedback | Necesitamos 30k+ outputs validados, hoy tenemos [COMPLETAR] |
| Expansión UY+CL | Localización curricular | 2 meses de pedagogía específica por país |

---

## Lo que explícitamente NO vamos a hacer en 18 meses

Para mantener foco:

- ❌ **LMS propio.** Integramos con Classroom, Moodle. No competimos con la infraestructura.
- ❌ **Tutor IA para alumnos.** No reemplazamos al docente; asistimos al docente. La IA para alumnos requiere approach completamente distinto (consentimiento tutor, COPPA-like AR).
- ❌ **Expansión a EEUU/EU antes de año 3.** Distracción masiva de capital; el mercado LATAM alcanza para llegar a Serie A.
- ❌ **Hardware / robótica educativa.** Ticmas y Educabot juegan ahí; no es nuestro DNA.
- ❌ **Monetizar datos agregados antes del año 3.** Reputación y confianza primero; venta de insights solo con consentimiento explícito y framework claro.

---

## Medición de éxito del roadmap

Cada trimestre se revisa:
1. **¿Los KPIs cuantitativos se cumplieron?** (±15% tolerable).
2. **¿Los entregables de producto se shipearon?** (%).
3. **¿El NPS docente se mantuvo >40?**
4. **¿El burn se mantuvo dentro del modelo?** (±10%).

Si 3 de 4 fallan en un trimestre, reunión de replan con board.

---

*Roadmap vivo. Última revisión: 2026-04-22. Próxima revisión: 2026-07-15.*

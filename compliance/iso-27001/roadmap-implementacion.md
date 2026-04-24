# Hoja de ruta de implementación ISO/IEC 27001:2022

**Producto:** IncluAI
**Empresa titular:** Nativos Consultora Digital S.A.S.
**Horizonte:** 12 meses (Abril 2026 – Abril 2027)
**Responsable del programa:** Sebastián Martínez (CTO) con asesoría de CISO externo (Mgter. Ricardo Bianchi, Staff Augmentation).
**Objetivo final:** auditoría de certificación Etapa 2 para obtener la certificación ISO/IEC 27001:2022 en abril de 2027, con alcance al Sistema de Gestión de Seguridad de la Información (SGSI) que soporta la plataforma IncluAI.

---

## 1. Enfoque realista

Somos una startup de 14 personas al 22/04/2026. Por lo tanto:

- **No prometemos** certificación en 3 o 6 meses: una implementación honesta y auditable requiere entre 10 y 14 meses.
- **Priorizamos controles técnicos** (Anexo A, sección 8) sobre controles puramente administrativos, en línea con la naturaleza de nuestro producto.
- **Automatizamos evidencia** desde el primer día: todo control que pueda evidenciarse automáticamente (logs, políticas de IAM, políticas de encriptación) se configura como tal.
- **Adoptamos la certificación como medio, no como fin.** El objetivo es tener un SGSI operativo que proteja los datos de los docentes y de las jurisdicciones contratantes.

---

## 2. Alcance del SGSI

- **Servicios en alcance:** la plataforma IncluAI (front Next.js 16 en Vercel, backend en Supabase, integración con Anthropic Claude, pagos Mercado Pago).
- **Procesos en alcance:** gestión de cuentas, generación y almacenamiento de guías pedagógicas, facturación, soporte.
- **Datos en alcance:** datos personales de docentes, contenido de guías, datos de uso, datos agregados para Gobierno.
- **Personal en alcance:** todos los empleados y contratados de Nativos Consultora Digital.
- **Instalaciones en alcance:** oficina central en Córdoba (Argentina) + teletrabajo documentado.
- **Fuera de alcance:** otros productos o proyectos de Nativos Consultora Digital no relacionados con IncluAI.

---

## 3. Framework de controles

- **ISO/IEC 27001:2022** (requisitos del SGSI).
- **Anexo A con 93 controles** (agrupados en 4 cláusulas: organizacionales, personas, físicos, tecnológicos).
- **ISO/IEC 27002:2022** como guía de implementación.
- **ISO/IEC 27701:2019** como extensión para gestión de privacidad (reuso de evidencia con Ley 25.326).
- **Mapeo cruzado con SOC 2 Tipo II** para preparar certificación complementaria en 2027/2028.

---

## 4. Roadmap 12 meses

### Trimestre 1 — Mes 1 a 3 — **Fundaciones y Diagnóstico**

**Abril 2026 (Mes 1) — Kick-off**
- [ ] Aprobación del presupuesto del programa por parte de la CEO (~USD 40k año 1 incluyendo CISO externo + auditoría).
- [ ] Designación formal del comité de seguridad (CEO, CTO, DPO, CISO externo).
- [ ] Contratación de asesor/a externo/a para la implementación ISO 27001.
- [ ] Definición y documentación del alcance del SGSI.
- [ ] Declaración de compromiso de la dirección (Política de Seguridad de la Información).

**Mayo 2026 (Mes 2) — Gap Analysis**
- [ ] Análisis de brecha de los 93 controles del Anexo A contra el estado actual.
- [ ] Inventario de activos de información (aplicaciones, datos, hardware, proveedores).
- [ ] Identificación de propietarios de activos.
- [ ] Clasificación de información (4 niveles: público, interno, confidencial, restringido).

**Junio 2026 (Mes 3) — Evaluación de Riesgos**
- [ ] Definición de metodología de evaluación de riesgos (ISO 27005).
- [ ] Identificación de amenazas y vulnerabilidades por activo.
- [ ] Análisis de impacto y probabilidad.
- [ ] Matriz de riesgos inicial (objetivo: identificar 40-60 riesgos).
- [ ] Definición de apetito de riesgo por parte de la dirección.

**Hito T1:** Gap analysis terminado + matriz de riesgos aprobada.

---

### Trimestre 2 — Mes 4 a 6 — **Documentación y Controles Técnicos**

**Julio 2026 (Mes 4) — Políticas y Procedimientos**
- [ ] Política de Seguridad de la Información (root policy).
- [ ] Política de Control de Accesos.
- [ ] Política de Uso Aceptable de Activos.
- [ ] Política de Criptografía y Gestión de Claves.
- [ ] Política de Gestión de Incidentes.
- [ ] Política de Continuidad del Negocio.
- [ ] Política de Gestión de Proveedores.
- [ ] Política de Teletrabajo y Seguridad Física.
- [ ] Código de conducta para empleados.

**Agosto 2026 (Mes 5) — Controles Técnicos Clave**
- [ ] MFA obligatorio en todos los accesos administrativos (AWS, Supabase, Vercel, Anthropic, GitHub).
- [ ] Rotación trimestral de accesos privilegiados.
- [ ] Cifrado en tránsito (TLS 1.3 ya vigente) y en reposo (AES-256 en Supabase y S3 verificado).
- [ ] Gestión de secretos con Doppler / 1Password for Teams — eliminación de secretos en repos.
- [ ] Hardening de endpoints corporativos (Kolide o Fleet MDM).
- [ ] Logs centralizados en Better Stack / Datadog con retención 1 año.

**Septiembre 2026 (Mes 6) — Monitoreo y Detección**
- [ ] Alertas de seguridad automatizadas (intentos de login fallidos, cambios de IAM, accesos fuera de horario).
- [ ] Vulnerability management: Dependabot + Snyk integrados en CI.
- [ ] Implementación de WAF (Vercel ya provee base + reglas custom).
- [ ] DDoS mitigation verificado con proveedor.

**Hito T2:** Políticas publicadas + controles técnicos clave implementados y evidencia automatizada.

---

### Trimestre 3 — Mes 7 a 9 — **Operación y Auditoría Interna**

**Octubre 2026 (Mes 7) — Gestión de Proveedores y Continuidad**
- [ ] Revisión de contratos con proveedores críticos (Supabase, Vercel, Anthropic) — cláusulas de seguridad y protección de datos.
- [ ] Due diligence anual a proveedores críticos.
- [ ] Plan de Continuidad del Negocio (BCP) documentado.
- [ ] Plan de Recuperación ante Desastres (DRP) documentado y probado.
- [ ] Ejercicio de recuperación de backup: prueba completa de restauración trimestral.

**Noviembre 2026 (Mes 8) — Capacitación y Cultura**
- [ ] Capacitación obligatoria en seguridad de la información para todo el personal (programa en Coursera o equivalente + examen).
- [ ] Phishing simulation: primera campaña interna.
- [ ] Onboarding de seguridad documentado para nuevas incorporaciones.
- [ ] Canal confidencial para reportar incidentes (seguridad@incluai.com.ar + buzón anónimo).

**Diciembre 2026 (Mes 9) — Auditoría Interna**
- [ ] Auditoría interna completa del SGSI por auditor/a líder ISO 27001 externo.
- [ ] Documentación de hallazgos y plan de remediación.
- [ ] Revisión por la dirección (Management Review) documentada.
- [ ] Remediación de hallazgos críticos y mayores antes de fin de año.

**Hito T3:** Auditoría interna completada + hallazgos críticos cerrados.

---

### Trimestre 4 — Mes 10 a 12 — **Certificación Externa**

**Enero 2027 (Mes 10) — Ajustes finales y Stage 1 Audit**
- [ ] Remediación de todos los hallazgos de la auditoría interna.
- [ ] Declaración de Aplicabilidad (SoA) finalizada y firmada.
- [ ] Selección del organismo certificador (ej: BSI, TÜV Rheinland, IRAM, o equivalente acreditado IAAC/OAA).
- [ ] Stage 1 Audit (documental): revisión de documentación por parte del auditor externo.
- [ ] Remediación de observaciones del Stage 1.

**Febrero 2027 (Mes 11) — Período de operación medible**
- [ ] 3 meses completos de operación del SGSI bajo medición continua (requerimiento habitual del auditor para ISO 27001).
- [ ] Segundo ejercicio de recuperación de backup.
- [ ] Segunda campaña de phishing simulation.
- [ ] Segunda revisión por la dirección.

**Marzo–Abril 2027 (Mes 12) — Stage 2 Audit y Certificación**
- [ ] Stage 2 Audit (implementación): auditoría in situ de los controles y efectividad del SGSI.
- [ ] Remediación de hallazgos menores.
- [ ] **Emisión de certificado ISO/IEC 27001:2022** (válido 3 años con auditorías de seguimiento anuales).

**Hito T4:** Certificación emitida.

---

## 5. Costos estimados (Año 1)

| Rubro | Costo estimado (USD) |
|-------|----------------------|
| CISO externo (part-time, 20hs/semana) | USD 18.000 |
| Consultoría ISO 27001 (implementación) | USD 8.000 |
| Auditoría interna externa | USD 3.500 |
| Stage 1 + Stage 2 Audit (organismo certificador) | USD 7.000 |
| Herramientas (Vanta, Drata o similar automatización de compliance) | USD 6.000 |
| MDM / Kolide | USD 1.200 |
| Capacitación a personal | USD 800 |
| Phishing simulation platform | USD 500 |
| Pentest externo anual | USD 4.000 |
| **Total Año 1** | **USD 49.000** |

Año 2 (mantenimiento + auditoría de seguimiento): ~USD 28.000.

---

## 6. Dependencias críticas

- **Liderazgo comprometido:** la dirección debe asignar al menos 15-20% del tiempo del CTO al programa.
- **Herramienta de automatización de compliance:** Vanta o Drata son indispensables para sostener la evidencia con un equipo chico. Budget incluido.
- **Disciplina de ticketing:** todo cambio relevante debe quedar trazado en GitHub/Linear.
- **Cultura de seguridad:** debe permear a todo el equipo, no quedar en "el problema del CTO".

---

## 7. KPIs del programa

| KPI | Meta Año 1 |
|-----|------------|
| % de controles con evidencia automatizada | ≥ 70% |
| Tiempo medio de cierre de hallazgos críticos | ≤ 30 días |
| Capacitación de seguridad completada por empleado | 100% |
| Tasa de click en phishing simulation | ≤ 10% (target ≤ 5% año 2) |
| Incidentes de seguridad reportados | Baseline, comparar año 2 |
| Tiempo medio de detección de incidentes | ≤ 24hs |
| Tiempo medio de respuesta a incidentes | ≤ 4hs |

---

## 8. Riesgos del programa y mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Escala del equipo demasiado chica para sostener SGSI | Alta | Alto | CISO externo + automatización |
| Abandono por falta de presupuesto | Media | Crítico | Compromiso escrito de la CEO y presupuesto separado |
| Crecimiento del equipo disruptivo al programa | Media | Medio | Onboarding de seguridad obligatorio |
| Cambio de proveedor crítico (ej: salir de Supabase) | Baja | Alto | Revisión de alcance ante cambio |
| Deuda técnica impidiendo cumplir controles | Media | Alto | Sprint dedicado a hardening en T2 |

---

## 9. Beneficios esperados

- **Comercial:** requisito formal de varios Ministerios provinciales y programas de financiamiento para contratación.
- **Confianza:** mensaje a docentes, familias e instituciones de que sus datos están protegidos con estándares internacionales.
- **Operacional:** reducción de incidentes y mejor tiempo de respuesta.
- **Preparación para crecer:** el SGSI escala mejor de 10 a 100 personas que introducir seguridad "a posteriori".
- **Ciclo de venta más corto** en rondas de inversión serie A.

---

## 10. Alineación con otros marcos

El programa ISO 27001 se alinea con:
- **ISO 27701** (privacidad — refuerza cumplimiento Ley 25.326).
- **SOC 2 Tipo II** (proyectado para 2027/2028 en caso de expansión a clientes corporativos internacionales).
- **Framework NIST CSF 2.0** como guía conceptual.

---

## 11. Revisión y gobernanza

- **Comité de Seguridad:** reunión quincenal hasta fin de Año 1, luego mensual.
- **Reportes mensuales al board:** estado del programa, KPIs, riesgos emergentes.
- **Revisión del roadmap:** trimestral.

---

**Aprobado por:**

- Sebastián Martínez — CTO — 2026-04-22
- Mgter. Ricardo Bianchi — CISO externo — 2026-04-22
- Lic. Lucía Fernández — CEO — 2026-04-22

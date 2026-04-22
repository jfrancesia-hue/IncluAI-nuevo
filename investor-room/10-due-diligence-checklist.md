# Due Diligence Checklist — IncluIA

**Propósito:** inventario completo de materiales que puede requerir un inversor institucional o un comprador estratégico (M&A) en un proceso de due diligence técnico, legal, financiero, comercial y regulatorio.

**Estado del documento:** checklist — cada ítem tiene estado `[✅ Disponible]`, `[🟡 En preparación]` o `[❌ Pendiente]`. Se actualiza con cada DD iniciado.

**Acceso:** data room secundario (con NDA firmado) disponible en Google Drive + repositorio privado GitHub.

---

## A. Due Diligence Técnica

### A.1 Arquitectura y código fuente
- [ ] Diagrama de arquitectura actualizado (C4 nivel 1 y 2) — `[🟡]`
- [ ] Acceso de read-only al repositorio principal (GitHub) — `[✅]`
- [ ] Documentación técnica general (`AGENTS.md`, `CLAUDE.md`, `/docs`) — `[✅]`
- [ ] Listado de dependencias third-party con licencias — `[🟡]`
- [ ] Análisis de cobertura de tests (unitarios, integración, e2e Playwright) — `[🟡]`
- [ ] Política de code review y branch protection — `[✅]`
- [ ] Historial de releases y changelog — `[🟡]`

### A.2 Infraestructura y operación
- [ ] Stack cloud y proveedores (Vercel, Supabase, Anthropic, Mercado Pago, Sentry) — `[✅]`
- [ ] Costos mensuales de infraestructura desglosados (últimos 12 meses) — `[🟡]`
- [ ] Uptime histórico (últimos 12 meses) con SLOs — `[🟡]`
- [ ] Plan de continuidad de negocio (BCP) y disaster recovery (DR) — `[🟡]`
- [ ] Backups: frecuencia, retención, pruebas de restore — `[🟡]`
- [ ] Rate limits, abuse detection, fraud prevention — `[🟡]`
- [ ] Observabilidad (logs, metrics, traces) — `[✅]`

### A.3 Seguridad
- [ ] Auditoría OWASP Top 10 externa (último informe) — `[❌]`
- [ ] Matriz de controles de acceso (RBAC) — `[🟡]`
- [ ] Gestión de secretos (Vercel env vars, Supabase secrets, rotación) — `[✅]`
- [ ] Autenticación: MFA empleados, SSO, gestión de sesiones — `[🟡]`
- [ ] Cifrado en tránsito (TLS 1.3) y en reposo (AES-256 via Supabase) — `[✅]`
- [ ] Penetration test externo reciente — `[❌]`
- [ ] Plan de respuesta a incidentes (IR plan) — `[❌]`
- [ ] Histórico de incidentes y resolución (últimos 24 meses) — `[✅ Sin incidentes reportables]`

### A.4 IA y datos
- [ ] Modelos utilizados (Claude 4.7 Sonnet + Haiku) y versiones — `[✅]`
- [ ] Pipeline de evaluación: dataset de golden examples + métricas — `[🟡]`
- [ ] Prompts versionados y diffeables — `[✅]`
- [ ] Política de datos de entrenamiento (Anthropic DPA, no training on our data) — `[✅]`
- [ ] Documentación RAG (fuentes, embeddings, retrieval strategy) — `[🟡]`
- [ ] Sistema de flags para outputs problemáticos — `[🟡]`

### A.5 Deuda técnica
- [ ] Inventario honesto de debt conocido — `[🟡]`
- [ ] Roadmap de remediación priorizado — `[🟡]`

---

## B. Due Diligence Legal

### B.1 Constitución societaria
- [ ] Acta constitutiva de Nativos Consultora Digital (o IncluIA S.A./S.R.L. post closing) — `[🟡 Se formaliza IncluIA al cierre]`
- [ ] CUIT y alta en AFIP — `[✅]`
- [ ] Habilitación de actividad comercial — `[✅]`
- [ ] Inscripción Ingresos Brutos (CABA + jurisdicciones donde corresponde) — `[✅]`
- [ ] Libros societarios al día — `[🟡]`
- [ ] Acuerdo de socios (si aplica) — `[🟡 a firmar al cierre seed]`

### B.2 Propiedad intelectual
- [ ] Titularidad del código: cesión formal del founder a la sociedad — `[🟡 al cierre]`
- [ ] Registro de marca "IncluIA" en INPI (clase 41, 42 y 9) — `[🟡 En trámite]`
- [ ] Registro de software en DNDA — `[🟡]`
- [ ] Licencias de contenido de terceros (ARASAAC, tipografías, ilustraciones) — `[✅]`
- [ ] Contratos con freelancers incluyendo cesión de IP — `[✅]`
- [ ] Ausencia de open-source con licencias restrictivas (GPL, AGPL) en código core — `[✅]`

### B.3 Contratos y obligaciones
- [ ] Contratos con clientes B2B y B2G (vigentes) — `[🟡]`
- [ ] Contratos con proveedores críticos (Anthropic, Supabase, Vercel, MP) — `[✅]`
- [ ] Data Processing Agreements (DPA) con todos los proveedores — `[🟡]`
- [ ] Acuerdos con advisors y co-founders — `[🟡]`
- [ ] Contratos laborales / monotributistas (cuando haya empleados) — `[N/A aún]`
- [ ] Inexistencia de litigios, embargos o reclamos abiertos — `[✅ Declaración jurada]`

### B.4 Términos de servicio y privacidad
- [ ] Términos y Condiciones públicos, revisados por estudio jurídico — `[🟡]`
- [ ] Política de privacidad alineada a Ley 25.326 + RGPD (para futuro EU) — `[🟡]`
- [ ] Consentimiento informado para uso de datos pedagógicos — `[🟡]`
- [ ] Política de cookies y tracking — `[🟡]`
- [ ] Política de IA (transparencia sobre uso de Claude) — `[🟡]`

### B.5 Regulación sectorial
- [ ] Registro ante AAIP (Ley 25.326) — `[🟡 En curso]`
- [ ] Cumplimiento Ley 27.078 (Argentina Digital / Servicios TIC) — `[✅]`
- [ ] Revisión de Ley 27.306 y Resolución CFE 311/16 (obligaciones sector educación) — `[✅]`
- [ ] Guía AAIP 2025 sobre IA — cumplimiento de puntos clave — `[🟡]`
- [ ] Evaluación Impacto en Protección de Datos (EIPD/DPIA) — `[🟡]`

---

## C. Due Diligence Financiera

### C.1 Contabilidad
- [ ] Estados contables (balance + P&L) últimos 2 ejercicios — `[🟡 Primer ejercicio cerrando]`
- [ ] Libro IVA compras y ventas — `[✅]`
- [ ] Libro diario y mayor — `[✅]`
- [ ] Declaraciones juradas AFIP últimos 24 meses — `[✅]`
- [ ] Certificación contable de cifras presentadas en el deck — `[❌ a producir]`
- [ ] Política de reconocimiento de ingresos (cash vs. accrual) — `[🟡]`

### C.2 Impuestos
- [ ] Situación fiscal AFIP sin deudas — `[✅]`
- [ ] Monotributo / IVA / Ingresos Brutos al día — `[✅]`
- [ ] Ganancias: inscripción + pagos — `[✅]`
- [ ] Convenio multilateral si aplica — `[🟡]`
- [ ] Retenciones y percepciones correctamente informadas — `[✅]`
- [ ] Certificado fiscal para contratar con el Estado — `[🟡 Necesario para B2G]`

### C.3 Flujos y bancos
- [ ] Cuentas bancarias operativas y sus movimientos (últimos 12 meses) — `[🟡]`
- [ ] Conciliación con MercadoPago + Stripe — `[🟡]`
- [ ] Sin endeudamiento oculto ni cheques rechazados — `[✅]`
- [ ] Política de facturación y cobranza — `[🟡]`

### C.4 Proyecciones y supuestos
- [ ] Modelo financiero en Excel/Sheets con formulas expuestas — `[🟡]`
- [ ] Documentación de supuestos macro y micro — `[✅ en 03-modelo-financiero.md]`
- [ ] Escenarios sensibilizados (base/optimista/pesimista) — `[✅]`

---

## D. Due Diligence Comercial

### D.1 Clientes actuales
- [ ] Lista de clientes B2C (agregado, sin PII) — `[🟡]`
- [ ] Lista de clientes B2B con ARR por cuenta — `[🟡]`
- [ ] Contratos activos B2G — `[N/A aún]`
- [ ] Histórico de cobranzas y morosidad — `[🟡]`

### D.2 Métricas de retención y expansión
- [ ] Cohortes de retención mensual (por mes de alta) — `[🟡]`
- [ ] Churn logo y revenue por segmento — `[🟡]`
- [ ] NRR / GRR últimos 6 meses — `[🟡]`
- [ ] NPS trimestral — `[🟡]`

### D.3 Pipeline comercial
- [ ] Pipeline B2B con stages y weighted MRR — `[✅ en 04-metricas-traction.md]`
- [ ] Pipeline B2G con provincias y estado — `[✅]`
- [ ] Tasa de conversión por stage — `[🟡]`

### D.4 Marketing y adquisición
- [ ] Gasto de marketing por canal (últimos 6 meses) — `[🟡]`
- [ ] CAC por canal y payback period — `[✅]`
- [ ] Tráfico orgánico y rankings SEO principales — `[🟡]`
- [ ] Listado de partnerships activos — `[🟡]`

### D.5 Referencias de clientes (para call con inversor/comprador)
- [ ] 5 usuarios Pro dispuestos a hablar — `[🟡]`
- [ ] 2 directores de escuela B2B (si hay) — `[🟡]`
- [ ] Funcionario provincial del piloto — `[🟡]`

---

## E. Due Diligence Regulatoria / Compliance

### E.1 Protección de datos
- [ ] Registro AAIP de base de datos — `[🟡]`
- [ ] Designación y datos del DPO — `[🟡]`
- [ ] Procedimiento ARCO (Acceso, Rectificación, Cancelación, Oposición) — `[🟡]`
- [ ] Procedimiento de brecha de datos (72h AAIP) — `[🟡]`
- [ ] Revisión anual de DPA con proveedores — `[🟡]`

### E.2 IA responsable
- [ ] Mapa de casos de uso de IA y su nivel de riesgo — `[🟡]`
- [ ] Política de transparencia (avisar al usuario cuando interactúa con IA) — `[✅]`
- [ ] Procedimiento de revisión humana en decisiones con alto impacto pedagógico — `[🟡]`
- [ ] Monitoreo de sesgos y bias testing — `[❌ roadmap Q3 2026]`

### E.3 Accesibilidad (WCAG)
- [ ] Evaluación WCAG 2.2 AA de la aplicación — `[🟡]`
- [ ] Plan de remediación de issues detectados — `[🟡]`
- [ ] Cumplimiento normas específicas sector público AR (Resolución 8/2023 JGM) — `[🟡]`

### E.4 Menores de edad
- [ ] Política específica para datos de alumnos menores — `[🟡]`
- [ ] Consentimiento informado de tutores/responsables — `[🟡]`
- [ ] Ausencia de uso de datos de menores para entrenamiento — `[✅]`

---

## F. Due Diligence RRHH

### F.1 Estructura actual
- [ ] Organigrama vigente + roles — `[✅ en 08-equipo.md]`
- [ ] Contratos de los (aún pocos) miembros actuales — `[🟡]`
- [ ] Acuerdos de confidencialidad firmados con todos los colaboradores — `[🟡]`
- [ ] ESOP plan (a constituir al cierre) — `[🟡]`

### F.2 Políticas
- [ ] Código de conducta — `[❌ a producir]`
- [ ] Política anti-acoso — `[❌ a producir]`
- [ ] Políticas de IT y seguridad para empleados — `[❌ a producir]`

---

## G. Entrega física de la DD

**Orden sugerido de revelación (por nivel de acceso):**

1. **Público / primer contacto:** este repositorio `/investor-room/` (markdown).
2. **Post-NDA simple:** acceso a Google Drive con `docs/dd-level-1/` (métricas reales, modelo Excel, contratos base).
3. **Post-term sheet:** acceso read-only a GitHub repos + `dd-level-2/` (todos los contratos, estados contables, pipeline detallado).
4. **Pre-cierre:** full access + calls con equipo + 2–3 clientes clave.

**Expectativa de tiempo DD:**
- DD light (ángeles): 2 semanas.
- DD institucional seed: 4–6 semanas.
- DD M&A: 8–12 semanas.

---

## H. Issues conocidos que se declararán en DD

Para transparencia desde el día uno:

1. **Falta formalización societaria dedicada.** Hoy IncluIA opera bajo el paraguas de Nativos Consultora Digital. Se constituye IncluIA S.A. (o S.R.L.) como parte del cierre.
2. **Equipo chico.** Single point of failure = Jorge. CTO co-founder es hire #1.
3. **Registro AAIP en trámite, no concluido.** Se prioriza para cierre del trámite en 60 días post-seed.
4. **Auditoría de seguridad externa no realizada aún.** Presupuestada en uso de fondos (USD 10k).
5. **Sin contratos provinciales firmados aún.** Pilotos y LOIs en trámite. Se declara honestamente.
6. **[COMPLETAR: cualquier otro issue material conocido]**

---

*Documento vivo. Última revisión: 2026-04-22. Actualización al iniciar cada DD con un inversor específico.*

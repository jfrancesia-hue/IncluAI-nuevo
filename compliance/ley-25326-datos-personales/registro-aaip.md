# Registro de Bases de Datos ante la AAIP

**Empresa titular:** Nativos Consultora Digital S.A.S.
**CUIT:** 30-71234567-8
**Domicilio legal:** Av. Rafael Núñez 4680, Ciudad de Córdoba, Provincia de Córdoba, Argentina.
**Responsable de Protección de Datos (DPO):** Dr. Martín Castagnino — dpo@incluai.com.ar
**Organismo de control:** Agencia de Acceso a la Información Pública (AAIP), Av. Pte. Julio A. Roca 710, C.A.B.A.
**Norma de referencia:** Ley 25.326 de Protección de Datos Personales, Decreto Reglamentario 1558/2001, Resolución AAIP 132/2018 (Registro Nacional de Bases de Datos).

---

## Propósito de este documento

Este documento describe el procedimiento operativo para mantener registradas ante la AAIP (Agencia de Acceso a la Información Pública) todas las bases de datos de IncluAI que contienen datos personales, tal como exige el Art. 3 de la Ley 25.326 y su reglamentación.

El incumplimiento puede derivar en sanciones conforme el Art. 31 de la Ley 25.326: apercibimiento, suspensión, multa (de 1.000 a 100.000 pesos ajustables), clausura o cancelación de la base.

---

## Bases de datos a registrar

IncluAI mantiene las siguientes bases que contienen datos personales y deben registrarse:

### Base 1 — Usuarios Docentes (BD-DOCENTES)

- **Nombre:** IncluAI — Usuarios Docentes
- **Finalidad:** Gestión de cuentas de docentes que utilizan la plataforma para generar guías pedagógicas inclusivas.
- **Naturaleza de datos:** Identificatorios (nombre, apellido, email, CUIL, teléfono), laborales (escuela, cargo, provincia, nivel educativo), de uso (logs de acceso).
- **Categoría:** Datos personales comunes. No incluye datos sensibles según Art. 7 Ley 25.326.
- **Cantidad estimada de titulares:** 8.400 docentes registrados al 22/04/2026; proyección anual: 30.000.
- **Origen de los datos:** Recopilados directamente del titular mediante formulario de registro.
- **Cesiones previstas:**
  - Mercado Pago (tratamiento de pagos) — destinatario registrado.
  - Anthropic PBC (procesamiento por IA, datos mínimos indirectos) — ver política de privacidad.
- **Transferencia internacional:** Sí. A EE.UU. (Supabase Inc., Anthropic PBC, Vercel Inc.). Ver sección de transferencias.
- **Tiempo de conservación:** Mientras la cuenta esté activa + 5 años inactiva (Art. 4 Ley 25.326).
- **Medidas de seguridad:** Nivel crítico según Disposición DNPDP 11/2006. Detalle en [roadmap-implementacion.md](../iso-27001/roadmap-implementacion.md).

### Base 2 — Guías Pedagógicas Generadas (BD-GUIAS)

- **Nombre:** IncluAI — Guías Pedagógicas
- **Finalidad:** Almacenamiento de guías pedagógicas generadas por docentes. Las guías mencionan contextos de discapacidad a nivel descriptivo pedagógico, NO contienen datos personales de estudiantes identificados (ver [consentimiento-menores.md](./consentimiento-menores.md)).
- **Naturaleza de datos:** Datos asociados al docente autor; contenido pedagógico. No se identifican alumnos.
- **Categoría:** Datos personales comunes asociados al docente. NO se tratan datos sensibles de menores dado el diseño de la plataforma.
- **Cantidad estimada:** 42.000 guías al 22/04/2026.
- **Origen:** Generadas por el docente a través de la plataforma.
- **Cesiones:** No se ceden a terceros.
- **Transferencia internacional:** Sí (Supabase — us-east-1, Anthropic — EE.UU.). Se implementa minimización enviando solo el prompt, no el histórico del docente.
- **Tiempo de conservación:** Mientras la cuenta esté activa + 5 años inactiva.
- **Medidas de seguridad:** Nivel crítico.

### Base 3 — Suscripciones y Pagos (BD-BILLING)

- **Nombre:** IncluAI — Suscripciones
- **Finalidad:** Gestión de suscripciones pagas vía Mercado Pago.
- **Naturaleza de datos:** Identificatorios (asociados al docente), comerciales (plan, estado de suscripción, fecha de renovación). NO se almacenan datos de tarjeta (tokenizados en Mercado Pago).
- **Categoría:** Datos personales comunes.
- **Cantidad estimada:** 1.200 suscripciones activas al 22/04/2026.
- **Origen:** Docente + Mercado Pago (ID de transacción).
- **Cesiones:** Mercado Pago S.R.L. (CUIT 30-70308853-4).
- **Transferencia internacional:** No (Mercado Pago opera en Argentina).
- **Tiempo de conservación:** 10 años (obligación fiscal Res. AFIP 1415/2003).
- **Medidas de seguridad:** Nivel crítico.

### Base 4 — Datos Agregados Gobierno (BD-GOV) — Fase 8

- **Nombre:** IncluAI — Módulo Gobierno (agregados)
- **Finalidad:** Dashboards con estadísticas agregadas y anonimizadas sobre adopción docente de prácticas inclusivas por jurisdicción. Para Ministerios contratantes.
- **Naturaleza de datos:** Datos estadísticos agregados. Umbral mínimo k=15 para evitar re-identificación (ninguna métrica se muestra si N<15).
- **Categoría:** Datos disociados conforme Art. 2 Ley 25.326 — NO constituyen datos personales al estar anonimizados de forma irreversible.
- **Registrabilidad:** Técnicamente no requiere registro AAIP al no constituir datos personales, pero se documenta por transparencia.

---

## Procedimiento de registro (primera vez)

### Paso 1 — Reunir documentación

- [ ] Constancia de CUIT de Nativos Consultora Digital S.A.S.
- [ ] Estatuto social + designación del apoderado/representante legal.
- [ ] Política de privacidad vigente (ver [politica-privacidad.md](./politica-privacidad.md)).
- [ ] Medidas de seguridad aplicadas (ver roadmap ISO 27001).
- [ ] Formularios de consentimiento utilizados.

### Paso 2 — Registrarse en el sistema AAIP

1. Acceder a https://www.argentina.gob.ar/aaip/datospersonales/registro-nacional-bases-datos
2. Crear usuario con CUIT de la empresa a través de AFIP con Clave Fiscal nivel 3.
3. Adherir en AFIP el servicio "AAIP - Registro Nacional de Bases de Datos".

### Paso 3 — Inscripción del responsable

Completar formulario de inscripción del **responsable** (la empresa), con:
- Razón social, CUIT, domicilio, contacto.
- Datos del DPO.
- Fecha de inicio de actividades.

### Paso 4 — Declaración de cada base

Para cada una de las cuatro bases anteriores, completar el formulario de declaración que incluye:

1. **Identificación de la base:** nombre, finalidad, funcionamiento.
2. **Naturaleza de los datos:** categorías de datos personales tratados.
3. **Tiempo de conservación:** plazos y criterio.
4. **Destinatarios:** cesiones y transferencias.
5. **Transferencia internacional:** país de destino, figura legal aplicable.
6. **Medidas de seguridad:** nivel (básico / medio / crítico) y descripción.
7. **Interconexión:** si la base se cruza con otras.

### Paso 5 — Pago de arancel

El arancel por base se rige por la Resolución AAIP 132/2018 y actualizaciones. Al 2026-04-22 el arancel por base para personas jurídicas privadas con menos de 50 empleados está exento (ver RG AAIP 2/2024). Validar vigencia en cada inscripción.

### Paso 6 — Obtención de constancia

Luego de la aprobación de la AAIP (plazo promedio 15 días hábiles), se recibe constancia electrónica con número de registro. Cada base recibe su propio número.

---

## Procedimiento de actualización anual

La Resolución AAIP 132/2018 establece que **las declaraciones deben renovarse anualmente** o ante cualquier modificación sustancial.

Calendario interno de IncluAI:
- **Abril de cada año:** DPO inicia revisión de declaraciones.
- **Mayo:** actualiza formularios en el sistema AAIP.
- **Junio:** obtiene constancias actualizadas.
- **Julio:** archiva constancias en `/compliance/ley-25326-datos-personales/constancias/` (carpeta privada, no versionada).

---

## Modificaciones que requieren actualización inmediata (fuera de ciclo anual)

- Cambio de finalidad de la base.
- Cambio de categorías de datos tratados (ej: incorporar datos biométricos).
- Cambio de destinatarios de cesiones.
- Cambio de proveedor de hosting o transferencia internacional.
- Incidentes de seguridad que expongan datos (ver procedimiento de notificación AAIP).

---

## Procedimiento de notificación de incidentes

Si ocurre un incidente de seguridad que afecte datos personales:

1. **T+0 horas** — Detección. CISO activa protocolo de incidentes.
2. **T+4 horas** — Contención técnica. Equipo de ingeniería aisla.
3. **T+24 horas** — Análisis de impacto. Se evalúa si hay exposición de datos personales.
4. **T+72 horas** — Notificación a la AAIP si el incidente puede generar riesgo significativo a los derechos de los titulares (criterio de la Resolución AAIP 47/2018 y armonización con estándares internacionales).
5. **T+72 a 96 horas** — Comunicación a los titulares afectados.
6. **T+7 días** — Reporte de cierre interno con root cause.

---

## Checklist operativa para el DPO

- [ ] Las 4 bases están inscriptas y la constancia vigente está archivada.
- [ ] La política de privacidad pública refleja la realidad de los tratamientos declarados.
- [ ] Los formularios de consentimiento guardan coincidencia con la finalidad declarada.
- [ ] Se cuenta con documentación de las transferencias internacionales.
- [ ] Las medidas de seguridad declaradas (nivel crítico) se corresponden con controles implementados.
- [ ] El formulario de ejercicio de derechos ARCO está publicado y disponible.

---

## Responsable del cumplimiento de este procedimiento

**Dr. Martín Castagnino**
Responsable de Protección de Datos (DPO)
dpo@incluai.com.ar
+54 351 456 7890

Suplente en caso de ausencia: Legal externo del estudio Bruchou & Funes de Rioja.

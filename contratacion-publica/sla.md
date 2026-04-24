# Acuerdo de Nivel de Servicio (SLA) — IncluAI

Anexo III del Pliego Técnico Modelo. Define los niveles de servicio comprometidos por Nativos Consultora Digital al cliente público y sus remedios en caso de incumplimiento.

---

## 1. Alcance

Este SLA aplica a la plataforma IncluAI y sus servicios asociados (soporte, mesa de ayuda, capacitación) prestados en el marco de un convenio vigente con un organismo público argentino.

## 2. Horario del servicio

- **Plataforma:** 24/7, todos los días del año.
- **Soporte humano L1 y L2:** días hábiles, lunes a viernes, 8:00 a 20:00 horario argentino (UTC-3).
- **Soporte L3 de emergencia (caída general del servicio):** 24/7, vía guardia on-call.

## 3. Disponibilidad (uptime)

### 3.1 Compromiso
**Uptime mensual mínimo: 99,5%**, excluyendo:
- Ventanas de mantenimiento programadas con 72 horas de preaviso.
- Incidentes causados por el cliente (ej: uso malicioso, carga masiva fuera de lo acordado).
- Indisponibilidad de terceros fuera del control razonable del proveedor (ej: caída de proveedor de IA, apagón de Internet provincial).

Un 99,5% mensual equivale a un máximo tolerado de **~3 horas 39 minutos** de caída por mes.

### 3.2 Medición
- Medición automática con herramienta de monitoreo externa (ej: UptimeRobot, Better Uptime).
- Reporte mensual enviado al referente técnico del Ministerio entre los días 1 y 5 del mes siguiente.
- El cliente puede validar la medición con sus propias herramientas. En caso de discrepancia, prevalece la medición conservadora a favor del cliente.

### 3.3 Ventanas de mantenimiento
- Frecuencia máxima: 1 ventana programada por mes.
- Duración máxima: 2 horas.
- Horario: entre las 22:00 y las 05:00 horario argentino.
- Preaviso mínimo: 72 horas por correo electrónico al referente técnico.

## 4. Severidades e incidencias

| Severidad | Definición | Ejemplo | Respuesta inicial | Restitución objetivo |
|---|---|---|---|---|
| S1 — Crítica | Caída total del servicio o pérdida de datos | La plataforma no carga para ningún usuario | 30 minutos 24/7 | 4 horas |
| S2 — Alta | Función crítica inoperativa para múltiples usuarios | No se puede generar planificación IA | 2 horas hábiles | 12 horas hábiles |
| S3 — Media | Función secundaria afectada o lentitud significativa | El panel directivo tarda más de 15 s | 1 día hábil | 5 días hábiles |
| S4 — Baja | Consulta, pedido de mejora, pregunta funcional | Cómo exportar un reporte | 2 días hábiles | Según planificación |

- **Respuesta inicial:** tiempo hasta el primer contacto humano del equipo de soporte (no acuse automático).
- **Restitución objetivo:** tiempo meta para devolver el servicio a operación normal; no es garantía absoluta pero es el compromiso de esfuerzo razonable.

## 5. Canales de soporte

1. **Mesa de ayuda web** (prioridad alta): portal con ticketing, visible desde la plataforma para todos los usuarios.
2. **Correo electrónico** (prioridad media): soporte@incluai.com.ar (o la que se acuerde con el cliente).
3. **Teléfono / WhatsApp** (prioridad alta para S1/S2): número provisto al referente técnico del Ministerio al momento del alta.

## 6. Mesa de ayuda — Niveles

### L1 — Primer nivel
- Atención de consultas funcionales, dudas de uso, recuperación de contraseña, onboarding.
- Resolución objetivo: 80% de los tickets en primer contacto.

### L2 — Segundo nivel
- Problemas técnicos que requieren análisis: bugs reportados, errores de integración, problemas de performance individual.
- Escalamiento desde L1 cuando no resuelve en primer contacto.

### L3 — Tercer nivel
- Ingeniería del producto, cambios de infraestructura, bugs críticos.
- Escalamiento automático en S1 y S2.

## 7. Backups y recuperación

- **Backup automático diario** con retención de 30 días.
- **Prueba de restauración trimestral** con informe al cliente.
- **RPO (Recovery Point Objective):** 24 horas.
- **RTO (Recovery Time Objective):** 4 horas para escenarios de desastre declarado.

## 8. Seguridad — Tiempos comprometidos

- **Notificación de incidente de seguridad con datos personales afectados:** dentro de las 72 horas corridas de tomar conocimiento, conforme mejores prácticas y espíritu del art. 11 de Ley 25.326.
- **Parche de vulnerabilidades críticas (CVE con score ≥ 9.0):** dentro de 72 horas de disponible.
- **Parche de vulnerabilidades altas (CVE 7.0–8.9):** dentro de 7 días.
- **Pentests anuales** por tercero independiente, con resumen ejecutivo compartido con el cliente.

## 9. Remedios por incumplimiento

### 9.1 Créditos por uptime
Si el uptime mensual cae por debajo del 99,5%, se aplica crédito en la facturación del mes siguiente:

| Uptime mensual | Crédito sobre facturación del mes |
|---|---|
| 99,0% – 99,49% | 5% |
| 98,0% – 98,99% | 10% |
| 95,0% – 97,99% | 20% |
| < 95,0% | 30% |

### 9.2 Créditos por tiempos de respuesta
Si el tiempo de respuesta inicial a incidentes S1 o S2 incumple sistemáticamente (más del 20% de los casos en un mes), se aplica crédito del 3% de la facturación mensual por cada severidad incumplida.

### 9.3 Derecho de rescisión
Si el uptime cae por debajo del 95% en **tres meses consecutivos**, o si los remedios no se aplican, el cliente está habilitado a **rescindir sin penalidad**, con devolución proporcional de importes anticipados.

## 10. Capacitación

- **Capacitación inicial incluida:** 4 horas sincrónicas online + material asincrónico en plataforma.
- **Refresco anual:** 2 horas sincrónicas online sin costo.
- **Capacitación avanzada** (directivos, referentes): módulo específico 2 horas sincrónicas.
- **Capacitación presencial en territorio:** cotizable aparte con viáticos.

## 11. Comunicación al cliente

- **Statuspage público** con estado en vivo de la plataforma (ej: status.incluai.com.ar).
- **Reporte mensual** de uptime, tickets y actualizaciones enviado al referente técnico.
- **Revisión trimestral de servicio (QBR)** con el Ministerio: 60 minutos, presencial o virtual, con dashboards de impacto.

## 12. Exclusiones

Este SLA no cubre:
- Problemas de conectividad del usuario final.
- Mal uso de la plataforma.
- Modificaciones no autorizadas del cliente a la configuración (ej: integraciones externas sin validación).
- Indisponibilidad de servicios de terceros fuera del control razonable (ej: API de proveedor de IA caída).

## 13. Revisión del SLA

Las partes pueden revisar este SLA una vez al año para ajustarlo a la realidad operativa, con acuerdo escrito. Las mejoras del SLA (mayor uptime, menores tiempos) se aplicarán unilateralmente a favor del cliente sin necesidad de enmienda formal.

---

*Acuerdo de Nivel de Servicio emitido por Nativos Consultora Digital, titular Jorge Eduardo Francesia, proveedor de IncluAI. Contacto de escalamiento: jfrancesia@gmail.com.*

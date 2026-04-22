# Presupuesto Modelo por Estudiante Beneficiado

Anexo II del Pliego Técnico Modelo. Expresado en **pesos argentinos (ARS)** al mes de abril de 2026. Sujeto a actualización semestral según **IPC INDEC — Nivel General**.

---

## 1. Lógica de precio

IncluIA factura al Estado por **estudiante beneficiado por mes**, no por licencia de docente. Se considera "estudiante beneficiado" a aquel con al menos una PPI activa o un plan de clase adaptado generado en el mes.

Esta lógica es intencional: evita cobrar por docentes que no usan la plataforma y alinea el precio con el impacto real.

> **Referencia de mercado:** el plan individual público para un docente particular es de **ARS 9.900/mes** (abril 2026). El modelo público tiene un precio por estudiante significativamente menor por efecto de volumen.

## 2. Tabla escalonada por volumen

| Tramo | Estudiantes beneficiados/mes | Precio unitario mensual | Precio anual por estudiante |
|---|---|---|---|
| A — Piloto | 1 a 500 | ARS 240 | ARS 2.880 |
| B — Escuela / departamento chico | 501 a 5.000 | ARS 180 | ARS 2.160 |
| C — Departamento mediano | 5.001 a 20.000 | ARS 150 | ARS 1.800 |
| D — Provincia chica | 20.001 a 50.000 | ARS 130 | ARS 1.560 |
| E — Provincia mediana | 50.001 a 150.000 | ARS 120 | ARS 1.440 |
| F — Provincia grande | 150.001 en adelante | ARS 105 | ARS 1.260 |

El precio se aplica por tramos de forma **acumulativa** (los primeros 500 a ARS 240, los siguientes 4.500 a ARS 180, etc.).

## 3. Escenarios de cotización

Los escenarios ilustran contratación mensual y anual. Todos incluyen capacitación y soporte básico L1/L2 sin costo adicional.

### Escenario A — Piloto departamental (3 meses)
- 400 estudiantes beneficiados/mes
- 50 docentes capacitados
- 5 escuelas
- Duración: 3 meses

| Concepto | Cálculo | Monto mensual ARS | Monto total ARS |
|---|---|---|---|
| 400 estudiantes × ARS 240 | Tramo A | 96.000 | 288.000 |
| Setup y capacitación inicial (única vez) | — | — | 450.000 |
| **Total piloto 3 meses** | | | **738.000** |

### Escenario B — Un departamento completo (12 meses)
- 12.000 estudiantes beneficiados/mes promedio
- 900 docentes capacitados
- 180 escuelas
- Duración: 12 meses

Cálculo tramo por tramo (mensual):
- Primeros 500 × 240 = ARS 120.000
- Siguientes 4.500 × 180 = ARS 810.000
- Siguientes 7.000 × 150 = ARS 1.050.000
- **Subtotal mensual:** ARS 1.980.000
- **Total anual:** ARS 23.760.000
- Setup y capacitación inicial: ARS 1.200.000 (única vez)
- **Total contrato 12 meses:** **ARS 24.960.000**

Promedio por estudiante/año: **ARS 2.080** (menor a un libro de texto).

### Escenario C — Provincia mediana completa (24 meses)
- 80.000 estudiantes beneficiados/mes promedio
- 6.000 docentes capacitados
- 1.500 escuelas
- Duración: 24 meses

Cálculo tramo por tramo (mensual):
- Primeros 500 × 240 = ARS 120.000
- Siguientes 4.500 × 180 = ARS 810.000
- Siguientes 15.000 × 150 = ARS 2.250.000
- Siguientes 30.000 × 130 = ARS 3.900.000
- Siguientes 30.000 × 120 = ARS 3.600.000
- **Subtotal mensual:** ARS 10.680.000
- **Total anual:** ARS 128.160.000
- Setup y capacitación inicial: ARS 3.500.000 (única vez)
- **Total contrato 24 meses:** **ARS 259.820.000**

Promedio por estudiante/año: **ARS 1.602**.

### Escenario D — Provincia grande (padrón 300.000 estudiantes con PPI/configuración de apoyo)
- 220.000 estudiantes beneficiados/mes promedio (estimación conservadora de adopción plena)
- 18.000 docentes capacitados
- 4.500 escuelas
- Duración: 24 meses

Cálculo tramo por tramo (mensual):
- Primeros 500 × 240 = ARS 120.000
- Siguientes 4.500 × 180 = ARS 810.000
- Siguientes 15.000 × 150 = ARS 2.250.000
- Siguientes 30.000 × 130 = ARS 3.900.000
- Siguientes 100.000 × 120 = ARS 12.000.000
- Siguientes 70.000 × 105 = ARS 7.350.000
- **Subtotal mensual:** ARS 26.430.000
- **Total anual:** ARS 317.160.000
- Setup + capacitación masiva en territorio: ARS 8.500.000 (única vez)
- **Total contrato 24 meses:** **ARS 642.820.000**

Promedio por estudiante/año: **ARS 1.441**.

## 4. Qué incluye y qué no

### Incluido en todos los escenarios
- Licencias ilimitadas de docentes, directivos y referentes ministeriales
- Capacitación inicial sincrónica (remota) + material asincrónico
- Soporte L1 y L2 por email y mesa de ayuda web
- Actualizaciones de producto
- Panel de reportes ministerial
- Un tablero de impacto trimestral personalizado

### No incluido (cotización adicional)
- Capacitaciones presenciales en territorio (viáticos, logística)
- Desarrollos a medida (SSO SAML con directorio ministerial específico, integraciones con sistemas provinciales legacy)
- Evaluaciones de impacto académico realizadas por universidades externas (ver `modelo-convenio-universidad.md`)
- Campañas de comunicación / prensa (opcional, cotizable aparte)
- Hardware o dispositivos para docentes sin conectividad

## 5. Condiciones comerciales

- **Facturación:** mensual, contra cierre del mes calendario y reporte de estudiantes beneficiados auditado.
- **Moneda:** pesos argentinos (ARS).
- **Actualización:** semestral por IPC INDEC Nivel General (1 de enero y 1 de julio de cada año).
- **Forma de pago:** 30 días fecha factura conforme régimen provincial.
- **Bonificación por pago anual adelantado:** 8% de descuento sobre total anual.
- **Bonificación por contrato plurianual (24+ meses):** 5% adicional.
- **Período de prueba:** los primeros 60 días del contrato son a satisfacción. Si el Ministerio declara el servicio no satisfactorio con fundamento técnico por escrito, se rescinde sin penalidad y se devuelve el proporcional pagado.

## 6. Comparación de valor

| Opción | Costo anual por estudiante beneficiado |
|---|---|
| Contratar 1 equipo inter-disciplinario dedicado (profesional especializado tiempo parcial) | ARS 15.000 – 40.000 |
| Licencias de software educativo extranjero no adaptado | ARS 5.000 – 12.000 |
| **IncluIA (Escenario D, provincia grande)** | **ARS 1.441** |
| **IncluIA (Escenario A, piloto)** | **ARS 2.880** |

El diferencial es de al menos **5x a 10x** a favor de IncluIA frente a las alternativas del mercado, con la ventaja adicional de estar hecho en Argentina, en español rioplatense y con cumplimiento de Res. CFE 311/16.

---

*Cotización modelo emitida por Nativos Consultora Digital, jfrancesia@gmail.com. Las cifras son referenciales y se ajustan a padrón real de cada jurisdicción.*

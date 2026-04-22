# Modelo Financiero — IncluIA

**Versión:** 2026-04-22 · v1.0
**Moneda base:** USD (equivalente oficial BCRA al último día del período).
**Supuestos macroeconómicos:** inflación Argentina anualizada 45% (2026), 28% (2027), 18% (2028+). Tipo de cambio a valor oficial mayorista.

> **Nota:** todas las cifras son proyecciones basadas en benchmarks públicos EdTech LATAM. Las cifras reales actualizadas viven en `04-metricas-traction.md`.

---

## 1. Supuestos centrales

| Supuesto | Valor base | Fuente / lógica |
|----------|-----------|-----------------|
| ARPU Pro B2C (mensual) | USD 8 | ARS 8.900 a TC blend anual |
| ARPU Escuela (por docente/mes) | USD 4 | 50% off vs. B2C por volumen |
| ARPU Provincial (por docente/mes) | USD 2,5 | Licitación, negociado |
| Conversión Free → Pro | 12% a los 45 días | Benchmark Canva Edu 9–14% |
| Churn mensual Pro | 6% | Benchmark SaaS EdTech B2C |
| Churn anual Escuela | 15% | Típico SMB SaaS |
| Churn anual Provincial | 0% (contratos 24m) | Contrato público |
| Costo Claude API por usuario activo/mes | USD 0,85 | 12 planif/mes promedio × USD 0,07 blend Sonnet+Haiku |
| Costo Supabase por usuario/mes | USD 0,12 | Pro plan + usage estimado |
| Salario promedio blended (AR) | USD 2.400/mes | Full-charge: sueldo + cargas + aguinaldo |
| Comisión Mercado Pago | 5,5% | Incluye IVA retenido |
| Comisión Stripe (cross-border) | 3,9% + USD 0,30 | Para planes USD |

---

## 2. Proyección Trimestral — Años 1 y 2 (Escenario Base)

### Año 1 (2026)

| Métrica | Q2 26 | Q3 26 | Q4 26 |
|---------|-------|-------|-------|
| Usuarios free (EoP) | 1.200 | 4.800 | 11.000 |
| Usuarios Pro (EoP) | 90 | 480 | 1.320 |
| Usuarios Escuela (EoP) | 0 | 60 | 280 |
| Usuarios Prov. (EoP) | 0 | 0 | 200 |
| **MRR (USD)** | 720 | 4.080 | 11.900 |
| **Ingresos trimestrales** | 1.800 | 9.600 | 32.000 |
| COGS (IA + infra + pagos) | 520 | 2.700 | 8.900 |
| Gross margin % | 71% | 72% | 72% |
| Headcount | 3 | 4 | 5 |
| OPEX total | 18.000 | 38.000 | 52.000 |
| **EBITDA trimestral** | (16.720) | (31.100) | (28.900) |
| Cash EoP | 733k | 702k | 673k |

### Año 2 (2027)

| Métrica | Q1 27 | Q2 27 | Q3 27 | Q4 27 |
|---------|-------|-------|-------|-------|
| Usuarios Pro (EoP) | 2.400 | 4.000 | 6.200 | 8.500 |
| Usuarios Escuela (EoP) | 620 | 1.100 | 1.800 | 2.600 |
| Usuarios Prov. (EoP) | 200 | 200 | 600 | 1.400 |
| **MRR (USD)** | 22.300 | 38.800 | 63.500 | 94.200 |
| Ingresos trimestrales | 58.000 | 108.000 | 183.000 | 270.000 |
| COGS | 13.500 | 24.000 | 39.000 | 55.000 |
| Gross margin % | 77% | 78% | 79% | 80% |
| Headcount | 8 | 10 | 12 | 14 |
| OPEX total | 88.000 | 115.000 | 142.000 | 178.000 |
| **EBITDA trimestral** | (43.500) | (31.000) | 2.000 | 37.000 |
| Cash EoP | 540k | 440k | 385k | 370k |

**Break-even operativo mensual: diciembre 2027. EBITDA positivo Q3 2027. Cash-out sin nueva ronda: julio 2028 (16 meses de runway desde cierre).**

---

## 3. Proyección Anual — 5 años (3 escenarios)

### Escenario Base

| USD miles | 2026 | 2027 | 2028 | 2029 | 2030 |
|-----------|------|------|------|------|------|
| Usuarios pagos EoP | 1.800 | 12.500 | 48.000 | 140.000 | 320.000 |
| ARR | 120 | 980 | 4.100 | 12.800 | 31.500 |
| Ingresos | 43 | 619 | 2.700 | 9.200 | 24.800 |
| COGS | 12 | 132 | 486 | 1.470 | 3.720 |
| Gross margin % | 72% | 79% | 82% | 84% | 85% |
| OPEX | 108 | 523 | 1.920 | 5.800 | 13.200 |
| EBITDA | (77) | (36) | 294 | 1.930 | 7.880 |
| Headcount EoP | 5 | 14 | 32 | 58 | 95 |

### Escenario Optimista (+ contrato provincial Q3 2026)

| USD miles | 2026 | 2027 | 2028 | 2029 | 2030 |
|-----------|------|------|------|------|------|
| ARR | 280 | 2.100 | 7.800 | 22.500 | 52.000 |
| Ingresos | 98 | 1.320 | 5.100 | 16.200 | 41.500 |
| EBITDA | (25) | 180 | 1.150 | 4.600 | 15.700 |

### Escenario Pesimista (cero B2G, B2B más lento)

| USD miles | 2026 | 2027 | 2028 | 2029 | 2030 |
|-----------|------|------|------|------|------|
| ARR | 72 | 520 | 1.900 | 5.400 | 11.800 |
| Ingresos | 28 | 320 | 1.200 | 3.800 | 9.200 |
| EBITDA | (95) | (185) | (90) | 310 | 1.900 |
| Runway hasta | Sep-27 | — | — | — | — |

En pesimista se requiere bridge USD 400–600k en Q2 2027 o reducción de headcount.

---

## 4. Unit Economics

### CAC por canal (mes 12)

| Canal | CAC (USD) | Método de cálculo |
|-------|-----------|-------------------|
| SEO / orgánico | 4 | Costo de content + SEO / usuarios Pro orgánicos |
| Directo (referral) | 0–2 | Programa de referidos 1 mes gratis |
| Partnerships sindicatos | 12 | Costo webinar + comisión referida / nuevos pagos |
| Ads Meta/Google | 28 | CPA objetivo, usado sólo para testing |
| B2B self-serve | 180 | SDR junior + demo técnica |
| B2G licitación | 9.500 | Equipo ventas + legal + viajes / contrato firmado |

### LTV por plan

| Plan | ARPU mensual | Churn mensual | LTV bruto | LTV neto (gross margin) |
|------|--------------|---------------|-----------|-------------------------|
| Pro B2C | 8 | 6% | 133 | 107 |
| Escuela B2B | 4/docente | 1,3% | 308 | 252 |
| Provincial | 2,5/docente | 0% (contrato) | 60/24m | 53 |

### LTV / CAC blended (año 2)
- Pro orgánico: **107 / 4 = 26,7x** ← excelente, canal a escalar
- Pro paid: 107 / 28 = 3,8x ← aceptable, mantener con cap
- Escuela: 252 / 180 = 1,4x ← *tight, mejorar en año 3 con upsell*
- Provincial: (2.500 docentes × USD 60) / 9.500 = **15,8x** ← canal de moat

### Payback period
- Pro orgánico: **0,5 meses**
- Pro paid: 3,5 meses
- Escuela: 9 meses
- Provincial: 2 meses (pago por adelantado 50%)

---

## 5. Estructura de costos

### COGS (año 2 base)
- Claude API: **48%** del COGS total
- Supabase (DB + Storage + Auth): 18%
- Comisiones MP/Stripe: 22%
- Observabilidad + Vercel + misc: 12%

**Sensibilidad:** si costo de Claude API sube +50%, gross margin pasa de 79% a 71%. Aceptable. Si sube +100%, margen 63% → activamos routing a Haiku + caching agresivo de prompts (ya implementado al 40%).

### OPEX (año 2 base, breakdown mensual promedio)
- Salarios + cargas: **68%**
- Marketing/ventas: 14%
- Legal/compliance/DPO: 6%
- Infra desarrollo (GitHub, Sentry, Linear, etc.): 4%
- Contador + estudio jurídico: 3%
- Viajes + eventos licitación: 3%
- Miscelánea: 2%

---

## 6. Burn rate & Runway

| Momento | Cash disponible | Burn mensual | Runway |
|---------|-----------------|--------------|--------|
| Post-cierre ronda (mayo 2026) | 750k | 52k | 14,4m operativo, 22m total (con revenue creciendo) |
| Dic 2026 | 673k | 48k | — |
| Jun 2027 | 470k | 38k | — |
| Dic 2027 | 370k | break-even | ∞ |

Plan de contingencia si revenue crece 50% más lento: reducción headcount -2 (DPO part-time + 1 ing.) extiende runway +4 meses. Plan documentado en `09-ask.md`.

---

## 7. Métricas SaaS clave (objetivo al cierre año 2)

| Métrica | Objetivo | Benchmark SaaS EdTech |
|---------|----------|------------------------|
| MRR | USD 94k | Top cuartil seed |
| Growth rate MoM | 18–22% | T2D3 temprano |
| Gross margin | 80% | 75–85% sano |
| Net revenue retention | 115% | >110% = buena |
| Logo churn (Pro) anual | <35% | 30–50% SaaS B2C |
| Magic Number | >1,0 | >0,75 = escalable |
| CAC payback blended | <6 meses | <12m sano |
| Burn multiple | <1,5 | <1 excelente, <2 ok |

---

## 8. Asunciones que más afectan el modelo (ranking de sensibilidad)

1. **Conversión free → Pro** (base 12%). Si baja a 7%: ARR año 2 cae 38%.
2. **Ciclo de cierre B2G** (base 9 meses). Si se extiende a 15 meses: primer contrato Q1 2028, no Q3 2027.
3. **Costo Claude API** (ver §5).
4. **Retención Pro** (base churn 6%/mes). Si sube a 9%: LTV cae 28%, LTV/CAC paid pasa a <3x.
5. **ARPU provincial** (base USD 2,5). Provincias grandes pueden negociar a USD 1,8 → revisar viabilidad caso por caso.

---

## 9. Retorno al inversor — estimado

**Ronda seed USD 750k · SAFE post-money cap USD 6M · Discount 20%**

| Escenario salida | Múltiplo sobre ARR | Valoración salida | Retorno cash (12,5%) | MOIC |
|-----------------|-------------------|-------------------|----------------------|------|
| Pesimista (ARR 2030 USD 12M, 4x) | 4x | 48M | 6M | 8x |
| Base (ARR 2030 USD 31M, 6x) | 6x | 186M | 23M | 31x |
| Optimista (ARR 2030 USD 52M, 8x M&A corp) | 8x | 416M | 52M | 69x |

Comparables múltiplos EdTech LATAM M&A 2021–2025: Crehana (4x), Platzi (6x), Ubits (5,5x), Rappi-education vertical (7x).

---

*Actualización trimestral. Última revisión: 2026-04-22. Modelo detallado en Google Sheets disponible bajo NDA.*

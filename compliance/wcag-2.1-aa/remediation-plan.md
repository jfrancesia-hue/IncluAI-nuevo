# Plan de Remediación WCAG 2.1 AA

**Producto:** IncluIA
**Plan derivado de:** [audit-report.md](./audit-report.md)
**Fecha de plan:** 22 de abril de 2026
**Fecha objetivo de conformidad total:** 15 de julio de 2026
**Responsable del plan:** Mariana Pérez (Accesibilidad) + Sebastián Martínez (CTO)

---

## Estructura del plan

Cada item incluye:
- **ID** (RM-XX): identificador único
- **Criterio WCAG**: criterio de referencia
- **Severidad**: Crítica / Alta / Media / Baja
- **Owner**: persona responsable
- **Estimación**: esfuerzo en días/persona
- **Fecha compromiso**: fecha de cierre
- **Estado**: Pendiente / En progreso / Cerrado / Verificado
- **Criterio de verificación**: cómo se validará que está cerrado

---

## Tabla consolidada de remediaciones

| ID | Criterio | Severidad | Owner | Estimación | Fecha compromiso | Estado |
|----|----------|-----------|-------|------------|------------------|--------|
| RM-05 | 4.1.2 Nombre, función, valor | Crítica | Sofía Giménez (Frontend) | 3 días | 2026-05-05 | En progreso |
| RM-06 | 4.1.3 Mensajes de estado | Alta | Sofía Giménez (Frontend) | 1 día | 2026-05-07 | Pendiente |
| RM-02 | 1.4.3 Contraste (mínimo) | Media | Tomás Ruiz (Diseño) | 0.5 días | 2026-05-10 | Pendiente |
| RM-04 | 3.3.3 Sugerencia ante errores | Media | Sofía Giménez (Frontend) | 0.5 días | 2026-05-12 | Pendiente |
| RM-01 | 1.3.5 Identificar propósito de entrada | Media | Sofía Giménez (Frontend) | 0.25 días | 2026-05-15 | Pendiente |
| RM-03 | 1.4.11 Contraste no textual | Baja | Tomás Ruiz (Diseño) | 0.25 días | 2026-05-20 | Pendiente |

---

## Detalle por item

### RM-05 — Selector de discapacidad no accesible (Crítica)

- **Criterio WCAG:** 4.1.2 Nombre, función, valor
- **Estado actual:** El componente `<DisabilitySelector />` usa `<div role="button">` con lógica custom de apertura de opciones. No anuncia correctamente su rol ni el estado de selección a NVDA/JAWS/VoiceOver.
- **Estado objetivo:** Componente con semántica `combobox` o `listbox` completa, operable por teclado (flechas, Enter, Escape, tipeo para filtrar) y anunciado correctamente por lectores de pantalla.
- **Pasos de remediación:**
  1. Reemplazar implementación custom por `@radix-ui/react-select` v2.x (ya está en dependencias).
  2. Mantener la paleta visual actual aplicando los mismos tokens de Tailwind.
  3. Añadir `aria-describedby` apuntando a la descripción contextual de cada tipo de discapacidad.
  4. Traducir labels de estado (open/closed) al español mediante la prop `labels`.
  5. Cubrir con tests Playwright `.spec.ts` que validen operación por teclado.
  6. Validar con NVDA + Chrome, VoiceOver + Safari y TalkBack + Chrome Android.
- **Estimación:** 3 días/persona
- **Owner:** Sofía Giménez
- **Fecha compromiso:** 2026-05-05
- **Criterio de verificación:** axe-core sin violaciones en ruta `/guias/nueva`, test Playwright verde, validación manual con NVDA sin errores. Pull request aprobado por Mariana Pérez.

### RM-06 — Toasts no anunciados (Alta)

- **Criterio WCAG:** 4.1.3 Mensajes de estado
- **Estado actual:** El componente `<Toaster />` (basado en `sonner`) muestra toasts visuales pero no los anuncia a lectores de pantalla.
- **Estado objetivo:** Toasts que se anuncian automáticamente con `aria-live="polite"` para confirmaciones y `aria-live="assertive"` para errores críticos.
- **Pasos de remediación:**
  1. Configurar `sonner` con prop `richColors` + `closeButton` y envolver en un contenedor con `role="status"` / `role="alert"` según tipo.
  2. Agregar texto oculto (`sr-only`) con prefijo "Notificación de éxito:" / "Error:" para contexto adicional.
  3. Verificar que mensajes duren al menos 5 segundos para lectores de pantalla lentos.
- **Estimación:** 1 día/persona
- **Owner:** Sofía Giménez
- **Fecha compromiso:** 2026-05-07
- **Criterio de verificación:** NVDA anuncia el toast al aparecer. Test unitario en `Toaster.test.tsx`.

### RM-02 — Contraste en placeholders del editor (Media)

- **Criterio WCAG:** 1.4.3 Contraste (mínimo)
- **Estado actual:** Token `--color-placeholder: aqua-400` = #7DD3D8, contraste 3.8:1 sobre `#FFFFFF`.
- **Estado objetivo:** Token a `aqua-600` = #0E7490, contraste 6.1:1.
- **Pasos de remediación:**
  1. Actualizar `tailwind.config.ts` y token semántico `--color-placeholder`.
  2. Revisar 12 ocurrencias de placeholder en editor y formularios.
  3. Verificar con herramienta "Colour Contrast Analyser" de TPGi.
- **Estimación:** 0.5 días
- **Owner:** Tomás Ruiz
- **Fecha compromiso:** 2026-05-10

### RM-04 — Mensaje de error en campo CUIL (Media)

- **Criterio WCAG:** 3.3.3 Sugerencia ante errores
- **Estado actual:** El mensaje "CUIL inválido" no indica el formato esperado.
- **Estado objetivo:** "CUIL inválido. El formato debe ser XX-XXXXXXXX-X (por ejemplo 20-12345678-3)".
- **Pasos de remediación:**
  1. Actualizar schema Zod `docenteSchema.cuil` con mensajes de error contextuales.
  2. Agregar validación de dígito verificador (algoritmo mod 11) para detectar errores de tipeo.
  3. Test de formulario en Playwright.
- **Estimación:** 0.5 días
- **Owner:** Sofía Giménez
- **Fecha compromiso:** 2026-05-12

### RM-01 — Atributos autocomplete faltantes (Media)

- **Criterio WCAG:** 1.3.5 Identificar el propósito de la entrada
- **Estado actual:** Campo CUIL y teléfono sin `autocomplete`.
- **Estado objetivo:** `autocomplete="tel"` en teléfono, `autocomplete="off"` en CUIL (no existe tipo estándar, pero se agrega atributo `inputmode="numeric"`).
- **Pasos de remediación:**
  1. Agregar atributos en `DocenteProfileForm.tsx`.
- **Estimación:** 0.25 días
- **Owner:** Sofía Giménez
- **Fecha compromiso:** 2026-05-15

### RM-03 — Contraste de bordes de inputs (Baja)

- **Criterio WCAG:** 1.4.11 Contraste no textual
- **Estado actual:** Borde en `slate-300` (#CBD5E1), contraste 2.8:1 sobre fondo blanco.
- **Estado objetivo:** Borde en `slate-500` (#64748B), contraste 4.2:1.
- **Pasos de remediación:**
  1. Actualizar token `--color-input-border`.
- **Estimación:** 0.25 días
- **Owner:** Tomás Ruiz
- **Fecha compromiso:** 2026-05-20

---

## Cronograma visual

```
Mayo 2026
W1 (4-10):   [RM-05 crítico -------][RM-06 ----][RM-02 ---]
W2 (11-17):  [RM-04 ---][RM-01 -]
W3 (18-24):  [RM-03 -]
W4 (25-31):  [Regresión automatizada + testing con usuarios reales]

Junio 2026
W1-W2: Validación externa con auditoría independiente (Laboratorio de Accesibilidad de la Fundación Sidar)
W3-W4: Remediación de hallazgos residuales (si los hay)

Julio 2026
W1: Auditoría final interna
W2 (hasta 15/07): Emisión de Declaración de Conformidad AA actualizada
```

---

## Mecanismo de seguimiento

- **Reunión semanal:** miércoles 10hs, comité de accesibilidad (Mariana, Sofía, Tomás, CTO).
- **Tablero:** issues en GitHub con label `a11y`, milestone "WCAG AA julio 2026".
- **Métrica de cierre:** axe-core + Lighthouse CI sin regresiones en CI de cada PR.
- **Testing con usuarios reales:** sesiones quincenales con 4 docentes con distintas discapacidades.

---

## Prevención de regresiones

1. **CI pipeline:** `axe-playwright` corre sobre 42 rutas en cada pull request. Falla el PR si se introduce violación AA.
2. **Definition of Done:** toda nueva feature o componente debe pasar checklist de accesibilidad antes de merge.
3. **Capacitación:** sesión trimestral obligatoria para el equipo de producto sobre WCAG y pruebas con lectores de pantalla.
4. **Design tokens:** paleta aprobada por accesibilidad, nuevos tokens requieren validación de contraste documentada.

---

**Aprobado por:**

Mariana Pérez — Responsable de Accesibilidad — 2026-04-22
Sebastián Martínez — CTO — 2026-04-22
Lucía Fernández — CEO — 2026-04-22

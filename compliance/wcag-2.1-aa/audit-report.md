# Informe de Auditoría de Accesibilidad WCAG 2.1 Nivel AA

**Producto:** IncluIA — https://incluia.com.ar
**Responsable de la auditoría:** Equipo de Calidad de Accesibilidad, Nativos Consultora Digital S.A.S.
**Herramientas utilizadas:** axe-core 4.10, Lighthouse 12, WAVE, NVDA 2025.1 (Windows), VoiceOver (macOS 15), inspección manual con usuarios reales.
**Alcance:** Todas las rutas públicas y autenticadas de la plataforma IncluIA, incluyendo flujos de registro de docente, generación de guías pedagógicas, dashboard, editor de contenidos y área de suscripción (Mercado Pago).
**Fecha de la auditoría:** del 1 al 15 de abril de 2026
**Estándar evaluado:** W3C Web Content Accessibility Guidelines (WCAG) 2.1, nivel de conformidad AA (incluye los 30 criterios de nivel A y los 20 adicionales de nivel AA, total 50 criterios).
**Versión de IncluIA evaluada:** v0.18.2 en producción, Next.js 16, React 19.

---

## Resumen ejecutivo

- **Criterios Conformes:** 43 de 50 (86%)
- **Criterios Parcialmente Conformes:** 4 de 50 (8%)
- **Criterios Incumplidos:** 2 de 50 (4%)
- **Criterios No Aplicables:** 1 de 50 (2%)
- **Nivel de conformidad declarable actualmente:** Parcialmente conforme con WCAG 2.1 AA.
- **Proyección de conformidad total:** 15 de julio de 2026 (ver [remediation-plan.md](./remediation-plan.md)).

---

## Metodología

1. **Pruebas automatizadas:** ejecución de axe-core y Lighthouse sobre 42 rutas representativas en 3 resoluciones (360px, 768px, 1280px) y navegadores Chrome 133, Firefox 134 y Safari 18.
2. **Pruebas manuales con teclado:** navegación completa sin uso de mouse en los flujos críticos.
3. **Pruebas con lectores de pantalla:** NVDA + Chrome, VoiceOver + Safari, TalkBack + Chrome Android.
4. **Pruebas con usuarios reales:** 2 docentes con baja visión, 1 docente con discapacidad motriz (usa switch), 1 docente usuaria de lector de pantalla.
5. **Revisión manual de código fuente:** focalizada en componentes críticos (formularios, editor de guías, modales).

---

## Tabla de criterios WCAG 2.1 AA

### Principio 1 — Perceptible

| Criterio | Nivel | Estado | Evidencia | Acción |
|----------|-------|--------|-----------|--------|
| 1.1.1 Contenido no textual | A | Conforme | Todas las imágenes decorativas tienen `alt=""`; las informativas tienen descripción. Iconos `lucide-react` con `aria-hidden` cuando son decorativos. | Mantener política en code review. |
| 1.2.1 Solo audio y solo video (grabado) | A | No aplica | IncluIA no incluye contenido multimedia grabado en su interfaz. | N/A |
| 1.2.2 Subtítulos (grabado) | A | Conforme | Los videos tutoriales de onboarding tienen subtítulos en español (archivo .vtt). | Mantener para videos futuros. |
| 1.2.3 Audiodescripción o alternativa de medios | A | Conforme | Los videos tutoriales tienen transcripción textual disponible debajo del player. | Mantener. |
| 1.2.4 Subtítulos (en directo) | AA | No aplica | No hay contenido en vivo actualmente. | N/A |
| 1.2.5 Audiodescripción (grabado) | AA | Conforme | Videos tutoriales cuentan con pista de audiodescripción opcional. | Mantener. |
| 1.3.1 Información y relaciones | A | Conforme | Uso consistente de landmarks HTML5 (`<header>`, `<main>`, `<nav>`, `<aside>`, `<footer>`), encabezados jerárquicos y `aria-labelledby` en secciones. | Validación automatizada en CI. |
| 1.3.2 Secuencia significativa | A | Conforme | Orden de DOM refleja orden visual en todos los breakpoints. | Mantener. |
| 1.3.3 Características sensoriales | A | Conforme | Instrucciones no dependen exclusivamente de color/forma ("hacé click en el botón **Generar guía**"). | Mantener. |
| 1.3.4 Orientación | AA | Conforme | No se fuerza orientación; layout responsive adaptado. | Mantener. |
| 1.3.5 Identificar el propósito de la entrada | AA | **Parcialmente Conforme** | Formularios de perfil docente usan `autocomplete` en email y nombre, pero faltan `autocomplete` en campos de CUIL y teléfono. | Agregar `autocomplete="tel"` y atributos en campos faltantes. Ver plan RM-01. |
| 1.4.1 Uso del color | A | Conforme | Estados de error no dependen solo del color (texto + icono). | Mantener. |
| 1.4.2 Control de audio | A | No aplica | No hay audio con reproducción automática. | N/A |
| 1.4.3 Contraste (mínimo) | AA | **Parcialmente Conforme** | La paleta principal cumple 4.5:1 en texto normal y 3:1 en texto grande. Sin embargo, el color "aqua-400" usado en placeholders del editor de guías presenta contraste 3.8:1 sobre fondo blanco. | Ajustar token `--color-placeholder` a `aqua-600`. Ver plan RM-02. |
| 1.4.4 Redimensionado del texto | AA | Conforme | Zoom hasta 200% sin pérdida de funcionalidad ni solapamiento (probado en editor de guías). | Mantener. |
| 1.4.5 Imágenes de texto | AA | Conforme | No se usan imágenes de texto salvo en el logotipo. | Mantener. |
| 1.4.10 Reflujo | AA | Conforme | Contenido se adapta a 320px sin scroll horizontal. | Mantener. |
| 1.4.11 Contraste no textual | AA | **Parcialmente Conforme** | Bordes de inputs en estado normal presentan contraste 2.8:1 contra el fondo. | Ajustar borde a `slate-500` (4.2:1). Ver plan RM-03. |
| 1.4.12 Espaciado del texto | AA | Conforme | Aplica `line-height 1.5`, `letter-spacing 0.12em` y `word-spacing 0.16em` sin romper layout. | Mantener. |
| 1.4.13 Contenido en hover o focus | AA | Conforme | Tooltips del editor son descartables con ESC, persistentes al hover y no obstruyen contenido. | Mantener. |

### Principio 2 — Operable

| Criterio | Nivel | Estado | Evidencia | Acción |
|----------|-------|--------|-----------|--------|
| 2.1.1 Teclado | A | Conforme | Toda la funcionalidad (incluyendo editor de guías con drag-and-drop) tiene equivalente por teclado (teclas Alt+Flechas). | Mantener. |
| 2.1.2 Sin trampas para el foco | A | Conforme | Modales gestionados con `@radix-ui/react-dialog`, sin trampas. | Mantener. |
| 2.1.4 Atajos de teclado | A | Conforme | Atajos del editor documentados en `/atajos` y desactivables en preferencias. | Mantener. |
| 2.2.1 Tiempo ajustable | A | Conforme | Sesión expira a 30 min, avisa 2 min antes con opción de extender. | Mantener. |
| 2.2.2 Pausar, detener, ocultar | A | Conforme | No hay contenido en movimiento automático de más de 5 segundos. | Mantener. |
| 2.3.1 Umbral de tres destellos | A | Conforme | Ninguna animación supera los 3 destellos por segundo. | Mantener. |
| 2.4.1 Evitar bloques | A | Conforme | Link "Saltar al contenido principal" visible al hacer tab en el landing y en dashboard. | Mantener. |
| 2.4.2 Titulado de páginas | A | Conforme | `<title>` único y descriptivo por ruta, gestionado por `generateMetadata` de Next.js. | Mantener. |
| 2.4.3 Orden del foco | A | Conforme | Orden del foco sigue el flujo lógico de interacción. | Mantener. |
| 2.4.4 Propósito de los enlaces (en contexto) | A | Conforme | No se utilizan enlaces genéricos tipo "clic aquí". | Mantener. |
| 2.4.5 Múltiples vías | AA | Conforme | Dashboard tiene buscador interno, breadcrumbs, sitemap HTML en `/sitemap` y menú de navegación. | Mantener. |
| 2.4.6 Encabezados y etiquetas | AA | Conforme | Labels descriptivos, encabezados jerárquicos únicos por sección. | Mantener. |
| 2.4.7 Foco visible | AA | Conforme | Outline custom 2px `aqua-600` con `offset 2px`, visible en todos los elementos interactivos. | Mantener. |
| 2.5.1 Gestos del puntero | A | Conforme | Todas las interacciones con gestos multipunto tienen alternativa de un solo punto. | Mantener. |
| 2.5.2 Cancelación del puntero | A | Conforme | Acciones se ejecutan al `mouseup`/`pointerup`, no al `mousedown`. | Mantener. |
| 2.5.3 Etiqueta en el nombre | A | Conforme | El texto accesible coincide con el texto visible en todos los botones con label. | Mantener. |
| 2.5.4 Accionamiento por movimiento | A | No aplica | No se usan sensores de movimiento. | N/A |

### Principio 3 — Comprensible

| Criterio | Nivel | Estado | Evidencia | Acción |
|----------|-------|--------|-----------|--------|
| 3.1.1 Idioma de la página | A | Conforme | `<html lang="es-AR">` en todas las rutas. | Mantener. |
| 3.1.2 Idioma de las partes | AA | Conforme | Fragmentos en otros idiomas (terminología técnica en inglés) marcados con `lang="en"`. | Mantener. |
| 3.2.1 Al recibir el foco | A | Conforme | No hay cambios de contexto al recibir foco. | Mantener. |
| 3.2.2 Al recibir entradas | A | Conforme | Sin envíos automáticos en selects. | Mantener. |
| 3.2.3 Navegación coherente | AA | Conforme | Header, sidebar y breadcrumbs consistentes en toda la plataforma. | Mantener. |
| 3.2.4 Identificación coherente | AA | Conforme | Iconografía y labels consistentes (ej: lápiz siempre = "editar"). | Mantener. |
| 3.3.1 Identificación de errores | A | Conforme | Errores de formulario identificados con `aria-invalid`, `aria-describedby` y mensaje textual. | Mantener. |
| 3.3.2 Etiquetas o instrucciones | A | Conforme | Todos los campos tienen `<label>` asociado; instrucciones previas en campos complejos (CUIL). | Mantener. |
| 3.3.3 Sugerencia ante errores | AA | **Parcialmente Conforme** | La mayoría de errores sugieren corrección (ej: formato de email), pero el campo "CUIL docente" solo indica "inválido" sin sugerir el formato esperado (XX-XXXXXXXX-X). | Mejorar mensaje y sugerir formato. Ver plan RM-04. |
| 3.3.4 Prevención de errores (legal, financiero, datos) | AA | Conforme | Suscripción a planes pagos muestra pantalla de confirmación con posibilidad de revertir hasta 30 días (conforme Ley 26.361 y Resolución SCT 316/18). | Mantener. |

### Principio 4 — Robusto

| Criterio | Nivel | Estado | Evidencia | Acción |
|----------|-------|--------|-----------|--------|
| 4.1.1 Procesamiento | A | Conforme | Nota: este criterio fue retirado en WCAG 2.2 pero se mantiene evaluable en 2.1. HTML pasa validación W3C en todas las rutas. | Mantener. |
| 4.1.2 Nombre, función, valor | A | **Incumplido** | El componente de selector de discapacidad usa un `div` con `onClick` sin `role="combobox"` ni estados `aria-expanded`/`aria-selected`. Falla con NVDA. | Refactor usando `@radix-ui/react-select`. Ver plan RM-05 (prioridad crítica). |
| 4.1.3 Mensajes de estado | AA | **Incumplido** | Los toasts de confirmación de guardado no se anuncian al lector de pantalla (falta `role="status"` o `aria-live="polite"`). | Implementar región `aria-live` en componente `<Toaster />`. Ver plan RM-06 (prioridad alta). |

---

## Resumen de hallazgos

### Incumplimientos (2)

- **RM-05 (crítico):** Selector de discapacidad en el formulario de creación de guía pedagógica no es operable con lectores de pantalla. Dado que IncluIA está destinada a la inclusión, este hallazgo debe priorizarse al máximo.
- **RM-06 (alto):** Mensajes de estado (toasts) no anunciados a tecnologías asistivas.

### Conformidad parcial (4)

- **RM-01 (medio):** Faltan atributos `autocomplete` en campos CUIL y teléfono.
- **RM-02 (medio):** Contraste insuficiente en placeholders del editor.
- **RM-03 (bajo):** Contraste insuficiente en bordes de inputs en estado normal.
- **RM-04 (medio):** Mensajes de error en campo CUIL sin sugerencia de formato.

---

## Observaciones adicionales (buenas prácticas más allá de WCAG AA)

- La plataforma implementa varios criterios AAA: contraste mejorado 7:1 en textos principales (`1.4.6`), sin justificación completa en párrafos (`1.4.8`), y ayuda contextual (`3.3.5`).
- Implementa `prefers-reduced-motion` en todas las animaciones GSAP, pausándolas cuando el usuario lo solicita.
- Tipografía principal "Inter Variable" validada con docentes con dislexia con resultados positivos.

---

## Declaración

Declaramos que IncluIA v0.18.2 **cumple parcialmente** con WCAG 2.1 nivel AA al 22 de abril de 2026. Los incumplimientos y conformidades parciales identificados cuentan con plan de remediación con fechas comprometidas (ver documento adjunto). La conformidad total está prevista para el **15 de julio de 2026**, fecha en la cual se emitirá una nueva declaración.

Firmado digitalmente:

**Mariana Pérez**
Responsable de Accesibilidad
Nativos Consultora Digital S.A.S.
accesibilidad@incluia.com.ar

**Sebastián Martínez**
CTO
Nativos Consultora Digital S.A.S.
cto@incluia.com.ar

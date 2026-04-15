# UI-UX.md — IncluIA
## Diseño visual, componentes, accesibilidad y responsive
## Claude Code: referencia continua durante todo el desarrollo

---

## Identidad visual

### Nombre: IncluIA
### Tagline: "Planificá clases inclusivas en minutos"
### Tono: Profesional, confiable, cálido, accesible

---

## Paleta de colores

```css
:root {
  /* Primarios — Azul institucional */
  --primary: #1e3a5f;
  --primary-light: #2a5a8f;
  --primary-bg: #e8f0fe;
  --primary-50: #f0f5ff;

  /* Acento — Verde inclusión */
  --accent: #16a34a;
  --accent-light: #dcfce7;
  --accent-dark: #0d9448;

  /* Naranja — CTAs, alertas */
  --orange: #ea580c;
  --orange-light: #fff7ed;

  /* Neutrales */
  --bg: #f5f7fa;
  --card: #ffffff;
  --text: #1a2332;
  --text-light: #64748b;
  --text-muted: #94a3b8;
  --border: #e2e8f0;
  --border-focus: #1e3a5f;

  /* Estado */
  --success: #16a34a;
  --error: #dc2626;
  --warning: #f59e0b;
  --info: #3b82f6;
}
```

### Tailwind config:

```typescript
// tailwind.config.ts
{
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1e3a5f',
          light: '#2a5a8f',
          bg: '#e8f0fe',
          50: '#f0f5ff',
        },
        accent: {
          DEFAULT: '#16a34a',
          light: '#dcfce7',
          dark: '#0d9448',
        },
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        body: ['DM Sans', 'sans-serif'],
      },
    },
  },
}
```

---

## Tipografía

### Fuentes (Google Fonts):
```html
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700&family=Fraunces:ital,wght@0,600;0,700;0,800;1,600&display=swap" rel="stylesheet">
```

### Uso:
- **Fraunces** (serif): títulos principales, headers de secciones, nombre "IncluIA"
- **DM Sans** (sans-serif): todo el resto — body, botones, labels, navegación

### Tamaños:
- Hero title: `clamp(32px, 5vw, 52px)`, font-weight 800
- Page title: `24px`, font-weight 700
- Section header: `18-20px`, font-weight 700
- Body: `15px`, font-weight 400
- Small/caption: `13px`, font-weight 400-500
- Label: `14px`, font-weight 600

---

## Componentes clave

### Navbar (dashboard)
```
[🧩 IncluIA]                    [Plan Badge] [👤 Nombre ▾]
─────────────────────────────────────────────────────────
```
- Sticky top, fondo blanco, borde inferior sutil
- Logo + nombre a la izquierda
- Badge de plan (Free/Pro) + menú usuario a la derecha
- Mobile: hamburguesa con menú lateral

### Plan Badge
- Free: gris con texto `Gratuito`
- Pro: verde con texto `Pro ✓`
- Badge pequeño, border radius 20px

### Formulario — Pasos
```
[████████░░░░░░░░░░░░░░░░░░░░]  Paso 1 de 3
```
- Barra de progreso con 3 segmentos
- Segmento activo: verde accent
- Segmento completado: verde accent
- Segmento pendiente: gris border

### Cards de discapacidad (multi-select)
```
┌──────────────┐
│     🧩       │
│    TEA       │
│  (Autismo)   │
└──────────────┘
```
- Grid responsivo: 4 columnas desktop, 3 tablet, 2 mobile
- Estado normal: borde gris, fondo blanco
- Estado seleccionado: borde verde, fondo verde claro
- Hover: borde verde semi-transparente
- Tooltip con descripción al hover/touch

### Select / Input
- Border radius: 10px
- Border: 1.5px solid border (normal) → accent (completado) → primary (focus)
- Padding: 12px 14px
- Transición suave en border color

### Botones
```
[Primario]  → fondo accent, texto blanco, shadow verde
[Secundario] → borde border, fondo blanco, texto text
[Terciario]  → sin borde, fondo transparent, texto primary
[Peligro]    → fondo error, texto blanco
[Disabled]   → fondo border, texto text-light, cursor not-allowed
```
- Border radius: 10px
- Padding: 12px 20px (normal), 14px 28px (grande)
- Hover: translateY(-1px) + shadow más fuerte
- Loading: spinner + texto "Generando..." / "Cargando..."

### Card de resultado (guía)
```
┌─────────────────────────────────────────┐
│ ## 1. 📚 Contenidos prioritarios...     │
│ ─────────────────────────────────────── │
│                                         │
│ - **Priorizar**: ejemplo concreto...    │
│ - **Adaptar**: ejemplo concreto...      │
│                                         │
│ 💡 Tip: ...                             │
│                                    [📋] │
└─────────────────────────────────────────┘
```
- Fondo blanco, borde sutil, border-radius 16px
- Shadow suave: `0 2px 12px rgba(0,0,0,0.04)`
- Cada sección separada con border-bottom en primary-bg
- Botón copiar sección (ícono clipboard) en esquina

### Paywall Modal
```
┌─────────────────────────────────────┐
│          🔒 Plan Gratuito           │
│                                     │
│  Usaste tus 2 guías gratuitas      │
│  de este mes.                       │
│                                     │
│  Con el Plan Pro ($9.900/mes)       │
│  generás hasta 40 guías por mes,   │
│  guardás tu historial y exportás    │
│  a PDF.                             │
│                                     │
│  [  Ver planes  ]  [  Cerrar  ]    │
└─────────────────────────────────────┘
```
- Modal centrado con overlay oscuro
- Animación de entrada suave (fade + scale)

---

## Responsive breakpoints

```
Mobile:  < 640px   (sm)  — 1 columna, formulario full width
Tablet:  640-1024px (md) — 2 columnas donde aplique
Desktop: > 1024px  (lg)  — max-width 900px centrado
```

### Reglas mobile-first:
1. **Formulario:** Inputs full width, cards grid 2 columnas
2. **Resultado:** Texto 15px, secciones sin colapsar (scroll natural)
3. **Landing:** Hero centrado, cards apiladas
4. **Navbar:** Logo + hamburguesa, menú lateral
5. **Pricing:** Cards apiladas verticalmente
6. **Touch targets:** Mínimo 44x44px en botones y seleccionables

---

## Accesibilidad — OBLIGATORIO

Esta app es de educación inclusiva. **DEBE** ser accesible. No es opcional.

### Requisitos:
1. **Contraste WCAG AA:** ratio mínimo 4.5:1 para texto normal, 3:1 para texto grande
   - Texto sobre fondo blanco: usar `#1a2332` (ratio 13.7:1 ✓)
   - Texto light sobre fondo blanco: usar `#64748b` (ratio 4.8:1 ✓)
   - Texto blanco sobre primary `#1e3a5f`: ratio 8.9:1 ✓
   - Texto blanco sobre accent `#16a34a`: ratio 3.4:1 — usar `#FFFFFF` bold ✓

2. **Labels:** Todo input tiene `<label>` asociado con `htmlFor`

3. **Aria-labels:** Botones con solo íconos tienen `aria-label`
   ```html
   <button aria-label="Copiar al portapapeles">📋</button>
   <button aria-label="Marcar como favorita">⭐</button>
   ```

4. **Focus visible:** Todos los elementos interactivos muestran focus ring
   ```css
   .focus-visible:outline-2 .outline-primary .outline-offset-2
   ```

5. **Keyboard navigation:** Todo el formulario navegable con Tab

6. **Screen readers:** 
   - Progreso del formulario anunciado: `aria-live="polite"`
   - Streaming de la guía: `aria-live="polite"` en el contenedor
   - Errores anunciados: `role="alert"`

7. **Skip link:** Link "Ir al contenido principal" visible solo con focus

8. **Motion:** Respetar `prefers-reduced-motion`
   ```css
   @media (prefers-reduced-motion: reduce) {
     * { animation: none !important; transition: none !important; }
   }
   ```

---

## Animaciones

### Streaming de texto:
- Cursor parpadeante `|` al final del texto mientras carga
- Texto aparece progresivamente (como ChatGPT)
- Sin animación letra-a-letra (es lento) — mostrar chunks del stream

### Transiciones:
- Hover en botones/cards: `transition: all 0.15s ease`
- Modales: `fade-in 0.2s + scale de 0.95 a 1`
- Toasts: slide desde arriba + fade

### Loading states:
- Botón "Generar guía": spinner + "Generando tu guía inclusiva..."
- Historial: skeleton cards (3 rectangulares grises animados)
- Perfil: skeleton lines

---

## Íconos

Usar emojis para las secciones de la guía (son universales y no requieren librería):
- 📚 Contenidos
- 🎯 Estrategias
- 🧰 Materiales
- 📝 Evaluación
- 💬 Comunicación
- ⚠️ Qué evitar
- 🤝 Coordinación
- 🔄 Estrategias unificadas

Para UI general: Lucide React (ya viene con shadcn/ui)

---

## Print styles

```css
@media print {
  nav, .no-print, button, .feedback { display: none; }
  body { font-size: 12pt; color: black; }
  .guia-resultado { box-shadow: none; border: none; }
}
```

El docente debe poder imprimir la guía directamente desde el navegador con `window.print()` y obtener un documento limpio.

---

## Tips del día (hardcodeados)

Array rotativo para mostrar en /inicio:

```typescript
export const TIPS_INCLUSIVOS = [
  { texto: "El DUA no es solo para alumnos con discapacidad — beneficia a TODOS los estudiantes del aula.", fuente: "CAST, 2018" },
  { texto: "Una adecuación curricular no es 'bajar el nivel'. Es ofrecer otro camino para llegar al mismo aprendizaje.", fuente: "Res. CFE 311/16" },
  { texto: "Antes de adaptar un material, preguntate: ¿hay alguna barrera que puedo eliminar para que TODOS accedan?", fuente: "DUA" },
  { texto: "El mejor recurso inclusivo no es un material — es el vínculo de confianza entre docente y alumno.", fuente: "" },
  { texto: "Incluir no es sentar al alumno al fondo con una actividad diferente. Es diseñar una clase donde todos participen.", fuente: "" },
  { texto: "Las rutinas predecibles benefician a alumnos con TEA, pero también reducen la ansiedad de todo el grupo.", fuente: "" },
  { texto: "Evaluar de forma diferenciada no es injusto — injusto es evaluar a todos igual cuando aprenden diferente.", fuente: "" },
  { texto: "Un alumno con discapacidad no es un problema a resolver. Es un estudiante con derecho a aprender.", fuente: "Convención ONU" },
  { texto: "Las familias son aliadas, no obstáculos. Involucralas en el proceso de aprendizaje de su hijo/a.", fuente: "" },
  { texto: "Si no sabés por dónde empezar, empezá por preguntar: ¿qué SÍ puede hacer este alumno?", fuente: "" },
]
```

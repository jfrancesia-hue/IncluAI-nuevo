# PROMPTS PARA GOOGLE STITCH — IncluIA
## Generar el diseño UI completo de la aplicación
## Usar en stitch.withgoogle.com

---

## INSTRUCCIONES DE USO

1. Abrí https://stitch.withgoogle.com
2. Creá un nuevo proyecto
3. Antes de generar, configurá el DESIGN.md (ver abajo)
4. Generá cada grupo de pantallas con su prompt
5. Usá el modo "Thinking" (Gemini 2.5 Pro) para mejor calidad
6. Después de generar, usá "Instant Prototype" para conectar las pantallas

---

## DESIGN.md (Pegar en la configuración de Design System de Stitch)

```
# IncluIA Design System

## Brand
- Name: IncluIA
- Tagline: "Planificá clases inclusivas en minutos"
- Tone: Professional, trustworthy, warm, accessible
- Industry: EdTech / Education / SaaS
- Target: Teachers in Argentina (mobile-heavy users)

## Colors
- Primary: #1e3a5f (dark institutional blue)
- Primary Light: #2a5a8f
- Primary Background: #e8f0fe
- Accent: #16a34a (green — inclusion)
- Accent Light: #dcfce7
- Orange CTA: #ea580c
- Background: #f5f7fa
- Card: #ffffff
- Text: #1a2332
- Text Light: #64748b
- Border: #e2e8f0

## Typography
- Display/Headings: Fraunces (serif, bold/extrabold)
- Body: DM Sans (sans-serif)
- Never use Inter, Roboto, or Arial

## Style
- Border radius: 12-16px for cards, 10px for inputs/buttons
- Shadows: soft, subtle (0 2px 12px rgba(0,0,0,0.04))
- Spacing: generous, clean
- Icons: emoji-based for categories (🧠🧩👂♿📖⚡)
- Mobile-first responsive design
- WCAG AA contrast compliance

## Mood
- NOT generic SaaS
- NOT dark mode
- Think: government education portal meets modern SaaS
- Professional enough for a Ministry, warm enough for a teacher
- Clean, structured, confidence-inspiring
```

---

## PROMPT 1 — Landing Page (Hero + Features)

```
Design a landing page for "IncluIA", an AI-powered SaaS platform that helps teachers in Argentina plan inclusive classes for students with disabilities.

The landing page needs these sections:

HERO SECTION:
- Dark gradient background (deep navy #1e3a5f to dark teal)
- Subtle dot pattern overlay on the background
- Top navbar: logo "🧩 IncluIA" on the left, "Iniciar sesión" button on the right
- Green badge above the title: "🇦🇷 Para docentes de toda Argentina"
- Main headline in serif font (Fraunces): "Planificá clases inclusivas en minutos"
- Subtitle: "Inteligencia artificial especializada en educación inclusiva. Guías concretas y personalizadas para cada alumno, cada discapacidad, cada contenido."
- Large green CTA button: "Crear mi primera guía — gratis"
- Small text below CTA: "2 guías gratuitas por mes · Sin tarjeta de crédito"

HOW IT WORKS SECTION:
- White background
- Title: "Así de simple funciona"
- 3 cards in a row with:
  - Card 1: "PASO 01" label, 📝 icon, "Completá el formulario", description about entering level, subject and disability
  - Card 2: "PASO 02" label, 🤖 icon, "La IA genera tu guía", description about receiving concrete strategies
  - Card 3: "PASO 03" label, 🎯 icon, "Aplicalo en el aula", description about implementing next day

DISABILITIES GRID SECTION:
- Light blue background (#e8f0fe)
- Title: "Guías para todas las discapacidades"
- Grid of 12 small cards with emoji icons and labels:
  🧠 Discapacidad Intelectual, 🧩 TEA (Autismo), 👂 Hipoacusia/Sordera,
  👁️ Discapacidad Visual, ♿ Discapacidad Motriz, 💬 Trast. del Lenguaje,
  📖 Dislexia, ⚡ TDAH, 🔢 Discalculia, ✏️ Disgrafía,
  💛 Trast. Emocional, 🤝 Multidiscapacidad

PRICING SECTION:
- White background
- Title: "Planes"
- 2 cards side by side:
  - FREE card: "$0", "Gratuito", features list with green checkmarks (2 guías/mes, todos los niveles, todas las discapacidades), outlined button "Empezar gratis"
  - PRO card: dark blue background (#1e3a5f), orange badge "Más elegido", "$9.900/mes", "Profesional", features list (40 guías/mes, historial, exportar PDF, favoritos, soporte), green solid button "Suscribirme con Mercado Pago"

FOOTER:
- Simple centered text: "IncluIA — Hecho en Argentina 🇦🇷"

The design should feel professional and trustworthy — like a government education tool but with modern SaaS aesthetics. Mobile responsive. Spanish language throughout.
```

---

## PROMPT 2 — Auth Screens (Login + Registro)

```
Design 2 authentication screens for "IncluIA", an education SaaS for Argentine teachers.

SCREEN 1 — LOGIN:
- Clean centered card on light gray background (#f5f7fa)
- Logo at top: "🧩 IncluIA" in serif font
- Title: "Iniciá sesión"
- Email input with label
- Password input with label and show/hide toggle
- Green primary button: "Ingresar"
- Divider line with "o"
- Secondary button: "Ingresar con link mágico"
- Bottom text: "¿No tenés cuenta?" with link "Registrate"
- Clean, minimal, professional

SCREEN 2 — REGISTRO:
- Same centered card style
- Logo at top: "🧩 IncluIA"
- Title: "Creá tu cuenta gratuita"
- Subtitle: "2 guías inclusivas por mes, sin costo"
- Form fields in 2 columns where possible:
  - Nombre (text input)
  - Apellido (text input)
  - Email (email input)
  - Contraseña (password input)
  - Institución educativa (text input)
  - Localidad (text input)
  - Provincia (dropdown with Argentine provinces)
- Green primary button: "Crear mi cuenta"
- Bottom text: "¿Ya tenés cuenta?" with link "Iniciá sesión"
- All labels in Spanish
- Mobile: fields stack to single column

Both screens should have the same visual style, feel institutional but modern.
```

---

## PROMPT 3 — Dashboard Home (Post-login)

```
Design the main dashboard home screen for "IncluIA", shown after a teacher logs in.

TOP NAVBAR (sticky):
- White background with subtle bottom border
- Left: "🧩 IncluIA" logo
- Right: gray badge "Gratuito" (or green "Pro ✓"), user avatar with name "María García ▾"

MAIN CONTENT (max-width 900px, centered):
- Greeting: "¡Hola, María!" in serif font, with subtitle "¿Qué vas a enseñar hoy?"

- LARGE CTA CARD:
  - Green gradient background
  - Icon or illustration
  - Title: "Nueva consulta"
  - Subtitle: "Generá una guía inclusiva para tu próxima clase"
  - White button: "Comenzar →"

- STATS ROW (3 small cards):
  - "Guías restantes: 1/2" with progress indicator
  - "Guías generadas: 7 total"
  - "Plan: Gratuito" with link "Ver planes"

- RECENT QUERIES SECTION:
  - Title: "Tus últimas consultas"
  - 3 cards showing recent queries, each with:
    - Emoji icons for disabilities
    - Subject and content text
    - Date
    - Click to view full guide
  - If no queries yet: empty state with illustration and "Todavía no generaste ninguna guía"

- TIP OF THE DAY:
  - Light blue card (#e8f0fe)
  - 💡 icon
  - Text: "El DUA no es solo para alumnos con discapacidad — beneficia a TODOS los estudiantes del aula."
  - Source: "CAST, 2018"

Mobile responsive. Content should stack vertically on small screens.
```

---

## PROMPT 4 — Formulario 3 Pasos

```
Design a 3-step form wizard for "IncluIA". This is the core user flow where teachers describe their class to get an AI-generated inclusive teaching guide.

All 3 steps share:
- Same navbar as dashboard
- Progress bar at top: 3 segments, green for completed/current, gray for pending
- Max width 640px centered
- Navigation buttons at bottom: "← Anterior" (secondary) + "Siguiente →" (primary green)

STEP 1 — "Contexto de tu clase":
- Title in serif: "Contexto de tu clase"
- Subtitle: "Contanos qué vas a enseñar y a qué nivel"
- Fields:
  - Nivel educativo: dropdown (Nivel Inicial, Primario, Secundario, Especial, etc.)
  - Ciclo/Subnivel: dropdown (appears after selecting nivel)
  - Año/Grado/Sala: dropdown (appears after selecting subnivel)
  - Materia: dropdown (changes based on selected nivel)
  - Contenido específico: textarea with placeholder "Ej: Fracciones equivalentes, La fotosíntesis, El cuento fantástico..."
- Completed fields show green border, incomplete show gray
- Helper text below contenido: "Cuanto más específico, mejor será la guía"

STEP 2 — "Discapacidad del alumno/a":
- Title: "Discapacidad del alumno/a"
- Subtitle: "Seleccioná una o más — la guía se adaptará a cada una"
- Grid of 12 selectable cards (4 columns desktop, 2 mobile):
  Each card has emoji icon + label. Multi-select behavior.
  Selected state: green border + green light background
  Normal: gray border + white background
  Cards: 🧠 Disc. Intelectual, 🧩 TEA, 👂 Hipoacusia, 👁️ Disc. Visual, ♿ Disc. Motriz, 💬 Trast. Lenguaje, 📖 Dislexia, ⚡ TDAH, 🔢 Discalculia, ✏️ Disgrafía, 💛 Trast. Emocional, 🤝 Multidiscapacidad
- Input number: "Cantidad de alumnos con discapacidad" (small input)
- Radio group "Situación de apoyo":
  ○ Maestra integradora / MAI
  ○ Acompañante terapéutico (AT)
  ○ Sin apoyo profesional
  ○ En proceso de diagnóstico

STEP 3 — "Contexto adicional":
- Title: "Contexto adicional"
- Subtitle: "Opcional pero recomendado — mejora mucho la calidad"
- Textarea: "Descripción de tu aula y situación" with placeholder
- Textarea: "Objetivo de la clase" with placeholder
- SUMMARY CARD (light blue background):
  - Title: "📋 Resumen de tu consulta"
  - Shows all data from steps 1-2 in a clean format
- Instead of "Siguiente →", final button is:
  Green gradient button with icon: "🧩 Generar guía inclusiva"

Mobile responsive. The disability cards grid should be 2 columns on mobile.
```

---

## PROMPT 5 — Resultado (Guía generada por IA)

```
Design the result screen for "IncluIA" showing an AI-generated inclusive teaching guide.

NAVBAR: Same as dashboard with "+ Nueva consulta" green button on right

SUMMARY BAR:
- Light blue bar below navbar
- Shows: 📚 Matemática · 📝 Fracciones equivalentes · 🧩 TEA · ♿ Discapacidad Motriz

MAIN CONTENT (max-width 740px):
- Large white card with subtle shadow and rounded corners
- The guide is divided into 7 sections, each with:
  - Section header in serif font with emoji and blue color:
    "1. 📚 Contenidos prioritarios y adecuación curricular"
  - Blue bottom border under header
  - Content with bullet points, bold keywords, concrete examples
  - Green left border on key strategies
  - 💡 Tip box at end of each section
  - Small clipboard icon button to copy that section

Show at least 2 full sections with realistic educational content about teaching fractions to a student with autism, written in Spanish.

ACTION BUTTONS (row below the guide):
- "📋 Copiar todo" (outlined)
- "🖨️ Imprimir" (outlined)
- "⭐ Guardar guía" (blue background)

FEEDBACK SECTION:
- Light orange card (#fff7ed)
- "¿Te fue útil esta guía?"
- 5 star buttons in a row
- Each star is a square button that scales on hover

The guide content should look rich and well-formatted, like a professional educational document. Not like a raw text dump.
```

---

## PROMPT 6 — Historial + Perfil + Planes

```
Design 3 screens for "IncluIA" SaaS dashboard:

SCREEN 1 — HISTORIAL (query history):
- Same dashboard navbar
- Title: "Tu historial de guías"
- Filter row: dropdowns for Nivel, Materia, Discapacidad, and date range
- List of cards, each showing:
  - Title (editable, e.g. "Fracciones para alumno con TEA")
  - Date: "12 de abril, 2026"
  - Tags: green pills for disability types (🧩 TEA, ♿ Motriz)
  - Subject and content preview
  - Star icon (favorite toggle) and trash icon
- Click on card expands to show full guide
- Empty state if no history: illustration + "Todavía no guardaste ninguna guía"
- If user is on free plan: show a subtle paywall overlay with "Upgrade a Pro para acceder al historial"

SCREEN 2 — PERFIL:
- Title: "Mi perfil"
- Card with editable fields: Nombre, Apellido, Institución, Localidad, Provincia
- "Guardar cambios" green button
- Separate card "Mi plan":
  - Current plan badge (Free or Pro)
  - If Pro: "Vence el 14 de mayo, 2026"
  - Stats: "7 guías generadas este mes", "1 guía restante"
  - Button "Cambiar plan" → links to /planes
- Separate card "Cerrar sesión" button (red outlined)

SCREEN 3 — PLANES (pricing page, in-app version):
- Title: "Elegí tu plan"
- Same 2-card layout as landing page pricing but inside the dashboard
- Free card and Pro card ($9.900/mes)
- Pro card CTA: "Suscribirme con Mercado Pago" (green button with MP logo)
- If already Pro: Pro card shows "Plan actual ✓" instead of button
- Below cards: "¿Tenés dudas? Escribinos a soporte@inclua.com.ar"

All screens share the same navbar. Mobile responsive.
```

---

## PROMPT 7 — Paywall Modal + Estados de carga

```
Design 3 overlay/modal states for "IncluIA":

MODAL 1 — PAYWALL:
- Dark semi-transparent overlay
- Centered white card with rounded corners
- Lock icon 🔒 at top
- Title: "Plan Gratuito"
- Text: "Usaste tus 2 guías gratuitas de este mes."
- Feature list of Pro plan with green checkmarks
- Price: "$9.900/mes"
- Two buttons: "Ver planes" (green primary) and "Cerrar" (gray text)
- Subtle entrance animation (fade + slight scale)

MODAL 2 — LOADING STATE (generating guide):
- Full page state (not modal)
- Centered content:
  - Animated spinner (green circle)
  - Title: "Generando tu guía inclusiva..."
  - Subtitle: "Esto puede tomar unos segundos"
  - The spinner should feel smooth and professional

MODAL 3 — PAYMENT SUCCESS:
- Full page celebration screen
- Confetti or sparkle visual effect at top
- Green checkmark icon
- Title: "¡Bienvenida al Plan Pro! 🎉"
- Text: "Tu suscripción está activa. Ahora podés generar hasta 40 guías por mes."
- Feature list with checkmarks
- Green button: "Crear mi primera guía Pro →"
- Small text: "Tu plan se renueva el [fecha]"

All in Spanish. Professional, warm, celebratory where appropriate.
```

---

## DESPUÉS DE GENERAR

### Conectar pantallas con Instant Prototype:
1. Landing → Login (click "Iniciar sesión")
2. Login → Dashboard Home (click "Ingresar")
3. Registro → Dashboard Home (click "Crear mi cuenta")
4. Dashboard → Step 1 (click "Comenzar")
5. Step 1 → Step 2 → Step 3 → Resultado
6. Resultado → Dashboard (click "Nueva consulta")
7. Dashboard → Historial, Perfil, Planes (navbar links)

### Exportar:
- Export HTML/CSS para referencia
- Export a Figma si necesitás ajustes finos
- Screenshots para documentación del proyecto

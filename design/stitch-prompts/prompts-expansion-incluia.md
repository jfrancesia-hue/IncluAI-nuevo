# PROMPTS STITCH — EXPANSIÓN INCLUIA (8 pantallas nuevas)

## Cómo usar
1. Abrí https://stitch.withgoogle.com
2. Usá el **mismo DESIGN.md** que ya tenés en `design/stitch-prompts/prompts-google-stitch-inclua.md`
3. Para cada prompt de acá: generá → aplicá **Redesign con NanoBanana Pro** → exportá ZIP
4. Mandame los ZIPs y alineo el código 1:1

---

## PROMPT 8 — Registro multi-tipo (Docente / Familia / Profesional)

```
Design a registration screen for "IncluIA" — a SaaS for Argentine teachers, families and healthcare professionals.

AT THE TOP of the form:
- Logo "🧩 IncluIA" (serif Fraunces)
- Title: "Creá tu cuenta gratuita"
- Subtitle: "2 guías inclusivas por mes, sin costo"

TYPE SELECTOR (3 radio-cards in a row):
- Card 1: 📚 "Soy docente" — "Planificar clases inclusivas"
- Card 2: 🏠 "Soy familia" — "Acompañar a mi hijo/a en casa"
- Card 3: ⚕️ "Soy profesional" — "Atención clínica adaptada"
Selected state: green border (#16a34a) + accent-light background (#dcfce7).
Unselected: gray border, white background.

CORE FIELDS (always visible):
- Nombre / Apellido (2 columns)
- Email
- Contraseña (8+ chars, with show/hide)

CONDITIONAL FIELDS (appear based on type):
- If Docente: "Institución educativa" input
- If Profesional: "Especialidad" dropdown (Psicólogo/a, Fonoaudiólogo/a, TO, Kinesiólogo/a, Pediatra, Neurólogo/a, Odontólogo/a, Nutricionista, TS, Psicopedagogo/a, MT, AT, otro)
- All: Localidad + Provincia (dropdown AR provincias)

CTA: Green button "Crear mi cuenta"
Bottom: "¿Ya tenés cuenta? Iniciá sesión" link.

Include a "Continuar con Google" button above the email field, with the official 4-color Google icon. Border: gray, white background.

Style: institutional-but-modern, same palette as existing IncluIA (navy #1e3a5f headings, green #16a34a accents, orange #ea580c CTA, Fraunces serif headings, DM Sans body). Mobile-first: the 3 type cards stack vertically on small screens.
```

---

## PROMPT 9 — Selector de módulo (post-login hero)

```
Design the top hero section of the IncluIA dashboard home page, AFTER a user logs in. Replace the single "Nueva consulta" card with a MODULE SELECTOR showing 3 large cards side-by-side.

LAYOUT:
- Greeting: "¡Hola, [nombre]!" in Fraunces serif (48px desktop)
- Subtitle: "¿Qué tipo de guía necesitás hoy?"

THE 3 MODULE CARDS:
Each card is a big tile (min 220px tall) with:
- Large emoji icon (48px)
- Title (serif, 22px): "Soy Docente" / "Soy Familia" / "Soy Profesional"
- Short description (14px, muted): 
  - Docente → "Guías para planificar clases inclusivas."
  - Familia → "Guías para acompañar a tu hijo/a en casa."
  - Profesional → "Guías clínicas para atender pacientes con discapacidad."
- "Ir al módulo →" link at the bottom

The card matching the user's registered type is HIGHLIGHTED (green border + accent-light bg #dcfce7). Others have gray border + white bg with hover state (border turns green on hover).

Layout: 3 columns on desktop, stacks to 1 column on mobile. Equal height cards.

BELOW THE SELECTOR:
- Stats row (3 small cards): "Guías restantes", "Guías este mes", "Tu plan"
- "Tus últimas consultas" section with 3 recent guides (each showing module icon 📚/🏠/⚕️ + materia/contenido + tags of discapacidades + date)
- "Tip del día" card with light-blue background and normativa citation

Same navbar as before (🧩 IncluIA logo left, badge of active module + avatar + theme toggle right). Mobile responsive.
```

---

## PROMPT 10 — Wizard Familia (3 pasos)

```
Design a 3-step form wizard for the "Familias" module of IncluIA. This is for parents/caregivers asking for guidance on raising their child with a disability.

TONE: warmer than the teacher module — more empathetic, conversational.

All 3 steps share:
- Same navbar as dashboard (with 🏠 Familia badge instead of 📚 Docente)
- Progress bar at top (3 segments, green for completed, gray for pending)
- Max width 680px centered
- Navigation buttons at bottom: "← Anterior" + "Siguiente →" (green primary)

STEP 1 — "Sobre tu hijo/a":
- Title serif: "Sobre tu hijo/a"
- Subtitle: "Contanos brevemente a quién apuntamos la guía."
- Fields:
  - Nombre del hijo/a (opcional, 1 column)
  - Edad (dropdown: 0-2 años, 3-5 años, 6-8, 9-12, 13-15, 16-18, 18+)
  - Discapacidad/es (same grid of 12 cards with emoji icons as the teacher module: 🧠 Disc. Intelectual, 🧩 TEA, 👂 Hipoacusia, 👁️ Disc. Visual, ♿ Disc. Motriz, 💬 Trast. Lenguaje, 📖 Dislexia, ⚡ TDAH, 🔢 Discalculia, ✏️ Disgrafía, 💛 Trast. Emocional, 🤝 Multidiscapacidad). Multi-select.
  - Detalle del diagnóstico (text input, optional): "Ej: TEA nivel 1 con apoyo / Síndrome de Down"

STEP 2 — "¿En qué necesitás ayuda?":
- Title: "¿En qué necesitás ayuda?"
- Subtitle: "Elegí una o más áreas y contanos la situación."
- Grid of 13 selectable cards (3 columns desktop, 2 mobile), each with emoji + label:
  🌅 Rutinas diarias, 🗣️ Comunicación en casa, 🌊 Conductas difíciles, 💪 Autonomía e independencia,
  👫 Socialización, 🎮 Estimulación y juego, 📖 Apoyo escolar, 💛 Emociones y regulación,
  🌙 Sueño, 🍽️ Alimentación, 🔄 Transiciones y cambios, 👨‍👩‍👧‍👦 Convivencia con hermanos,
  📋 Trámites y derechos
- Selected: green border + accent-light bg
- Textarea: "Situación específica" with placeholder "Ej: No duerme antes de las 12, hace berrinches muy intensos cuando le cambiamos la rutina…"

STEP 3 — "Contexto familiar":
- Title: "Contexto familiar"
- Dropdown: Situación familiar (Ambos padres / Monoparental / Familia ampliada / Otra)
- Checkbox: "¿Hace terapias actualmente?"
- If checked: text input for "Detalle de terapias" ("Ej: Fono 2 veces/semana, TO 1 vez")
- Textarea "Contexto adicional" (optional)

FINAL BUTTON: Green gradient with icon "🏠 Generar guía para la familia"

The overall feel: warm, approachable, not clinical. Same palette as the teacher module but perhaps add a subtle warm accent (the selected cards in Step 2 could have a slightly pinker tone while keeping within the green-accent system).
```

---

## PROMPT 11 — Wizard Profesional (3 pasos)

```
Design a 3-step form wizard for the "Profesionales" module of IncluIA — for psychologists, OT, speech therapists, dentists, pediatricians, etc.

TONE: professional, clinical but not cold — same palette as the rest.

All 3 steps share the same navbar (with ⚕️ Profesional badge), progress bar, and navigation as the other wizards.

STEP 1 — "Tu práctica profesional":
- Title serif: "Tu práctica profesional"
- Subtitle: "Contanos desde dónde vas a atender."
- Fields:
  - Especialidad (dropdown): 🧠 Psicólogo/a, 🗣️ Fonoaudiólogo/a, 🖐️ Terapeuta Ocupacional, 🏃 Kinesiólogo/a, 👨‍⚕️ Médico Pediatra, 🏥 Médico de Familia, ⚡ Neurólogo/a, 💊 Psiquiatra, 🦷 Odontólogo/a, 🥗 Nutricionista, 🤝 Trabajador/a Social, 📚 Psicopedagogo/a, 🎵 Musicoterapeuta, 🫂 Acompañante Terapéutico, 📋 Otra
  - Contexto de atención (dropdown): Primera consulta / Seguimiento / Evaluación / Intervención / Interconsulta / Atención domiciliaria
  - Lugar de atención (text input): "Ej: Consultorio privado / Hospital público / Domicilio"

STEP 2 — "Sobre el paciente":
- Title: "Sobre el paciente"
- Edad del paciente (dropdown: same 7 ranges as Familia)
- Discapacidad/es (same 12-card grid)
- Detalle diagnóstico (optional text)
- Nivel de comunicación del paciente (text input with placeholder): 'Ej: "Verbal" / "Verbal limitado" / "Usa CAA" / "No verbal"'

STEP 3 — "¿Qué necesitás?":
- Title: "¿Qué necesitás?"
- Grid of 8 objective cards (2 columns desktop):
  💬 Comunicación con el paciente
  🏥 Adaptación del espacio
  🌊 Manejo de conductas
  📋 Evaluación adaptada
  📝 Plan de tratamiento
  👨‍👩‍👧 Orientación a la familia
  🤝 Coordinación con equipo
  🧰 Materiales adaptados
- Each card: emoji + label (bold) + small description (muted)
- Selected: green border + accent-light
- Textarea: "Situación específica" with clinical placeholder
- Textarea: "Contexto adicional" (optional)

FINAL BUTTON: "⚕️ Generar guía clínica"

The feel: slightly more sober than Familias — clean, structured, something a clinician would trust.
```

---

## PROMPT 12 — Modo Rápido (Profesional)

```
Design a MINIMAL emergency screen for the IncluIA "Consulta rápida" feature — for healthcare professionals who have a patient in front of them and need orientation RIGHT NOW.

VISUAL PRIORITY: single-screen, no scroll, focus on 1 textarea + 1 button. Feel urgent but calm.

ELEMENTS:
- Navbar same as dashboard
- Badge at top: "⚡ Consulta rápida" in orange (bg-cta/10, text-cta #ea580c)
- Hero: "Respuesta en 10 segundos" (Fraunces serif, 40px)
- Subtitle: "Para cuando tenés al paciente en la silla y necesitás orientación AHORA. Escribí tu situación en una oración."

MAIN CARD (centered, max-width 700px):
- Label: "Tu situación en una oración"
- Large textarea (min 120px tall), monospace-adjacent font-size (16px), gentle border
- Placeholder: "Ej: Odontólogo, paciente TEA 6 años, primera consulta, padre refiere que no tolera jeringas. ¿Cómo empiezo?"
- Character counter "0 / 1500" below in muted gray
- Helper text: "cuanto más específico, mejor."

CTA: Big orange button (cta color) "⚡ Responder ahora" (h-12)

After clicking, the textarea area is replaced by the streaming guide view (reuse the guide viewer design).

Minimal, focused, NO other distractions. This is for a 10-second interaction.
```

---

## PROMPT 13 — Biblioteca de recursos (/recursos)

```
Design a RESOURCES LIBRARY page for IncluIA showing curated official Argentine resources (portals, laws, procedures, tools) filtered by public (teacher/family/professional) and type.

HEADER:
- Title serif: "Biblioteca de recursos"
- Subtitle: "Recursos oficiales y comunitarios de Argentina — portales, normativa, trámites y herramientas curadas por tipo de discapacidad y público."

FILTER BAR (two rows of chips):
Row 1 — Público:
  [Todos] [📚 Docentes] [🏠 Familias] [⚕️ Profesionales]
Row 2 — Tipo:
  [Todos] [🌐 Portales] [⚖️ Normativa] [📋 Trámites] [🧰 Herramientas]
Active chip: green border + accent-light bg. Inactive: gray border, hover effect.

COUNTER: "20 de 20 recursos" (muted text)

GRID of resource cards (2 columns desktop, 1 mobile):
Each card is a clickable link (opens in new tab) with:
- Title (Fraunces serif, 16px, bold, navy)
- Description (14px, 2-3 lines)
- Source/attribution (12px, muted, at bottom)
- Small external-link icon ↗ in the top-right corner
- Hover: border-accent

Examples of resources (use these real ones):
- "Educ.ar — Educación Inclusiva" (Ministerio)
- "ARASAAC — Pictogramas gratuitos" (13.000 símbolos)
- "ANDIS — Agencia Nacional de Discapacidad"
- "CUD — Cómo tramitarlo"
- "Ley 26.206 — Educación Nacional"
- "Resolución CFE 311/16"
- "Ley 24.901 — Prestaciones Básicas"
- "Convención sobre Derechos de PCD"
- "ASDRA — Síndrome de Down"
- "TGD-Padres TEA"
- "Confederación de Sordos Argentina"
- "Tiflonexos — textos accesibles"

Feel: institutional-library but warm. Cards with soft shadows. Mobile-first.
```

---

## PROMPT 14 — Trámite CUD paso-a-paso (/familias/cud)

```
Design a STEP-BY-STEP GUIDE page for families tramitando el Certificado Único de Discapacidad (CUD) in Argentina.

HEADER:
- Badge: "📋 Guía paso a paso" in green accent-light
- Title Fraunces serif: "Tramitar el CUD"
- Subtitle: "El Certificado Único de Discapacidad es la puerta de entrada a las prestaciones de la Ley 24.901. Es gratuito y se tramita en tu provincia."

SUMMARY CARD (at top, green accent-light bg):
- "💡 En resumen"
- Short 2-line summary: "Necesitás un informe médico reciente, pedir turno con la junta evaluadora de tu provincia, asistir a la evaluación y recibir el certificado. Todo es gratuito."

ORDERED LIST OF 7 STEPS:
Each step is a Card with:
- Large numbered circle (40px diameter, bg navy #1e3a5f, white text, Fraunces serif 18px bold) — numbers 1 through 7
- To the right of the circle:
  - Step title (Fraunces serif, 18px bold navy)
  - Step description (14px, 2-4 lines)
  - "Documentación" sub-box (light gray bg, small, with bullet list of required docs)
  - "💡 Tip:" highlighted box (primary-bg #e8f0fe background, primary #1e3a5f text) with practical tip

Step titles:
1. Reunir documentación médica
2. Identificar la junta evaluadora de tu provincia
3. Solicitar turno con la junta
4. Asistir a la evaluación interdisciplinaria
5. Recibir el resultado
6. Activar prestaciones
7. Otros derechos que se activan

FOOTER CARD — "Enlaces oficiales":
- ANDIS — Cómo tramitar el CUD →
- Buscar junta evaluadora por provincia →
- Ley 24.901 →

ACTION BUTTONS at bottom:
- Outlined: "Ver más recursos"
- Primary: "+ Generar guía familiar"

Feel: clear, empowering, not bureaucratic. Like a good government site that doesn't look like a government site. Mobile-friendly.
```

---

## PROMPT 15 — Onboarding modal (3 slides)

```
Design a WELCOME ONBOARDING MODAL that appears the first time a user lands on /inicio after signup.

LAYOUT:
- Dark semi-transparent overlay (50% black)
- Centered card (max-width 420px, rounded-14px, white bg, subtle shadow)
- Top-right: "Saltar" skip link (small, muted)
- Top-left: progress indicator "Paso X de 3"

CONTENT (centered):
- Large emoji icon (48-56px)
- Title in Fraunces serif (24-28px, navy)
- Short body paragraph (14px, muted)

3 SLIDES:
Slide 1:
  👋 "Bienvenido/a a IncluIA"
  "Una plataforma para docentes, familias y profesionales de salud que trabajan con personas con discapacidad en Argentina."

Slide 2:
  🧩 "Elegí tu rol"
  "Hay 3 módulos. Podés cambiar cuando quieras desde el inicio. Las guías se ajustan al idioma y realidad de cada uno."

Slide 3:
  ⚡ "Arrancá con plantillas"
  "Si es tu primera vez, probá una plantilla pre-cargada. 2 guías gratuitas por mes para explorar."

BOTTOM BAR:
- Left: 3 progress dots (active = green accent, inactive = gray border), each 24px wide
- Right: primary button "Siguiente →" (on last slide: "¡Empezar!")

Subtle entrance animation (fade + 4px slide up). WCAG AA contrast. Close on escape.
```

---

## DESPUÉS DE GENERAR

1. Exportar cada pantalla con "Export HTML/CSS" o ZIP directo desde Stitch.
2. Aplicar Redesign con **NanoBanana Pro** si hace falta refinar.
3. Comprimir en un único ZIP `stitch-expansion.zip` con la estructura:
   ```
   stitch-expansion/
   ├── registro_multi_tipo/screen.png
   ├── module_selector/screen.png
   ├── wizard_familia/screen.png
   ├── wizard_profesional/screen.png
   ├── consulta_rapida/screen.png
   ├── recursos_biblioteca/screen.png
   ├── cud_paso_a_paso/screen.png
   └── onboarding_modal/screen.png
   ```
4. Pasame la ruta del ZIP y hago el alineamiento 1:1 del código existente con los mockups finales.

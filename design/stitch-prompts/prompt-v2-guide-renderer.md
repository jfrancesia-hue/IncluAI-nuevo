# PROMPT STITCH V2 — Renderer de guía generada (IncluIA)

**Fecha:** 2026-04-20
**Objetivo:** Rediseñar la pantalla de resultado de guía pedagógica para que deje de parecer un muro de texto markdown y se sienta como un producto premium, ilustrativo y navegable.
**Referencia visual local:** `design/screens/guide-renderer-v2/mockup.html` (abrir en browser).

---

## DESIGN SYSTEM (pegá esto en Stitch Design Config)

```
# IncluIA — Guide Renderer v2

## Palette (role-based)
- Primary (inclusive green, success, progress): #15803d
- Primary Soft: #dcfce7
- Navy (titles, institutional weight): #1e3a5f
- Deep Ink (body text on dark): #0f2240
- Warm Accent (secondary CTA, urgency): #c2410c
- Warm Soft: #fef3c7
- Cream (page background): #fbf7f0
- Card White: #ffffff
- Alert Red: #b91c1c on #fef2f2

## Typography
- Display & section titles: Fraunces (serif, 500-800 weight, optical sizing)
- Body & UI: DM Sans (400-700)
- Never Inter / Roboto / Arial

## Style
- Corner radius: 22px hero cards · 16-18px content cards · 12px chips/buttons
- Shadows: soft 0 2px 12px rgba(15,34,64,.06) · card 0 6px 24px rgba(15,34,64,.08) · lift 0 12px 32px rgba(15,34,64,.12)
- Spacing: generous — 56-80px between sections, 24-32px inside cards
- Icons: CUSTOM SVG ONLY. Never emoji-as-icon. Flat 2-color strokes (leaf + navy), 2-2.5px stroke-width, rounded linecap.
- People illustrations: diverse (wheelchair user, cochlear implant, pictogram tablet), flat style, warm palette
- Mobile-first responsive, WCAG AA

## Mood
Notion meets Duolingo, reimagined by an Argentine pedagogical designer.
Professional enough for a Ministerio, warm enough for a teacher at 11 PM.
Each section must look DIFFERENT — no repeated card layouts.
```

---

## SCREEN PROMPT — Guide Result (primary)

```
Design a results screen for IncluIA — teachers in Argentina receive AI-generated inclusive teaching guides.

Context of this specific guide:
- Topic: "Fracciones equivalentes" (Equivalent fractions)
- Subject: Math, 4th grade primary
- Students with disabilities: Joaquín (ASD/TEA) + Valentina (motor disability)
- Teacher has NO integration support (sin MAI)
- 28 students total in classroom

LAYOUT — Two-column with sticky left sidebar (260px) + main content (max 900px).

SECTION 1 — Hero card (full-width, dark gradient navy #0f2240 → #0e4f68):
- Pill badges top-left: "Guía generada · hace 2 minutos" (green glass) + "Modelo: Claude Opus 4.7" (white glass)
- Huge Fraunces headline 54px: "Fracciones equivalentes" with "equivalentes" in light green #86efac
- Subtitle describing the 2 students by name
- Metadata chips in a row (glass border): "Matemática · 4° grado", "TEA", "Disc. motriz", "Lectura · 8 min", "Sin MAI · necesita más apoyos" (amber-tinted)
- Primary CTA: "Descargar PDF" (green #15803d, shadow-heavy), secondary white-glass "Copiar al portapapeles", tertiary amber "Refinar con IA" with sparkle icon
- RIGHT SIDE: Custom flat SVG illustration 520×360 of 4 diverse students + teacher around a classroom table with fraction strips on it. Include: one student in wheelchair (Valentina), one student with cochlear implant, one student holding a pictogram tablet (Joaquín), teacher with coffee. Palette matches brand. NO photo, custom illustration.

SIDEBAR (sticky, left):
- Small label "Contenido de la guía"
- Progress bar "28% leído"
- Vertical nav list with 7 items, each with a dot status (done=green, active=green with halo, pending=gray). Active item has green-soft background.
- Below: small card "¿Necesitás ajustar la guía?" with amber CTA "Refinar con IA"

SECTION 2 — "Contenidos prioritarios" (timeline):
- Number chip "01" on leaf-soft background
- Vertical dashed timeline with 4 nodes
- Each node: circled check icon + white card with "Prioridad N" label, Fraunces bold title, body text
- 4th node is a highlighted callout with amber border-left referencing legal framework (Res. CFE 311/16)

SECTION 3 — "Estrategias de enseñanza" (4 trading-card grid 2×2):
Each card has a UNIQUE illustrated header (160px tall) on a different tinted background:
  - Card 1 (green tint): pictogram agenda illustration with 4 colored squares + checkboxes
  - Card 2 (amber tint): blackboard with fraction strips showing 1/2 = 2/4 = 4/8 equivalence
  - Card 3 (blue-purple tint): analog clock with green progress arc + orange pause icon
  - Card 4 (red-soft tint): two kids with role labels "ARMADOR" and "NARRADOR" + bidirectional arrow
Each card: DUA tag badge top-left, Fraunces title, body text, footer with metadata (prep time, link to external resource).
After grid: "💡 Tip de docente" callout card (leaf-soft bg, green border-left, avatar icon with lightbulb).

SECTION 4 — "Materiales y recursos" (3-column cards):
Each card has a tinted illustrated header with a specific icon:
  - Card 1 (amber bg): printer/PDF icon — "Tiras de fracciones imprimibles", tags "Imprimible" + "Listo"
  - Card 2 (blue bg): cloud-download icon — "ARASAAC pictogramas", tag "Digital gratuito"
  - Card 3 (green bg): house icon — "Cartones de pizza cortados", tag "De la casa"
Each card: tag row, Fraunces title, description, "Descargar →" link in green.

SECTION 5 — "Evaluación diferenciada":
Side-by-side comparison:
  - LEFT (muted): "Evaluación tradicional" in white card, slate-colored circle bullets, text is de-emphasized
  - RIGHT (highlighted): "Evaluación adaptada" with leaf-soft bg, 2px leaf border, leaf-colored numbered list, small "Adaptada para TEA + motriz" ribbon badge at top
Below: "Mini rúbrica — Joaquín" card with 4 progress bars, each with criterion text left + score right (4/4 green, 3/4 green, 2/4 amber, "En progreso" slate).

SECTION 6 — "Comunicación y vínculo":
Two columns:
  - LEFT "✓ Sí decí" (leaf pill): 3 quote cards with leaf border-left, italic text, small metadata footer in leaf color
  - RIGHT "✗ Evitá" (red pill): 3 quote cards with red border-left, text in slate with red line-through decoration, metadata in red

SECTION 7 — "Qué evitar":
Single alert-style container with red-soft gradient bg (#fef2f2 → #fee2e2), red border.
Header row with red icon circle + Fraunces title "Errores comunes que parecen inclusivos pero no lo son".
Grid 2×2 of mistakes, each with red numbered circle (1-4) + bold red title + smaller red-muted description.

SECTION 8 — "Coordinación con otros actores" (stakeholder map):
Large white card containing an SVG diagram:
- Central large leaf-green circle labeled "ALUMNO/A · en el centro · Joaquín · Valentina"
- 4 satellite circles connected by dashed green lines:
  - Top-left (amber): FAMILIA · comunicación semanal
  - Top-right (blue): EOE · gestionar apoyos
  - Bottom-left (pink): EQUIPO DOCENTE
  - Bottom-right (green): ESPECIALISTAS · fonoaudiólogo, kinesiólogo
Below the diagram: 4 small cream cards (grid) with the concrete actions for each stakeholder (bullet lists of 3 items each).

SECTION 9 — Footer of the guide (dark gradient bg #1e3a5f → #0e4f68):
Two columns:
  - LEFT: Fraunces "¿Esta guía te sirvió?" + 5 interactive star ratings (large) + hint text
  - RIGHT: 3 stacked buttons — amber "Refinar guía · más actividades" / white-glass "Compartir con colegas" / outlined "Guardar en favoritas"
Below in small muted text: "Generado con Claude Opus 4.7 · Basado en Res. CFE 311/16 y Ley 26.206 · IncluIA no reemplaza el juicio profesional docente."

CRITICAL DESIGN PRINCIPLES:
1. Each section must feel visually distinct — different background tint, different component pattern, different illustration style.
2. NO emojis as primary icons. Use custom SVG illustrations with the brand palette.
3. Illustrations must represent diverse students (wheelchair, cochlear implant, pictogram device users) with dignity — never generic stock.
4. Typography hierarchy: Fraunces for all emotional/section titles, DM Sans for UI and body.
5. Corner radius should feel soft (16-22px) but not cartoonish.
6. Mobile: sidebar collapses to a top chip-bar with sections as horizontal scroll.
```

---

## PROMPT 2 — Sidebar collapsed mobile version

```
Same screen, mobile 390px wide.
- Hero card becomes single column, illustration goes above text.
- Sidebar becomes a horizontal sticky chip-bar right after breadcrumbs: 7 pill buttons in horizontal scroll, active one is leaf-filled, others are outlined. Progress bar below the chips ("28% leído").
- Timeline section: vertical dashed line collapses to left edge, cards stack full-width.
- Strategies grid 2×2 becomes 1-column stack.
- Stakeholder map SVG scales down and becomes scrollable-tappable, with accordion cards below for each actor's actions.
- Footer feedback becomes single-column.
```

---

## IMPLEMENTATION NOTES (para luego, cuando pasemos a React)

Cuando pasemos del mockup a React:

1. **Claude debe devolver JSON estructurado**, no markdown. Schema sugerido:

```ts
type Guide = {
  header: { topic: string; subject: string; grade: string; studentsChips: Chip[]; readTime: string }
  sections: Section[]
  legal: LegalRef[]
}

type Section =
  | { kind: 'timeline'; title: string; items: TimelineItem[] }
  | { kind: 'strategies'; title: string; strategies: Strategy[] }
  | { kind: 'resources'; title: string; resources: Resource[] }
  | { kind: 'evaluation'; title: string; traditional: string[]; adapted: AdaptedItem[]; rubric: RubricItem[] }
  | { kind: 'communication'; title: string; sayThis: Quote[]; avoid: Quote[] }
  | { kind: 'avoid'; title: string; warnings: Warning[] }
  | { kind: 'coordination'; title: string; stakeholders: Stakeholder[] }

type Strategy = { title: string; dua: 'representación'|'acción'|'motivación'|'colaboración'; disabilityTag: string; body: string; illustrationId: string; footer?: { prepTime?: string; resourceLink?: string } }
```

2. Cada `kind` se renderiza con un componente React dedicado (`<TimelineSection/>`, `<StrategiesGrid/>`, etc.) — nada de parsers de markdown.

3. Ilustraciones: vienen de un mapa `illustrationId → SVGComponent`. ~15 ilustraciones custom iniciales, todas en `components/illustrations/`. Ampliables on-demand con Gemini 2.5 Flash Image cacheadas en Supabase Storage por hash del prompt.

4. Animaciones GSAP: `useGSAP` + ScrollTrigger para stagger reveal de cada sección (skills `gsap-react` y `gsap-scrolltrigger` ya están disponibles).

5. Sidebar activa automáticamente por `IntersectionObserver` sobre cada `<section id>`.

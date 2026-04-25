# Design System — "Warm Premium"

Sistema de diseño probado en producción (IncluAI · 2026) listo para
copiar-pegar en proyectos Next.js 14+ / Tailwind v4.

## Filosofía

**"Wow sin ordinario"** — animaciones sutiles, tipografía cuidada,
paleta cálida con identidad, dark mode bien resuelto. Zero deps extras:
todo CSS + IntersectionObserver.

Referencias: Linear, Vercel, Stripe, Anthropic, Raycast.

## Qué incluye

| Capa | Qué da |
|------|--------|
| **Tokens semánticos CSS** | Variables para surface, texto, bordes, fondos. Todo adaptativo light/dark. |
| **Tipografía dual** | Inter (body) + Plus Jakarta Sans (display) con escala calibrada. |
| **Paleta cálida** | Gradient naranja como identidad + pills pastel por sección. |
| **Navbar "viva"** | Sticky con gradient, active state animado, mobile tabs. |
| **Fondo con carácter** | Gradient horizontal + dots pattern + glows sutiles. |
| **Bento cards** | Lift + shadow tintado + mesh al hover + border animado. |
| **Reveals on scroll** | IntersectionObserver wrapper con stagger. |
| **Magnetic buttons** | Lift + glow al hover para CTAs. |
| **Gradient text** | Acento en palabras clave sin saturar. |
| **Mesh gradients** | Orbes blur animados para heros. |
| **Dark mode** | Paleta negra neutral (estilo Vercel), overrides automáticos. |
| **Componentes genéricos** | PageShell, AuthShell, GlassCard, AnimatedNumber, Toaster. |

## Estructura de archivos

```
_design-system/
├── README.md            # Este archivo
├── SETUP.md             # Instalación en proyecto nuevo (15 min)
├── PATTERNS.md          # Patrones de uso con código de ejemplo
├── tokens.css           # CSS variables — copiar a globals.css
├── animations.css       # Keyframes + classes utility
├── components/
│   ├── branding/        # Logo, Wordmark, LogoLockup
│   ├── layout/          # PageShell, AuthShell, Navbar template
│   ├── ui/              # GlassCard, AnimatedNumber, Toaster
│   └── effects/         # RevealOnScroll, HeroHeadline, MarqueeItems
```

## Cómo empezar

1. Leé `SETUP.md` para instalación paso a paso
2. Leé `PATTERNS.md` para ver qué hace cada cosa con ejemplos
3. Adaptá la paleta en `tokens.css` a tu marca

## Stack requerido

- Next.js 14+ (App Router)
- Tailwind CSS v4
- `next/font/google`
- TypeScript
- Opcional: `sonner` para toasts, `next-themes` para dark mode

## Licencia / uso

Creado para el proyecto IncluAI pero escrito para ser reutilizable.
Usalo libremente en tus proyectos.

## Paleta de ejemplo (IncluAI)

- **Primary**: `#2E86C1` (azul esperanza)
- **Accent**: `#27AE60` (verde inclusión)
- **CTA / Navbar**: `#E67E22` → gradient `#fde68a → #f59e0b → #E67E22 → #fb923c`
- **Fondo**: gradient cream-peach `#fef9e0 → #fef3c7 → #fde68a → #fed7aa → #fef3c7`
- **Texto strong**: `#1F2E3D` / **Medium**: `#3d4a5a`

Todos estos valores son **variables CSS** — cambiá los hex en `tokens.css`
y la identidad cambia entera sin tocar componentes.

# Migración tipográfica IncluAI

## Objetivo

Reemplazar la fuente system-ui por **Inter** (cuerpo) + **Plus Jakarta Sans** (títulos/labels/badges) en toda la app.

## Configuración

### `app/layout.tsx`

Usar `next/font/google`:

```tsx
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta', display: 'swap' })
```

Aplicar en `<html className={`${inter.variable} ${jakarta.variable}`}>` y `<body className="font-sans antialiased">`.

Eliminar cualquier import previo de Google Fonts por CDN.

### `tailwind.config.ts`

```ts
fontFamily: {
  sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
  display: ['var(--font-jakarta)', 'var(--font-inter)', 'sans-serif'],
},
```

## Escala tipográfica

| Elemento | Tamaño | Peso | Fuente | line-height | letter-spacing |
|---|---|---|---|---|---|
| Hero título | 2rem | 800 | display | 1.2 | -0.03em |
| Sección título | 1.375rem | 700 | display | 1.3 | -0.02em |
| Paso título | 1.125rem | 600 | display | 1.3 | -0.02em |
| Cuerpo | 1rem (16px) | 400 | sans | 1.7 | -0.006em |
| Texto secundario | 0.875rem | 400 | sans | 1.6 | normal |
| Labels/badges | 0.75rem | 600 | display | 1 | 0.06em, uppercase |
| Captions | 0.8125rem | 400 | sans | 1.5 | normal |

## Dónde aplicar

Todos los componentes que renderizan la guía:

- **Hero**: título → `font-display font-extrabold tracking-[-0.03em]`, badge "GUÍA INCLUAI" → `font-display text-xs font-semibold tracking-[0.06em] uppercase`
- **"Lo esencial en 30 segundos"**: label → display uppercase, cuerpo → `text-base leading-[1.7]`
- **Títulos de sección**: `font-display text-[1.375rem] font-bold tracking-[-0.02em]`
- **StepCard**: número → `font-display text-[1.625rem] font-bold`, label "PASO" → `font-display text-[0.5625rem] tracking-[0.1em] uppercase`, título → `font-display text-lg font-semibold`, instrucciones → `text-sm leading-[1.65]`
- **Caja inclusiva**: label → `font-display font-semibold`, cuerpo → `text-[0.8125rem] leading-[1.6]`

## Selector de tamaño (A/A/A)

Ajustar la base según selección: pequeño 14px, medio 16px (default), grande 18px. Los ratios se mantienen relativos.

## Verificación

1. Variables `--font-inter` y `--font-jakarta` presentes en `<html>`
2. No quedan `fonts.googleapis.com` por CDN
3. Selector de tamaño y modo alto contraste siguen funcionando
4. Legible en mobile 375px

## Alcance

Solo UI de la guía. No tocar backend, API routes, DB, ni lógica de generación IA.

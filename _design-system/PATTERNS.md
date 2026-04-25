# Patrones de uso — con código real

Los patrones más usados y cómo aplicarlos.

## Cards con hover premium

Agregá la clase `bento-card` a cualquier `<article>`, `<div>` o `<Link>`:

```tsx
<article className="bento-card rounded-[20px] border border-[#e2e8f0] bg-white p-6">
  Contenido
</article>
```

Automáticamente tiene:
- Lift `translateY(-6px)` + `scale(1.012)` al hover
- Shadow tintado azul + verde al hover
- Mesh gradient pastel como background (azul top-left + verde bottom-right + warm center)
- Border gradient animado usando `mask-composite`
- Respeta `prefers-reduced-motion`

Para agregar también efecto spotlight cursor:

```tsx
<article className="bento-card spotlight-card ...">
```

## Botones "magnetic"

Para CTAs principales:

```tsx
<Link
  href="/accion"
  className="magnetic-btn inline-flex items-center gap-2 rounded-[14px] bg-[#27AE60] px-7 py-4 text-base font-bold text-white shadow-[0_8px_32px_rgba(39,174,96,0.45)]"
>
  Acción principal →
</Link>
```

Al hover: lift + scale 1.015 + glow pseudo-element.

## Gradient text

Para destacar palabras clave dentro de un headline:

```tsx
<h1 className="text-5xl font-bold">
  Cada usuario merece{' '}
  <span className="gradient-text">ser comprendido</span>
</h1>
```

Por defecto gradient verde→azul. Si querés cambiar, editá el `.gradient-text` en `animations.css`.

## Reveal on scroll con stagger

```tsx
import { RevealOnScroll } from '@/components/effects/RevealOnScroll';

<RevealOnScroll>
  <h2>Título</h2>
</RevealOnScroll>

<RevealOnScroll delay={60}>
  <p>Texto después</p>
</RevealOnScroll>

<RevealOnScroll delay={120}>
  <div>Imagen</div>
</RevealOnScroll>
```

Cada uno aparece secuencialmente al entrar al viewport.

Para listas:

```tsx
{items.map((item, i) => (
  <RevealOnScroll key={item.id} as="li" delay={Math.min(i * 60, 360)}>
    {item.content}
  </RevealOnScroll>
))}
```

## Hero con mesh gradient animado

```tsx
<section className="relative overflow-hidden">
  <div
    aria-hidden
    className="absolute inset-0"
    style={{
      background: 'linear-gradient(135deg, #061b34 0%, #0f2240 35%, #0e4f68 100%)',
    }}
  />
  <div
    aria-hidden
    className="absolute inset-0"
    style={{ filter: 'blur(80px)', opacity: 0.55 }}
  >
    <div style={{
      position: 'absolute', top: '-10%', left: '-5%',
      width: '50%', height: '60%',
      background: 'radial-gradient(circle, rgba(46,134,193,0.85), transparent 60%)',
      animation: 'mesh-orb-1 18s ease-in-out infinite',
    }} />
    <div style={{
      position: 'absolute', top: '20%', right: '-10%',
      width: '55%', height: '70%',
      background: 'radial-gradient(circle, rgba(39,174,96,0.7), transparent 60%)',
      animation: 'mesh-orb-2 22s ease-in-out infinite',
    }} />
  </div>
  <div className="relative p-16">
    {/* contenido encima del mesh */}
  </div>
</section>
```

## Headline animado con reveal por palabra

```tsx
import { HeroHeadline } from '@/components/effects/HeroHeadline';

<HeroHeadline
  words={[
    { text: 'Cada', accent: false },
    { text: 'usuario', accent: false },
    { text: 'merece', accent: false },
    { text: 'ser', accent: true },
    { text: 'visto', accent: true },
  ]}
/>
```

Cada palabra hace fade-up con stagger de 65ms.

## Bento grid asimétrico

```tsx
<div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-3 md:grid-rows-2">
  {/* Card grande 2 cols */}
  <article className="bento-card md:col-span-2 rounded-[20px] border p-7">
    Feature destacado
  </article>

  {/* 2 cards 1 col */}
  <article className="bento-card rounded-[20px] border p-6">...</article>
  <article className="bento-card rounded-[20px] border p-6">...</article>

  {/* Card grande 2 cols inferior */}
  <article className="bento-card md:col-span-2 rounded-[20px] border p-7">
    Segundo feature
  </article>
</div>
```

## PageShell (layout estandarizado)

```tsx
import { PageShell } from '@/components/layout/PageShell';

<PageShell
  eyebrow="📋 TU SECCIÓN"
  title={
    <>
      Título con <span className="gradient-text">acento</span>
    </>
  }
  subtitle="Descripción opcional"
  action={<Link href="/nuevo">+ Crear nuevo</Link>}
  decoration="mesh"  // 'mesh' | 'soft' | 'none'
  tone="docentes"    // 'docentes' | 'familias' | 'profesionales' | 'neutro'
>
  {/* Tu contenido */}
</PageShell>
```

## Counter animado

```tsx
import { AnimatedNumber } from '@/components/ui/AnimatedNumber';

<AnimatedNumber value={1234} suffix="+" duration={1400} />
```

Cuenta de 0 al valor target con ease-out cubic cuando entra al viewport.

## KPI dot con pulse

Para indicadores "en vivo":

```tsx
<span
  className="kpi-dot"
  style={{ background: '#27AE60' }}
/>
```

Expande y fadea infinitamente.

## Skeleton loading con shimmer

```tsx
<div className="skeleton h-6 w-48" />
<div className="skeleton h-32 w-full mt-3" />
```

Background gradient con shimmer animation automático.

## Form fields

```tsx
<div>
  <label className="field-label" htmlFor="email">Email</label>
  <input id="email" type="email" className="field-input" placeholder="tu@email.com" />
  <p className="field-help">Te mandamos un link de confirmación.</p>
</div>
```

Focus ring soft + hover border + transition.

## Navbar con active state

Ver `components/layout/Navbar.tsx` — viene listo con:
- Logo + wordmark (adaptá LogoLockup al tuyo)
- Links con active state (background pill + subrayado animado)
- Avatar + pill del usuario
- Toggle dark/light
- Mobile tabs debajo del header

Personalizá las rutas en el array `NAV_LINKS`.

## Auth pages 2 columnas

```tsx
import { AuthShell } from '@/components/layout/AuthShell';

<AuthShell
  asideTitle={<>Tu bienvenida</>}
  asideBullets={[
    'Beneficio 1',
    'Beneficio 2',
    'Beneficio 3',
  ]}
>
  <h1>Ingresá</h1>
  <form>...</form>
</AuthShell>
```

Lado izquierdo: form simple. Lado derecho: panel mesh gradient con bullets de valor.
Si pasás `fullWidth`, oculta el aside (para verificar-email etc).

## Dark mode — qué pasa automáticamente

Cuando el usuario cambia a dark:
- Fondo cambia a negro neutral (`#0a0a0a` con gradient sutil)
- Navbar cambia a naranja tierra (`#7c2d12 → #c2410c`)
- Todas las cards `.bento-card` con bg-white → surface elevated (`#1c1c1c`)
- Textos hardcoded `#1F2E3D` → blanco (via override CSS)
- Pills pastel → versiones translúcidas
- Borders claros → oscuros sutiles

**Lo que necesitás tocar tu: nada.** El sistema se adapta solo.

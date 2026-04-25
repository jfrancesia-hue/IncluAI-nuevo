# Setup en proyecto nuevo — 15 minutos

## 1. Proyecto base

Arrancás con Next.js 14+ App Router y Tailwind v4:

```bash
npx create-next-app@latest mi-proyecto --typescript --tailwind --app
cd mi-proyecto
```

## 2. Dependencias opcionales

Solo instalá las que vayas a usar:

```bash
# Toasts premium (sonner)
npm install sonner

# Dark mode (next-themes)
npm install next-themes
```

Zero otras deps — todo lo demás es CSS + IntersectionObserver.

## 3. Fuentes

Reemplazá `app/layout.tsx` para cargar Inter + Plus Jakarta Sans:

```tsx
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  variable: '--font-jakarta',
  subsets: ['latin'],
  display: 'swap',
});

export default function RootLayout({ children }) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${jakarta.variable} antialiased`}
    >
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
```

## 4. CSS base

Copiá el contenido de `tokens.css` y `animations.css` **al final** de tu
`app/globals.css`. Están pensados para vivir sobre el reset de Tailwind.

```css
/* app/globals.css */
@import "tailwindcss";

/* 👇 pegá acá tokens.css */
/* 👇 pegá acá animations.css */
```

## 5. Componentes

Copiá la carpeta `_design-system/components/` entera a `components/`
en tu proyecto. La estructura queda:

```
components/
├── branding/
│   ├── Logo.tsx
│   ├── Wordmark.tsx
│   └── LogoLockup.tsx
├── layout/
│   ├── PageShell.tsx
│   ├── AuthShell.tsx
│   └── Navbar.tsx
├── ui/
│   ├── GlassCard.tsx
│   ├── AnimatedNumber.tsx
│   └── Toaster.tsx
└── effects/
    ├── RevealOnScroll.tsx
    ├── HeroHeadline.tsx
    └── MarqueeItems.tsx
```

## 6. Personalizá la paleta

Abrí `globals.css` y **cambiá los valores hex** de estas variables en
`:root`:

```css
:root {
  /* Cambiá estos 4 para cambiar toda la identidad */
  --primary: #2E86C1;        /* Color principal */
  --accent: #27AE60;         /* Color de éxito/highlight */
  --cta: #E67E22;            /* Color de botones CTA */
  --navbar-bg-3: #E67E22;    /* Color del centro del navbar */
}
```

Los tokens semánticos (`--surface`, `--text-strong`, etc.) se adaptan
solos en dark mode.

## 7. Aplicá el layout

En tu `app/(app)/layout.tsx` o similar:

```tsx
import { Navbar } from '@/components/layout/Navbar';

export default function AppLayout({ children }) {
  return (
    <div className="relative min-h-screen">
      {/* Background gradient + dots + glows */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-20"
        style={{
          background:
            'linear-gradient(90deg, var(--dashboard-bg-1) 0%, var(--dashboard-bg-2) 30%, var(--dashboard-bg-3) 55%, var(--dashboard-bg-4) 80%, var(--dashboard-bg-5) 100%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 opacity-[0.35]"
        style={{
          backgroundImage:
            'radial-gradient(var(--dashboard-dots) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
      <Navbar />
      <main className="relative mx-auto w-full max-w-6xl px-4 pt-8 pb-24 sm:px-6">
        {children}
      </main>
    </div>
  );
}
```

## 8. Dark mode (opcional)

En `app/layout.tsx` envolvé con ThemeProvider de `next-themes`:

```tsx
import { ThemeProvider } from 'next-themes';

// dentro de <body>
<ThemeProvider attribute="class" defaultTheme="light" enableSystem>
  {children}
</ThemeProvider>
```

El CSS ya tiene la clase `.dark` con todos los tokens invertidos.

## 9. Toasts (opcional)

En `app/layout.tsx`:

```tsx
import { Toaster } from '@/components/ui/Toaster';

// dentro de <body>, después de children
<Toaster />
```

Después en cualquier componente client:

```tsx
import { toast } from 'sonner';

toast.success('Guardado');
toast.error('Algo salió mal');
```

## 10. Listo — probá la primera página

```tsx
import { PageShell } from '@/components/layout/PageShell';
import { RevealOnScroll } from '@/components/effects/RevealOnScroll';

export default function Page() {
  return (
    <PageShell
      eyebrow="📚 Tu sección"
      title={<>Bienvenida <span className="gradient-text">inclusiva</span></>}
      subtitle="Lo que sigue abajo usa el sistema entero."
      decoration="mesh"
    >
      <RevealOnScroll>
        <div className="bento-card rounded-[20px] border bg-white p-6">
          Card con hover mesh automático
        </div>
      </RevealOnScroll>
    </PageShell>
  );
}
```

Debería verse con hero mesh + headline gradient text + card que al hover
se levanta con glow azul-verde.

## Troubleshooting

**No aparecen los keyframes**: aseguráte de que `animations.css` está
DESPUÉS de `@import "tailwindcss"` en globals.css.

**Dark mode no cambia**: verificá que `ThemeProvider` tenga
`attribute="class"` y que `.dark` esté aplicado al `<html>`.

**Reveals no disparan**: el componente es client (`'use client'`). Si lo
estás importando desde server, no es problema — Next.js lo maneja.

**Fonts no cargan**: confirmá que las CSS vars `--font-inter` y
`--font-jakarta` están en el `<html>` className.

# 🎨 GUÍA VISUAL PARA CLAUDE CODE — IncluIA
## Pegar este archivo como contexto al trabajar en UI/UX
## Ubicación sugerida: `docs/GUIA-VISUAL.md`

---

## ⚡ REGLA MAESTRA

**IncluIA no es una app tech más. Es una herramienta humana para ayudar a niños y personas con discapacidad.**

Cada pixel tiene que transmitir: calidez, esperanza, claridad, accesibilidad.

Si tu código genera algo que se ve como un dashboard corporativo frío, estás haciéndolo mal. Si se ve como un libro educativo amigable que una maestra o un papá quieren usar, estás en el camino correcto.

---

## ❌ LO QUE CLAUDE CODE ESTÁ HACIENDO MAL (CORREGIR)

Cuando veas estos patrones en lo que escribiste, REHACELO:

- Botones chicos con texto pequeño → BOTONES GRANDES con ícono + texto claro
- Íconos minimalistas tipo Lucide gris → Íconos GRANDES a color, ilustrativos
- Sin imágenes, solo texto → SIEMPRE incluir fotos reales de niños y personas
- Formularios tipo "sheet" con inputs amontonados → Formularios ESPACIOSOS, guiados paso a paso
- Paleta fría (grises, azules corporativos) → Paleta CÁLIDA (verde esperanza, amarillo sol, azul cielo)
- Todo tipo Inter / sans-serif uniforme → Mezcla de FRAUNCES (títulos serif cálidos) + DM Sans (cuerpo)
- Diseño denso → MUCHO espacio en blanco, que respire
- Cards planas sin personalidad → Cards con bordes redondeados (16px+), sombras suaves, colores de acento

---

## ✅ LOS 10 MANDAMIENTOS VISUALES

### 1. BOTONES GRANDES Y CLAROS
Todos los botones principales tienen:
- Altura mínima: **56px** (no 40px como por defecto en shadcn)
- Padding horizontal: **24-32px**
- Font size: **16-18px** (no 14px)
- Border radius: **12px**
- Ícono a la izquierda del texto (tamaño 20-24px)
- Estado hover con shadow y ligera elevación

```tsx
// ❌ MAL
<button className="px-3 py-2 text-sm">Generar</button>

// ✅ BIEN
<button className="h-14 px-8 text-base font-semibold rounded-xl bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all flex items-center gap-3">
  <Sparkles className="w-6 h-6" />
  Generar mi guía inclusiva
</button>
```

### 2. ÍCONOS GRANDES E ILUSTRATIVOS
- NUNCA usar íconos menores a 20px en la UI principal
- Para categorías de discapacidad: íconos de **48-64px**
- Usar emojis cuando sea posible (son universales y coloridos): 🧠 🧩 👂 👁️ ♿ 💬 📖 ⚡ 🔢 ✏️ 💛 🤝
- Si usás Lucide: tamaño base 24px con `strokeWidth={2}` para que se vean robustos

### 3. IMÁGENES REALES SIEMPRE
En TODA pantalla principal debe haber al menos una imagen real:
- Landing: foto hero + foto en sección de discapacidades + foto de cierre
- Dashboard: ilustración cálida o foto pequeña de acompañamiento
- Formulario: banner pequeño en cada paso (docente con alumno, niño feliz, familia, etc.)
- Resultado: thumbnail pequeño del contexto
- Login/Registro: imagen cálida al inicio del card
- Éxito de pago: foto celebratoria

**Qué mostrar en las fotos:**
- Niños con discapacidad visible PARTICIPANDO ACTIVAMENTE (no aislados)
- Niños con Síndrome de Down sonriendo, jugando, aprendiendo
- Niños en sillas de ruedas interactuando con compañeros
- Niños con audífonos en situaciones cotidianas
- Docentes argentinas/latinas reales (diversas edades y cuerpos)
- Padres con sus hijos en momentos cotidianos (cocina, plaza, casa)
- Aulas reales latinoamericanas (no sterile stock)
- Luz natural, expresiones de alegría, conexión humana

**Qué NO mostrar:**
- ❌ Entornos clínicos, hospitales
- ❌ Niños aislados o con cara triste
- ❌ Stock photos de niños blancos rubios en aulas perfectas
- ❌ Adultos mirando desde arriba a los niños
- ❌ "Inspiration porn" (niños con discapacidad como objeto de inspiración)

**Fuentes de imágenes reales (gratis y libres de derechos):**
- Pexels.com (buscar "inclusive classroom", "special needs children", "Down syndrome")
- Unsplash.com (buscar "inclusive education", "children learning")
- Freepik (usar solo los gratuitos con atribución)

Si no encontrás fotos perfectas, usá ilustraciones cálidas tipo "Storyset" (storyset.com) — ilustraciones humanas diversas con estilo amigable.

### 4. COLORES CÁLIDOS DE ESPERANZA

Reemplazá la paleta actual con esta:

```css
/* tailwind.config.ts — extend colors */
colors: {
  /* Primarios — azul cielo de esperanza */
  sky: {
    DEFAULT: '#1a5276',    /* Azul cielo profundo */
    light: '#2980b9',      /* Azul cielo interactivo */
    soft: '#d6eaf8',       /* Azul cielo claro backgrounds */
  },
  /* Esperanza — verde crecimiento */
  hope: {
    DEFAULT: '#27ae60',    /* Verde esperanza — CTAs */
    light: '#a9dfbf',      /* Verde seleccionado */
    soft: '#eafaf1',       /* Verde fondo suave */
  },
  /* Sol — energía y alegría */
  sun: {
    DEFAULT: '#f39c12',    /* Amarillo sol */
    soft: '#fef9e7',       /* Amarillo tips */
  },
  /* Coral — alertas suaves */
  coral: {
    DEFAULT: '#e74c3c',
    soft: '#fadbd8',
  },
  /* Lavanda — neurodiversidad */
  lavender: {
    DEFAULT: '#8e44ad',
    soft: '#ebdef0',
  },
  /* Terracota — calidez argentina */
  terra: {
    DEFAULT: '#ca6f1e',
    soft: '#fdebd0',
  },
  /* Neutros cálidos */
  earth: '#2c3e50',        /* Texto principal */
  stone: '#7f8c8d',        /* Texto secundario */
  cloud: '#ecf0f1',        /* Bordes */
  mist: '#f8f9fa',         /* Background página */
}
```

**Regla 60-30-10:**
- 60% neutros cálidos (mist, white, cloud)
- 30% azul cielo + verde esperanza (confianza + crecimiento)
- 10% sol + lavanda + terracota (toques de alegría y diversidad)

### 5. TIPOGRAFÍA CON CARÁCTER

```tsx
// app/layout.tsx
import { Fraunces, DM_Sans } from 'next/font/google'

const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-display' })
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-body' })

<body className={`${fraunces.variable} ${dmSans.variable}`}>
```

**Uso:**
- `font-display` (Fraunces) → títulos grandes, headings h1-h2, nombre "IncluIA"
- `font-body` (DM Sans) → todo el resto

**Tamaños grandes:**
- Hero title: `text-4xl md:text-6xl` (era `text-2xl` → CHICO)
- Page title: `text-3xl md:text-4xl`
- Section heading: `text-2xl`
- Body: `text-base` (16px), NUNCA menos

### 6. FORMULARIOS PEDAGÓGICOS Y FÁCILES

#### Estructura de cada paso:
```
┌────────────────────────────────────────────┐
│ [Banner con foto cálida contextual]        │
├────────────────────────────────────────────┤
│                                            │
│ [Progress bar visual con 3 pasos]         │
│                                            │
│ # Título grande serif                      │
│ Subtítulo explicativo amable                │
│                                            │
│ 💡 Tip amarillo con consejo útil           │
│                                            │
│ ┌─────────────────────────────────────┐   │
│ │ Label grande                        │   │
│ │ [Input grande, altura 56px]         │   │
│ │ Texto helper gris                   │   │
│ └─────────────────────────────────────┘   │
│                                            │
│ [← Anterior]    [Siguiente ✨ →]          │
└────────────────────────────────────────────┘
```

#### Reglas de formularios:
- Un paso = una pantalla, no meter 10 campos juntos
- Cada input: label arriba (NO placeholder como label), altura mínima 56px, border 2px
- Cuando un campo se completa bien: border se pone verde + ícono ✓ aparece
- Cuando un campo tiene error: border coral + mensaje amable ("Uy, olvidaste completar esto")
- Radio buttons y checkboxes: al menos 24px de tamaño, con labels clickeables grandes
- Selects: flecha grande, opciones con buen padding

#### Multi-select de discapacidades (ejemplo crítico):
```tsx
// Grid grande, cards llamativas
<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
  {DISCAPACIDADES.map(d => (
    <button
      key={d.id}
      onClick={() => toggle(d.id)}
      className={`
        p-6 rounded-2xl border-2 transition-all
        flex flex-col items-center text-center gap-3
        ${isSelected(d.id) 
          ? 'border-hope bg-hope-soft shadow-lg scale-105' 
          : 'border-cloud bg-white hover:border-hope-light hover:shadow-md'}
      `}
    >
      <span className="text-5xl">{d.icon}</span>
      <span className="font-semibold text-earth">{d.label}</span>
      {isSelected(d.id) && <CheckCircle className="w-6 h-6 text-hope" />}
    </button>
  ))}
</div>
```

### 7. TARJETAS (CARDS) CON PERSONALIDAD

```tsx
// Card básica cálida
<div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow border border-cloud">
  {/* contenido */}
</div>

// Card con acento de color (para tips, destacados)
<div className="bg-sun-soft border-l-4 border-sun rounded-xl p-6">
  <div className="flex gap-4 items-start">
    <span className="text-3xl">💡</span>
    <div>
      <h4 className="font-display text-lg font-bold text-earth">Tip del día</h4>
      <p className="text-earth/80 mt-1">Incluir no es un extra, es el punto de partida.</p>
    </div>
  </div>
</div>
```

### 8. ESPACIADO GENEROSO

- Padding mínimo en cards: **24px** (p-6), ideal **32px** (p-8)
- Gap entre elementos en un formulario: **24px** (gap-6)
- Margen entre secciones: **64-96px** (my-16 md:my-24)
- Max-width de contenido principal: **896px** (max-w-4xl) para lectura cómoda

### 9. ANIMACIONES SUAVES

```tsx
// Usar framer-motion para entradas suaves
import { motion } from 'framer-motion'

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4, ease: 'easeOut' }}
>
  {contenido}
</motion.div>

// Transiciones de Tailwind en elementos interactivos
className="transition-all duration-200 ease-out hover:scale-[1.02]"
```

### 10. ACCESIBILIDAD — OBLIGATORIA

Esta app es de inclusión, ¡tiene que ser accesible!

- Contraste mínimo **4.5:1** en todo el texto
- Touch targets mínimo **48x48px** en mobile
- Focus rings visibles: `focus-visible:ring-2 focus-visible:ring-hope focus-visible:ring-offset-2`
- Todas las imágenes con `alt` descriptivo
- Todos los inputs con `<label htmlFor>` asociado
- Navegación con teclado funcional (Tab, Enter, Escape)
- Respetar `prefers-reduced-motion` para animaciones

---

## 📐 PLANTILLAS DE PANTALLA

### LANDING

```
┌─────────────────────────────────────────────────────────┐
│ [Navbar fijo: 🧩 IncluIA | Iniciar sesión]             │
├─────────────────────────────────────────────────────────┤
│                                                         │
│              🇦🇷 Para todo el ecosistema                │
│                                                         │
│         "Cada persona merece                            │
│         ser comprendida"                                │
│         (Fraunces 60px bold)                            │
│                                                         │
│    Inteligencia artificial especializada en            │
│    educación, crianza y atención inclusiva.            │
│                                                         │
│    [FOTO HERO GRANDE: docente + alumno en silla        │
│     de ruedas sonriendo con materiales educativos]     │
│                                                         │
│    [ 🌱 Empezar gratis ]    [ Ver cómo funciona ]     │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│          3 módulos, un ecosistema de inclusión         │
│                                                         │
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │
│   │     📚      │  │     🏠      │  │     ⚕️      │   │
│   │   Docentes  │  │   Familias  │  │ Profesionales│   │
│   │             │  │             │  │             │   │
│   │[foto aula]  │  │[foto hogar] │  │[foto consult]│   │
│   │             │  │             │  │             │   │
│   │ Guías para  │  │ Estrategias │  │ Protocolos  │   │
│   │ planificar  │  │ para casa   │  │ de atención │   │
│   │ clases      │  │             │  │ adaptada    │   │
│   └─────────────┘  └─────────────┘  └─────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### FORMULARIO (Ejemplo Paso 1 Docentes)

```
┌─────────────────────────────────────────────────────────┐
│ [Navbar: 🧩 IncluIA | Docente ▾ | María G. ▾]          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ [Progress: ●━━━○━━━○  Paso 1 de 3]                     │
│                                                         │
│ [FOTO BANNER: docente escribiendo en pizarrón]          │
│                                                         │
│ Contanos sobre tu clase                                 │
│ (Fraunces 32px bold)                                    │
│                                                         │
│ Empezamos por lo básico: ¿qué vas a enseñar?           │
│                                                         │
│ 💡 Cuanto más específico seas, mejor será tu guía      │
│                                                         │
│ Nivel educativo *                                       │
│ [▾ Seleccioná un nivel                              ]  │
│                                                         │
│ Materia o área *                                        │
│ [▾ Seleccioná una materia                           ]  │
│                                                         │
│ ¿Qué contenido vas a trabajar? *                        │
│ [                                                   ]   │
│ [  Ej: Fracciones equivalentes...                  ]   │
│ [                                                   ]   │
│ Escribí el tema específico de tu próxima clase         │
│                                                         │
│                              [Siguiente paso →]         │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### RESULTADO

```
┌─────────────────────────────────────────────────────────┐
│ [Navbar]                                   [+ Nueva]    │
├─────────────────────────────────────────────────────────┤
│ 📚 Matemática · 📝 Fracciones · 🧩 TEA · 4° grado      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ [FOTO PEQUEÑA: docente + alumno trabajando]             │
│                                                         │
│ ✨ Tu guía inclusiva está lista                         │
│                                                         │
│ ┌───────────────────────────────────────────────────┐  │
│ │ 📚 CONTENIDOS PRIORITARIOS                    📋  │  │
│ │ ═══════════════════════════════════════════════  │  │
│ │                                                   │  │
│ │ ┃ Priorizar conceptos de equivalencia            │  │
│ │ ┃ usando representaciones concretas              │  │
│ │                                                   │  │
│ │ ┌─ 💡 ─────────────────────────────────────────┐ │  │
│ │ │ Tip: Usá barras de Cuisenaire para que el    │ │  │
│ │ │ alumno pueda manipular las fracciones.       │ │  │
│ │ └───────────────────────────────────────────────┘ │  │
│ └───────────────────────────────────────────────────┘  │
│                                                         │
│ [ 📋 Copiar todo ]  [ 🖨️ Imprimir ]  [ 💾 Guardar ]   │
│                                                         │
│ ┌── ¿Te fue útil? ──────────────────────────────────┐  │
│ │       ⭐  ⭐  ⭐  ⭐  ⭐                          │  │
│ └────────────────────────────────────────────────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🖼️ GUÍA DE IMÁGENES POR PANTALLA

Para que Claude Code sepa exactamente qué tipo de imagen usar en cada pantalla:

| Pantalla | Imagen a usar | URL de búsqueda sugerida |
|----------|---------------|-------------------------|
| Landing Hero | Docente kneeling con alumno en silla de ruedas, sonriendo | pexels.com: "inclusive classroom wheelchair" |
| Landing Cards módulos | Foto por módulo: aula / hogar / consultorio | pexels.com + unsplash |
| Landing Cierre | Niño con Síndrome de Down orgulloso mostrando trabajo | pexels.com: "down syndrome child classroom" |
| Registro/Login | Diversidad de niños en aula (pequeña) | pexels.com: "diverse children school" |
| Dashboard | Ilustración cálida de manos trabajando juntas | storyset.com |
| Form Paso 1 (docente) | Docente en acción en pizarrón | pexels.com: "teacher classroom Latin" |
| Form Paso 2 (docente) | Niño con audífonos participando | pexels.com: "child hearing aid classroom" |
| Form Paso 3 (docente) | Docente planificando con laptop | pexels.com: "teacher planning" |
| Form Paso 1 (familia) | Familia cocinando juntos | pexels.com: "family kitchen special needs" |
| Form Paso 2 (familia) | Padre e hijo jugando | pexels.com: "parent child play home" |
| Form Paso 3 (familia) | Momento íntimo padre-hijo | pexels.com: "father son autism" |
| Form Paso 1 (profesional) | Profesional con herramientas | unsplash: "therapist office" |
| Form Paso 2 (profesional) | Profesional con paciente niño | pexels.com: "pediatrician child patient" |
| Resultado | Pequeña foto contextual al tema | variable según tema |
| Éxito de pago | Celebración grupo de niños diversos | pexels.com: "diverse children celebration" |
| Paywall | Foto cálida de conexión (no agresiva) | pexels.com: "teacher student bond" |

**Implementación técnica:**
- Usar `next/image` con `priority` en imágenes above-the-fold
- Formato WebP siempre
- Tamaños responsivos: `sizes="(max-width: 768px) 100vw, 50vw"`
- Con blur placeholder para mejor UX
- Alt text descriptivo REAL, no genérico

```tsx
import Image from 'next/image'

<Image
  src="/images/hero-classroom.webp"
  alt="Docente argentina arrodillada junto a alumno en silla de ruedas, ambos sonriendo mientras trabajan con materiales de matemática"
  width={1200}
  height={800}
  priority
  className="rounded-2xl shadow-xl"
/>
```

---

## 🎯 COMPONENTES CLAVE PARA REESCRIBIR

Estos son los componentes que según mi experiencia Claude Code tiende a hacer mal. Si ves que existen y se ven genéricos, REHACÉ siguiendo estas especificaciones:

### `<BotonPrimario>` — Componente reutilizable
```tsx
interface BotonPrimarioProps {
  children: React.ReactNode
  onClick?: () => void
  icon?: React.ReactNode
  loading?: boolean
  disabled?: boolean
  size?: 'md' | 'lg' | 'xl'
  variant?: 'hope' | 'sky' | 'sun' | 'coral'
}

export function BotonPrimario({ 
  children, icon, loading, size = 'lg', variant = 'hope', ...props 
}: BotonPrimarioProps) {
  const sizes = {
    md: 'h-12 px-6 text-sm',
    lg: 'h-14 px-8 text-base',
    xl: 'h-16 px-10 text-lg',
  }
  const variants = {
    hope: 'bg-hope hover:bg-hope-dark text-white shadow-hope/30',
    sky: 'bg-sky hover:bg-sky-light text-white shadow-sky/30',
    sun: 'bg-sun hover:bg-sun/90 text-earth shadow-sun/30',
    coral: 'bg-coral hover:bg-coral/90 text-white shadow-coral/30',
  }
  
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={`
        ${sizes[size]} ${variants[variant]}
        rounded-xl font-semibold
        inline-flex items-center justify-center gap-3
        shadow-lg hover:shadow-xl transition-all duration-200
        focus-visible:ring-4 focus-visible:ring-hope/30
        disabled:opacity-50 disabled:cursor-not-allowed
        active:scale-[0.98]
      `}
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : icon}
      {children}
    </button>
  )
}
```

### `<CardInclusiva>` — Card reutilizable
```tsx
export function CardInclusiva({ children, accent = 'cloud', className = '' }) {
  const accents = {
    cloud: 'border-cloud',
    hope: 'border-l-4 border-l-hope border-y border-r border-y-cloud border-r-cloud',
    sky: 'border-l-4 border-l-sky border-y border-r border-y-cloud border-r-cloud',
    sun: 'bg-sun-soft border-sun/30',
    lavender: 'bg-lavender-soft border-lavender/30',
  }
  
  return (
    <div className={`
      bg-white rounded-2xl p-6 md:p-8 
      border shadow-sm hover:shadow-md transition-shadow
      ${accents[accent]} ${className}
    `}>
      {children}
    </div>
  )
}
```

### `<BannerFoto>` — Imagen contextual con overlay
```tsx
export function BannerFoto({ src, alt, altura = 'md' }) {
  const alturas = {
    sm: 'h-32 md:h-40',
    md: 'h-48 md:h-64',
    lg: 'h-64 md:h-96',
  }
  
  return (
    <div className={`relative ${alturas[altura]} rounded-2xl overflow-hidden shadow-md`}>
      <Image 
        src={src} 
        alt={alt} 
        fill 
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 896px"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
    </div>
  )
}
```

---

## 🚨 CHECKLIST ANTES DE HACER COMMIT

Cada vez que termines una pantalla, verificá:

- [ ] ¿Tiene al menos 1 imagen real de personas?
- [ ] ¿Los botones principales son grandes (h-14 mínimo)?
- [ ] ¿Los íconos son visibles (20px+)?
- [ ] ¿Usé las fuentes Fraunces + DM Sans?
- [ ] ¿Los colores son cálidos (no azul corporativo frío)?
- [ ] ¿Hay espacio en blanco generoso?
- [ ] ¿Las cards tienen border-radius 16px+?
- [ ] ¿El formulario es claro y guía al usuario?
- [ ] ¿Funciona bien en mobile (probé en 375px)?
- [ ] ¿Es accesible (contraste, focus, labels, alt)?
- [ ] ¿Se siente CÁLIDO y HUMANO, no corporativo?

Si alguno falla, REHACÉLO antes de seguir.

---

## 💬 CUANDO LE PASES ESTO A CLAUDE CODE

Decile literalmente:

> "Antes de escribir código de UI, leé el archivo `docs/GUIA-VISUAL.md` y seguí estrictamente sus reglas. El proyecto IncluIA es una app de inclusión que tiene que verse CÁLIDA, PEDAGÓGICA y HUMANA — no como un dashboard corporativo. Usá botones e íconos GRANDES, fotos reales de niños y personas con discapacidad, paleta de colores de esperanza (verde, amarillo sol, azul cielo), tipografía Fraunces + DM Sans, espacios generosos, cards con personalidad. Si lo que estás por escribir se parece a un SaaS genérico, rehacélo. Si tenés dudas sobre un componente, preguntame antes de avanzar."

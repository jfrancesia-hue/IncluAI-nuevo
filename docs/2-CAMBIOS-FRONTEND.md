# CAMBIOS AL FRONTEND — IncluIA v2.1
## Archivo para Claude Code · Scope: componentes React + páginas + estilos
## NO modifica prompt ni lógica del agente (eso está en 1-CAMBIOS-AGENTE.md)

---

## OBJETIVO

Rediseñar la página de visualización de la guía pedagógica generada. En lugar de renderizar markdown plano, consumir el JSON estructurado del agente (schema v2.1) y renderizarlo como una **experiencia didáctica visual con imágenes reales y videos embebidos**.

---

## REFERENCIA VISUAL

El prototipo visual completo está en `guia-biomas-rediseñada.html` del proyecto. Este documento traduce ese prototipo a componentes React reutilizables.

---

## CAMBIO 1 · Estructura de componentes

### Árbol de componentes a crear

```
components/
└── guia/
    ├── GuiaLayout.tsx              ← contenedor principal
    ├── BarraAccesibilidad.tsx      ← fixed top con controles A/A+/contraste/imprimir
    ├── HeroGuia.tsx                ← cabecera con metadatos y título emocional
    ├── VistaRapida.tsx             ← callout destacado "lo esencial en 30 segundos"
    ├── SeccionConceptosClave.tsx   ← grid de 3 tarjetas ilustradas con imagen real
    ├── TarjetaConcepto.tsx         ← tarjeta individual con imagen Unsplash
    ├── SeccionEstrategias.tsx      ← lista de acordeones
    ├── EstrategiaAcordeon.tsx      ← details/summary con pasos numerados
    ├── SeccionVideos.tsx           ← grid de videos con embed/link
    ├── TarjetaVideo.tsx            ← thumbnail + play + link/embed
    ├── ModalVideo.tsx              ← iframe de YouTube al tocar video
    ├── SeccionMateriales.tsx       ← grid de materiales para hacer
    ├── TarjetaMaterial.tsx         ← card individual
    ├── GrillaEvaluacion.tsx        ← tabla interactiva con checks
    ├── TipsComunicacion.tsx        ← comparación verde/rojo
    ├── AlertaErrores.tsx           ← box de errores comunes
    └── CtaFeedback.tsx             ← CTA final de feedback

hooks/
└── guia/
    ├── useAccesibilidad.ts         ← estado de tamaño texto y contraste
    ├── useGrillaProgreso.ts        ← persistir checks en localStorage
    └── useImprimir.ts              ← trigger de print con estilos

app/
├── guia/[id]/
│   └── page.tsx                    ← página de la guía individual
└── globals.css                     ← variables CSS de la paleta
```

---

## CAMBIO 2 · Variables CSS globales

### Archivo: `app/globals.css`

Agregar las variables de la paleta de esperanza (ya definidas en DESIGN-V2.md):

```css
:root {
  /* Docentes */
  --color-docentes-primary: #185FA5;
  --color-docentes-light: #378ADD;
  --color-docentes-bg: #E6F1FB;
  --color-docentes-dark: #042C53;

  /* Biomas/conceptos específicos */
  --color-selva: #3B6D11;
  --color-selva-bg: #EAF3DE;
  --color-selva-dark: #173404;
  --color-desierto: #D85A30;
  --color-desierto-bg: #FAEEDA;
  --color-desierto-dark: #633806;
  --color-pampa: #EF9F27;
  --color-oceano: #378ADD;
  --color-montana: #888780;

  /* Familias/Profesionales (futuros módulos) */
  --color-familias-primary: #3B6D11;
  --color-profesionales-primary: #534AB7;

  /* Acentos */
  --color-sol: #FAC775;
  --color-terracota: #F0997B;
  --color-coral: #D85A30;

  /* Neutros */
  --color-papel: #F9F7F0;
  --color-papel-alt: #F1EFE8;
  --color-texto: #1F1F1D;
  --color-texto-medio: #5F5E5A;
  --color-borde: #E5E2D6;

  /* Semánticos */
  --color-exito: #1D9E75;
  --color-exito-bg: #E1F5EE;
  --color-alerta: #854F0B;
  --color-alerta-bg: #FAEEDA;

  /* Tipografía */
  --font-display: 'Fraunces', Georgia, serif;
  --font-body: 'DM Sans', -apple-system, sans-serif;

  /* Radios */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 20px;
  --radius-2xl: 24px;

  /* Sombras */
  --shadow-soft: 0 2px 12px rgba(0, 0, 0, 0.04);
  --shadow-medium: 0 4px 20px rgba(0, 0, 0, 0.08);
  --shadow-strong: 0 12px 32px rgba(0, 0, 0, 0.08);
}

body {
  font-family: var(--font-body);
  color: var(--color-texto);
  background: var(--color-papel);
  font-size: 18px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

/* Accesibilidad — tamaños de texto */
body.text-large { font-size: 20px; }
body.text-xlarge { font-size: 22px; }

/* Accesibilidad — alto contraste */
body.high-contrast {
  --color-papel: #FFFFFF;
  --color-texto: #000000;
  --color-texto-medio: #000000;
  --color-borde: #000000;
}
body.high-contrast * {
  border-width: 2px !important;
}
```

---

## CAMBIO 3 · Fuentes tipográficas

### Archivo: `app/layout.tsx`

Importar Fraunces (serif) + DM Sans (sans):

```tsx
import { Fraunces, DM_Sans } from "next/font/google";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600", "700"]
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "600", "700"]
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${fraunces.variable} ${dmSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

---

## CAMBIO 4 · Componentes de multimedia

### Componente para imagen real (Unsplash)

**Archivo**: `components/ui/ImagenInteligente.tsx`

```tsx
"use client";

import Image from "next/image";
import type { ImagenEnriquecida } from "@/lib/servicios/unsplash";

interface Props {
  imagen: ImagenEnriquecida;
  colorFallback?: string;
  aspectRatio?: string;
  prioridad?: boolean;
}

export function ImagenInteligente({
  imagen,
  colorFallback = "#E6F1FB",
  aspectRatio = "16 / 10",
  prioridad = false
}: Props) {
  // Si el enriquecimiento falló, mostramos fallback con gradiente
  if (!imagen.urls?.regular) {
    return (
      <div
        role="img"
        aria-label={imagen.alt}
        style={{
          width: "100%",
          aspectRatio,
          background: `linear-gradient(135deg, ${colorFallback}, rgba(0,0,0,0.1))`,
          borderRadius: "var(--radius-lg)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "rgba(0,0,0,0.3)",
          fontSize: "14px"
        }}
      >
        {imagen.alt}
      </div>
    );
  }

  return (
    <div style={{ position: "relative", width: "100%", aspectRatio, borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
      <Image
        src={imagen.urls.regular}
        alt={imagen.alt}
        fill
        sizes="(max-width: 720px) 100vw, 400px"
        style={{ objectFit: "cover" }}
        priority={prioridad}
      />
      {imagen.autor && (
        <a
          href={imagen.autor.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            position: "absolute",
            bottom: 6, right: 8,
            fontSize: 10,
            color: "white",
            background: "rgba(0,0,0,0.5)",
            padding: "2px 6px",
            borderRadius: 4,
            textDecoration: "none",
            opacity: 0.7
          }}
        >
          📷 {imagen.autor.nombre}
        </a>
      )}
    </div>
  );
}
```

### Componente para video (YouTube embebido)

**Archivo**: `components/ui/VideoInteligente.tsx`

```tsx
"use client";

import { useState } from "react";
import type { VideoEnriquecido } from "@/lib/servicios/videos";

interface Props {
  video: VideoEnriquecido;
}

const colorPorHint: Record<string, string> = {
  selva: "linear-gradient(135deg, #97C459, #3B6D11)",
  desierto: "linear-gradient(135deg, #EF9F27, #D85A30)",
  pampa: "linear-gradient(135deg, #FAC775, #97C459)",
  oceano: "linear-gradient(135deg, #85B7EB, #185FA5)",
  montana: "linear-gradient(135deg, #B4B2A9, #444441)",
  default: "linear-gradient(135deg, #534AB7, #D4537E)"
};

export function VideoInteligente({ video }: Props) {
  const [modalAbierto, setModalAbierto] = useState(false);
  const gradiente = colorPorHint[video.thumbnailHint] ?? colorPorHint.default;

  const handleAbrir = () => {
    if (video.urlEmbed) {
      setModalAbierto(true);
    } else {
      window.open(video.urlBusqueda, "_blank");
    }
  };

  return (
    <>
      <button
        onClick={handleAbrir}
        className="video-card"
        aria-label={`Ver video: ${video.titulo}`}
        style={{
          background: "white",
          border: "1px solid var(--color-borde)",
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
          cursor: "pointer",
          transition: "transform 0.2s, box-shadow 0.2s",
          padding: 0,
          fontFamily: "inherit",
          textAlign: "left",
          width: "100%"
        }}
      >
        <div style={{
          height: 140,
          background: video.thumbnail
            ? `url(${video.thumbnail}) center/cover`
            : gradiente,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <div style={{
            width: 56, height: 56,
            background: "rgba(255,255,255,0.95)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--color-docentes-primary)">
              <polygon points="5,3 19,12 5,21"/>
            </svg>
          </div>
          <div style={{
            position: "absolute",
            top: 10, right: 10,
            background: "rgba(0,0,0,0.65)",
            color: "white",
            padding: "3px 8px",
            borderRadius: 4,
            fontSize: 11,
            fontWeight: 600
          }}>
            {video.duracion}
          </div>
        </div>
        <div style={{ padding: 16 }}>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4, lineHeight: 1.3 }}>
            {video.titulo}
          </div>
          <div style={{ fontSize: 13, color: "var(--color-texto-medio)" }}>
            {video.fuente === "youtube" && "YouTube"}
            {video.fuente === "pakapaka" && "Pakapaka"}
            {video.fuente === "encuentro" && "Canal Encuentro"}
            {video.fuente === "educ_ar" && "Educ.ar"}
            {!video.verificado && " · Buscar"}
          </div>
        </div>
      </button>

      {modalAbierto && video.urlEmbed && (
        <ModalVideo
          url={video.urlEmbed}
          titulo={video.titulo}
          onClose={() => setModalAbierto(false)}
        />
      )}
    </>
  );
}

function ModalVideo({ url, titulo, onClose }: { url: string; titulo: string; onClose: () => void }) {
  return (
    <div
      role="dialog"
      aria-label={`Video: ${titulo}`}
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.85)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 900,
          aspectRatio: "16 / 9",
          background: "black",
          borderRadius: "var(--radius-lg)",
          overflow: "hidden"
        }}
      >
        <iframe
          src={`${url}?autoplay=1`}
          title={titulo}
          style={{ width: "100%", height: "100%", border: 0 }}
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
      </div>
      <button
        onClick={onClose}
        aria-label="Cerrar video"
        style={{
          position: "absolute",
          top: 20, right: 20,
          width: 44, height: 44,
          borderRadius: "50%",
          background: "white",
          border: "none",
          cursor: "pointer",
          fontSize: 20
        }}
      >
        ×
      </button>
    </div>
  );
}
```

---

## CAMBIO 5 · Página de guía actualizada

### Archivo a modificar: `app/guia/[id]/page.tsx`

```tsx
import { supabaseServer } from "@/lib/supabase/server";
import { GuiaPedagogicaSchema } from "@/lib/schemas/guia-schema";
import { GuiaLayout } from "@/components/guia/GuiaLayout";
import { notFound } from "next/navigation";

interface Props {
  params: { id: string };
}

export default async function GuiaPage({ params }: Props) {
  const { data, error } = await supabaseServer
    .from("consultas")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !data) notFound();

  // Si la consulta es v2.1, usar el renderer nuevo
  if (data.version_schema === "2.1" && data.respuesta_ia_estructurada) {
    const guia = GuiaPedagogicaSchema.parse(data.respuesta_ia_estructurada);
    return <GuiaLayout guia={guia} metadata={data.datos_modulo} />;
  }

  // Fallback a versión vieja (markdown)
  return <GuiaLegacyMarkdown markdown={data.respuesta_ia} />;
}
```

### Archivo a crear: `components/guia/GuiaLayout.tsx`

```tsx
"use client";

import { BarraAccesibilidad } from "./BarraAccesibilidad";
import { HeroGuia } from "./HeroGuia";
import { VistaRapida } from "./VistaRapida";
import { SeccionConceptosClave } from "./SeccionConceptosClave";
import { SeccionEstrategias } from "./SeccionEstrategias";
import { SeccionVideos } from "./SeccionVideos";
import { SeccionMateriales } from "./SeccionMateriales";
import { GrillaEvaluacion } from "./GrillaEvaluacion";
import { TipsComunicacion } from "./TipsComunicacion";
import { AlertaErrores } from "./AlertaErrores";
import { CtaFeedback } from "./CtaFeedback";
import type { GuiaPedagogica } from "@/lib/schemas/guia-schema";

interface Props {
  guia: GuiaPedagogica;
  metadata: any;
}

export function GuiaLayout({ guia, metadata }: Props) {
  return (
    <>
      <BarraAccesibilidad />

      <HeroGuia
        vistaRapida={guia.vistaRapida}
        metadata={metadata}
      />

      <main className="guia-container">
        <VistaRapida data={guia.vistaRapida} />

        <SeccionConceptosClave conceptos={guia.conceptosClave} />

        <SeccionEstrategias estrategias={guia.estrategias} />

        <SeccionVideos videos={guia.videos} />

        <SeccionMateriales materiales={guia.materiales} />

        <GrillaEvaluacion criterios={guia.criteriosEvaluacion} guiaId={metadata.id} />

        <TipsComunicacion tips={guia.tipsComunicacion} />

        <AlertaErrores errores={guia.erroresComunes} />

        <CtaFeedback guiaId={metadata.id} />
      </main>

      <style jsx>{`
        .guia-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 48px 32px 80px;
        }
        @media (max-width: 720px) {
          .guia-container { padding: 32px 20px 60px; }
        }
      `}</style>
    </>
  );
}
```

---

## CAMBIO 6 · Componentes de sección

### Componente: `TarjetaConcepto.tsx` (usa ImagenInteligente)

```tsx
import { ImagenInteligente } from "@/components/ui/ImagenInteligente";
import type { ConceptoClave } from "@/lib/schemas/guia-schema";

const coloresPorTipo: Record<string, { bg: string; texto: string; emoji: string }> = {
  selva: { bg: "var(--color-selva-bg)", texto: "var(--color-selva-dark)", emoji: "🌿" },
  desierto: { bg: "var(--color-desierto-bg)", texto: "var(--color-desierto-dark)", emoji: "🌵" },
  pampa: { bg: "#FFF8E8", texto: "#633806", emoji: "🌾" },
  oceano: { bg: "var(--color-docentes-bg)", texto: "var(--color-docentes-dark)", emoji: "🌊" },
  montana: { bg: "#F1EFE8", texto: "#2C2C2A", emoji: "⛰️" },
  neutro: { bg: "var(--color-papel-alt)", texto: "var(--color-texto)", emoji: "✦" }
};

export function TarjetaConcepto({ concepto }: { concepto: ConceptoClave }) {
  const estilo = coloresPorTipo[concepto.color] ?? coloresPorTipo.neutro;

  return (
    <article
      style={{
        background: "white",
        border: "1px solid var(--color-borde)",
        borderRadius: "var(--radius-xl)",
        overflow: "hidden",
        transition: "transform 0.2s, box-shadow 0.2s",
      }}
    >
      <ImagenInteligente
        imagen={concepto.imagen}
        colorFallback={estilo.bg}
        aspectRatio="4 / 3"
      />
      <div style={{ padding: 20 }}>
        <div style={{
          fontSize: 11,
          textTransform: "uppercase",
          letterSpacing: 0.8,
          fontWeight: 700,
          color: estilo.texto,
          marginBottom: 6
        }}>
          {estilo.emoji} {concepto.nombre.toUpperCase()}
        </div>
        <h3 style={{
          fontFamily: "var(--font-display)",
          fontSize: 22,
          fontWeight: 500,
          marginBottom: 8,
          color: estilo.texto
        }}>
          {concepto.nombre}
        </h3>
        <p style={{
          fontSize: 15,
          color: "var(--color-texto-medio)",
          lineHeight: 1.5
        }}>
          {concepto.descripcionCorta}
        </p>
      </div>
    </article>
  );
}
```

### Componente: `EstrategiaAcordeon.tsx`

```tsx
"use client";

import { useState } from "react";
import { ImagenInteligente } from "@/components/ui/ImagenInteligente";
import { VideoInteligente } from "@/components/ui/VideoInteligente";
import type { Estrategia } from "@/lib/schemas/guia-schema";

const iconosPorTipo: Record<string, string> = {
  manipulativa: "📦",
  visual: "🗺️",
  audiovisual: "▶️",
  producto: "📖",
  corporal: "🤸",
  social: "👥"
};

export function EstrategiaAcordeon({ estrategia, abiertaPorDefecto = false }: { estrategia: Estrategia; abiertaPorDefecto?: boolean }) {
  const [abierta, setAbierta] = useState(abiertaPorDefecto);

  return (
    <details
      open={abierta}
      onToggle={(e) => setAbierta((e.target as HTMLDetailsElement).open)}
      className="estrategia-acordeon"
    >
      <summary>
        <div className="estrategia-icon">{iconosPorTipo[estrategia.tipo] ?? "✦"}</div>
        <div className="estrategia-info">
          <div className="estrategia-num">Estrategia {estrategia.numero} · {estrategia.tipo}</div>
          <div className="estrategia-titulo">{estrategia.titulo}</div>
          <div className="estrategia-sub">{estrategia.subtitulo}</div>
        </div>
        <div className="estrategia-toggle" aria-hidden="true">+</div>
      </summary>

      <div className="estrategia-body">
        {estrategia.imagenApoyo && (
          <div style={{ marginBottom: 20 }}>
            <ImagenInteligente imagen={estrategia.imagenApoyo} aspectRatio="16 / 9" />
          </div>
        )}

        <ol className="pasos-lista">
          {estrategia.pasos.map((paso, i) => (
            <li key={i}>
              {paso.destacado ? (
                <>
                  {paso.texto.split(paso.destacado)[0]}
                  <strong>{paso.destacado}</strong>
                  {paso.texto.split(paso.destacado)[1]}
                </>
              ) : (
                paso.texto
              )}
            </li>
          ))}
        </ol>

        <aside className="funciona">
          <strong>Por qué funciona</strong>
          {estrategia.porQueFunciona}
        </aside>

        {estrategia.videoApoyo && (
          <div style={{ marginTop: 20 }}>
            <VideoInteligente video={estrategia.videoApoyo} />
          </div>
        )}
      </div>

      <style jsx>{`
        .estrategia-acordeon {
          background: white;
          border: 1px solid var(--color-borde);
          border-radius: var(--radius-xl);
          margin-bottom: 14px;
          overflow: hidden;
          transition: box-shadow 0.2s, border-color 0.2s;
        }
        .estrategia-acordeon[open] {
          border-color: var(--color-docentes-light);
          box-shadow: var(--shadow-medium);
        }
        summary {
          list-style: none;
          cursor: pointer;
          padding: 20px 24px;
          display: flex;
          align-items: center;
          gap: 20px;
          user-select: none;
          min-height: 44px;
        }
        summary::-webkit-details-marker { display: none; }
        .estrategia-icon {
          flex-shrink: 0;
          width: 56px; height: 56px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          background: var(--color-docentes-bg);
        }
        .estrategia-info { flex: 1; min-width: 0; }
        .estrategia-num {
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.6px;
          font-weight: 700;
          color: var(--color-docentes-primary);
          margin-bottom: 2px;
        }
        .estrategia-titulo {
          font-family: var(--font-display);
          font-size: 22px;
          font-weight: 500;
          line-height: 1.2;
          margin-bottom: 4px;
        }
        .estrategia-sub {
          font-size: 13px;
          color: var(--color-texto-medio);
        }
        .estrategia-toggle {
          flex-shrink: 0;
          width: 36px; height: 36px;
          border-radius: 50%;
          background: var(--color-docentes-bg);
          color: var(--color-docentes-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          font-weight: 700;
          transition: transform 0.25s;
        }
        details[open] .estrategia-toggle {
          transform: rotate(45deg);
          background: var(--color-docentes-primary);
          color: white;
        }
        .estrategia-body { padding: 0 24px 28px 100px; }
        @media (max-width: 720px) { .estrategia-body { padding: 0 24px 28px; } }
        .pasos-lista { list-style: none; counter-reset: paso; margin-bottom: 20px; padding: 0; }
        .pasos-lista li {
          counter-increment: paso;
          padding: 12px 0 12px 44px;
          position: relative;
          border-bottom: 1px dashed var(--color-borde);
          font-size: 16px;
          line-height: 1.55;
        }
        .pasos-lista li:last-child { border-bottom: none; }
        .pasos-lista li::before {
          content: counter(paso);
          position: absolute;
          left: 0; top: 10px;
          width: 30px; height: 30px;
          border-radius: 50%;
          background: var(--color-docentes-bg);
          color: var(--color-docentes-primary);
          font-weight: 700;
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .pasos-lista strong {
          background: linear-gradient(180deg, transparent 60%, var(--color-sol) 60%);
          font-weight: 600;
        }
        .funciona {
          background: var(--color-exito-bg);
          border-left: 4px solid var(--color-exito);
          padding: 16px 20px;
          border-radius: 0 12px 12px 0;
          font-size: 15px;
          line-height: 1.5;
          color: var(--color-selva-dark);
        }
        .funciona strong {
          color: var(--color-exito);
          display: block;
          margin-bottom: 4px;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.6px;
        }
      `}</style>
    </details>
  );
}
```

---

## CAMBIO 7 · Grilla de evaluación interactiva con persistencia

### Archivo: `hooks/guia/useGrillaProgreso.ts`

```tsx
"use client";
import { useEffect, useState } from "react";

export function useGrillaProgreso(guiaId: string) {
  const storageKey = `incluia-progreso-${guiaId}`;
  const [progreso, setProgreso] = useState<Record<number, string>>({});

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) setProgreso(JSON.parse(stored));
  }, [storageKey]);

  const marcar = (criterioIdx: number, nivel: string) => {
    const nuevo = { ...progreso, [criterioIdx]: nivel };
    setProgreso(nuevo);
    localStorage.setItem(storageKey, JSON.stringify(nuevo));
  };

  return { progreso, marcar };
}
```

### Archivo: `components/guia/GrillaEvaluacion.tsx`

```tsx
"use client";
import { useGrillaProgreso } from "@/hooks/guia/useGrillaProgreso";
import type { CriterioEvaluacion } from "@/lib/schemas/guia-schema";

export function GrillaEvaluacion({ criterios, guiaId }: { criterios: CriterioEvaluacion[]; guiaId: string }) {
  const { progreso, marcar } = useGrillaProgreso(guiaId);

  return (
    <section className="seccion-evaluacion">
      {/* cabecera y estructura similar al prototipo HTML */}
      {criterios.map((c, idx) => (
        <div className="grilla-row" key={idx}>
          <span>{c.criterio}</span>
          {["solo", "con_ayuda", "en_proceso"].map((nivel) => (
            <button
              key={nivel}
              onClick={() => marcar(idx, nivel)}
              className={`check-btn ${progreso[idx] === nivel ? "active" : ""}`}
              aria-label={`Marcar ${c.criterio} como ${nivel}`}
              style={{ minWidth: 44, minHeight: 44 }}
            >
              {progreso[idx] === nivel ? "✓" : ""}
            </button>
          ))}
        </div>
      ))}
    </section>
  );
}
```

---

## CAMBIO 8 · Barra de accesibilidad persistente

### Archivo: `hooks/guia/useAccesibilidad.ts`

```tsx
"use client";
import { useEffect, useState } from "react";

type Tamano = "normal" | "large" | "xlarge";

export function useAccesibilidad() {
  const [tamano, setTamano] = useState<Tamano>("normal");
  const [altoContraste, setAltoContraste] = useState(false);

  useEffect(() => {
    const t = localStorage.getItem("incluia-tamano") as Tamano | null;
    const c = localStorage.getItem("incluia-contraste") === "true";
    if (t) setTamano(t);
    if (c) setAltoContraste(c);
  }, []);

  useEffect(() => {
    document.body.classList.remove("text-large", "text-xlarge");
    if (tamano === "large") document.body.classList.add("text-large");
    if (tamano === "xlarge") document.body.classList.add("text-xlarge");
    localStorage.setItem("incluia-tamano", tamano);
  }, [tamano]);

  useEffect(() => {
    document.body.classList.toggle("high-contrast", altoContraste);
    localStorage.setItem("incluia-contraste", String(altoContraste));
  }, [altoContraste]);

  return { tamano, setTamano, altoContraste, setAltoContraste };
}
```

---

## CAMBIO 9 · Estilos de impresión

### Agregar a `app/globals.css`

```css
@media print {
  .barra-accesibilidad,
  .cta-feedback,
  .videos-grid,
  .grilla-checks { display: none !important; }

  .estrategia-acordeon[open] .estrategia-body,
  .estrategia-acordeon .estrategia-body { display: block !important; }

  body { font-size: 13px; background: white; color: black; }

  .guia-container { max-width: 100%; padding: 0; }

  h1, h2, h3 { page-break-after: avoid; }
  .estrategia-acordeon { page-break-inside: avoid; }

  a { color: black; text-decoration: underline; }
  a[href]::after { content: " (" attr(href) ")"; font-size: 0.85em; }

  img { max-width: 100%; page-break-inside: avoid; }
}
```

---

## CAMBIO 10 · Optimización mobile

### Reglas específicas para mobile

Todos los componentes deben cumplir:

- **Botones y tappeables mínimos de 44x44 px** (estándar iOS/Android)
- **Texto mínimo 16px para inputs** (evita que iOS zoomee al hacer focus)
- **Márgenes laterales de 20px en containers** (para que el contenido no toque el borde)
- **Imágenes con `sizes="(max-width: 720px) 100vw, 400px"`** en next/image para cargar el tamaño correcto
- **Videos con aspect-ratio 16/9 nativo** y embed responsivo

---

## ORDEN DE IMPLEMENTACIÓN RECOMENDADO

1. Actualizar `app/globals.css` con variables CSS
2. Configurar fuentes en `app/layout.tsx`
3. Crear componentes `ImagenInteligente` y `VideoInteligente` base
4. Crear hooks de accesibilidad y progreso
5. Crear componentes de secciones en orden:
   - `HeroGuia`
   - `VistaRapida`
   - `TarjetaConcepto` y `SeccionConceptosClave`
   - `EstrategiaAcordeon` y `SeccionEstrategias`
   - `VideoInteligente` y `SeccionVideos`
   - `SeccionMateriales`
   - `GrillaEvaluacion`
   - `TipsComunicacion`
   - `AlertaErrores`
   - `CtaFeedback`
6. Ensamblar `GuiaLayout`
7. Actualizar `app/guia/[id]/page.tsx` con switch v1/v2.1
8. Agregar estilos de impresión
9. Testear en mobile real (iPhone y Android)
10. Testear con lector de pantalla (NVDA o VoiceOver)

---

## CRITERIOS DE ACEPTACIÓN DEL REDISEÑO

Antes de dar por terminado el rediseño, verificar:

### Visual
- [ ] Las imágenes reales de Unsplash se cargan correctamente
- [ ] Los videos se reproducen en modal al clickear
- [ ] Los acordeones se expanden y contraen suavemente
- [ ] La paleta de esperanza está presente en cada sección
- [ ] La tipografía respeta Fraunces en titulares y DM Sans en cuerpo

### Funcional
- [ ] La grilla de evaluación persiste los checks en localStorage
- [ ] La barra de accesibilidad cambia el tamaño de texto y el contraste
- [ ] El botón de imprimir produce un PDF limpio y legible
- [ ] El fallback a la versión vieja (markdown) funciona si la consulta es v1

### Accesibilidad
- [ ] Todos los botones tienen `aria-label` apropiados
- [ ] Los contrastes cumplen WCAG AA
- [ ] Funciona con navegación por teclado completa
- [ ] Las imágenes tienen alt text descriptivo en español
- [ ] Los videos tienen título accesible

### Performance
- [ ] La página carga en menos de 2 segundos en mobile 4G
- [ ] Las imágenes usan lazy loading (next/image)
- [ ] El bundle JS no supera los 200kb gzipped

### Mobile
- [ ] Todos los botones son mínimo 44x44 px
- [ ] El layout no se rompe en pantallas de 360px de ancho
- [ ] Los videos abren correctamente en el modal en iOS y Android

---

## RIESGOS Y MITIGACIONES

**Riesgo 1 — Unsplash tarda mucho o falla**
→ Mitigación: timeout de 3 segundos + fallback con gradiente de color del bioma

**Riesgo 2 — Videos de YouTube bloqueados por escuelas**
→ Mitigación: siempre incluir link directo a YouTube como backup al embed

**Riesgo 3 — localStorage lleno por muchas grillas**
→ Mitigación: limpiar grillas viejas automáticamente después de 90 días

**Riesgo 4 — Rendering lento por muchas imágenes**
→ Mitigación: lazy loading + priority solo en la primera imagen del hero

---

FIN DEL DOCUMENTO — CAMBIOS AL FRONTEND

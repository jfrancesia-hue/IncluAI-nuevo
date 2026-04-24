# CAMBIOS AL AGENTE — IncluIA v2.1
## Archivo para Claude Code · Scope: lib/prompts.ts + API routes + schemas
## NO modifica frontend ni UI

---

## OBJETIVO

Actualizar el agente de IA para que **devuelva datos estructurados enriquecidos con referencias a imágenes y videos reales**, en lugar de markdown plano. El frontend consume esa estructura y la renderiza visualmente (ese trabajo está en el documento separado de cambios web).

---

## CAMBIO 1 · Nuevo formato de salida estructurado

### Antes (estado actual)

El agente devuelve un bloque de markdown plano en el campo `respuesta_ia` de la tabla `consultas`. El frontend renderiza ese markdown tal cual con una librería tipo `react-markdown`.

### Después (estado objetivo)

El agente devuelve **un JSON estructurado** validado por Zod/TypeScript. El frontend lo consume y decide cómo renderizar cada sección.

### Nuevo archivo: `lib/schemas/guia-schema.ts`

```typescript
import { z } from "zod";

// ─────────────────────────────────────────────────────────
// TIPOS DE RECURSOS MULTIMEDIA
// ─────────────────────────────────────────────────────────

export const ImagenRefSchema = z.object({
  tipo: z.enum(["unsplash", "pexels", "banco_incluia", "wikimedia"]),
  query: z.string().describe("Query de búsqueda para la API de imágenes"),
  alt: z.string().describe("Descripción accesible de la imagen"),
  orientacion: z.enum(["horizontal", "vertical", "cuadrada"]).optional(),
  contextoEducativo: z.string().optional().describe("Por qué esta imagen es pedagógicamente útil")
});

export const VideoRefSchema = z.object({
  titulo: z.string(),
  duracion: z.string().describe("Formato: '3 min', '2-4 min'"),
  fuente: z.enum(["youtube", "pakapaka", "encuentro", "educ_ar"]),
  url: z.string().url().optional().describe("URL directa si se conoce, si no dejar vacío"),
  queryBusqueda: z.string().describe("Query para que el usuario busque el video"),
  embedId: z.string().optional().describe("ID de YouTube si se conoce, para iframe embed"),
  descripcion: z.string().describe("Qué muestra el video y por qué es útil"),
  thumbnailHint: z.string().describe("Color/bioma asociado para el thumbnail de fallback")
});

// ─────────────────────────────────────────────────────────
// ESTRUCTURA DE LA GUÍA PEDAGÓGICA
// ─────────────────────────────────────────────────────────

export const VistaRapidaSchema = z.object({
  titulo: z.string().max(80),
  resumen: z.string().max(280).describe("Lo esencial que el docente lee en 30 segundos")
});

export const ConceptoClaveSchema = z.object({
  nombre: z.string(),
  descripcionCorta: z.string().max(140),
  imagen: ImagenRefSchema,
  color: z.enum(["selva", "desierto", "pampa", "oceano", "montana", "neutro"]).describe("Paleta para el visual")
});

export const PasoEstrategiaSchema = z.object({
  texto: z.string(),
  destacado: z.string().optional().describe("Palabra o frase clave a resaltar")
});

export const EstrategiaSchema = z.object({
  numero: z.number().int().min(1).max(6),
  tipo: z.enum(["manipulativa", "visual", "audiovisual", "producto", "corporal", "social"]),
  titulo: z.string().max(60),
  subtitulo: z.string().max(100).describe("Tags tipo 'Material concreto · 30 min'"),
  pasos: z.array(PasoEstrategiaSchema).min(3).max(8),
  porQueFunciona: z.string().max(240),
  imagenApoyo: ImagenRefSchema.optional(),
  videoApoyo: VideoRefSchema.optional()
});

export const MaterialSchema = z.object({
  nombre: z.string().max(60),
  descripcion: z.string().max(200),
  tiempoPreparacion: z.string().describe("Ej: '20 minutos', '1 hora'"),
  imagenReferencia: ImagenRefSchema.optional()
});

export const CriterioEvaluacionSchema = z.object({
  criterio: z.string().max(120),
  nivelEsperado: z.enum(["inicial", "en_proceso", "consolidado"])
});

export const TipComunicacionSchema = z.object({
  usar: z.string(),
  evitar: z.string()
});

export const ErrorComunSchema = z.object({
  titulo: z.string().max(60),
  descripcion: z.string().max(220)
});

// ─────────────────────────────────────────────────────────
// GUÍA COMPLETA (RESPUESTA DEL AGENTE)
// ─────────────────────────────────────────────────────────

export const GuiaPedagogicaSchema = z.object({
  // Metadata
  version: z.literal("2.1"),
  generadaEn: z.string().datetime(),

  // Hero
  vistaRapida: VistaRapidaSchema,

  // 1. Conceptos clave del contenido (3 tarjetas ilustradas)
  conceptosClave: z.array(ConceptoClaveSchema).min(2).max(4),

  // 2. Estrategias de enseñanza
  estrategias: z.array(EstrategiaSchema).min(3).max(6),

  // 3. Videos recomendados
  videos: z.array(VideoRefSchema).min(2).max(6),

  // 4. Materiales para hacer
  materiales: z.array(MaterialSchema).min(2).max(5),

  // 5. Grilla de evaluación
  criteriosEvaluacion: z.array(CriterioEvaluacionSchema).min(4).max(8),

  // 6. Comunicación en el aula
  tipsComunicacion: z.array(TipComunicacionSchema).min(3).max(6),

  // 7. Errores a evitar
  erroresComunes: z.array(ErrorComunSchema).min(2).max(4),

  // Fuentes normativas citadas (para legitimidad)
  fuentesNormativas: z.array(z.string()).optional()
});

export type GuiaPedagogica = z.infer<typeof GuiaPedagogicaSchema>;
export type ImagenRef = z.infer<typeof ImagenRefSchema>;
export type VideoRef = z.infer<typeof VideoRefSchema>;
```

---

## CAMBIO 2 · System prompt enriquecido con reglas multimedia

### Archivo a modificar: `lib/prompts.ts`

Agregar al system prompt las nuevas secciones de reglas para generación de referencias multimedia.

### Nuevo bloque para el system prompt

```typescript
export const MULTIMEDIA_RULES = `
REGLAS PARA REFERENCIAS MULTIMEDIA

## IMÁGENES

Para cada concepto clave, estrategia que lo amerite, y material, generás un objeto ImagenRef con estos campos:

1. **tipo**: siempre "unsplash" por defecto (es el más confiable). Solo usás "pexels" si el concepto es muy específico de Latinoamérica y Unsplash no tiene buena cobertura. Nunca inventes URLs.

2. **query**: el query de búsqueda que el frontend va a usar contra la API de Unsplash. Reglas para escribir buenos queries:
   - Usar inglés (las APIs de stock están optimizadas en inglés)
   - Ser específico y visual, no conceptual
   - Incluir contexto educativo si aplica
   - Ejemplos:
     • Para "selva": "amazon rainforest tropical trees"
     • Para "desierto": "atacama desert cactus landscape"
     • Para "pampa": "argentine pampas grassland cattle"
     • Para actividad en aula: "children learning classroom inclusive"
     • Para material manipulativo: "educational cards colorful classroom"

3. **alt**: descripción accesible EN ESPAÑOL, concreta y sin adjetivos innecesarios.

4. **orientacion**: "horizontal" para hero y tarjetas, "cuadrada" para iconos de estrategias, "vertical" para testimonios o móvil.

5. **contextoEducativo**: una frase que explique al frontend por qué esta imagen es útil pedagógicamente (no se muestra al docente, es para logs y mejora).

## VIDEOS

Para cada video recomendado, generás un objeto VideoRef:

1. **fuente**: priorizá SIEMPRE en este orden:
   a) Canal Encuentro (educativo argentino oficial)
   b) Pakapaka (infantil argentino oficial)
   c) Educ.ar (portal educativo oficial)
   d) YouTube general (solo canales reconocidos como Nat Geo, BBC Earth, Khan Academy, UNICEF)

2. **url y embedId**: solo incluís URL o embedId si estás 100% seguro de que el video existe. Si no, dejás vacío y solo incluís queryBusqueda. NUNCA inventes URLs de YouTube — eso genera links rotos y destruye la confianza del docente.

3. **queryBusqueda**: el query exacto que el docente puede pegar en YouTube para encontrar el video.

4. **duracion**: nunca más de 5 minutos para educación especial primaria. Si un recurso dura 20 minutos, no lo recomiendes: recomendá fragmentar.

5. **thumbnailHint**: asociá con la paleta del contenido ("selva", "desierto", "pampa", etc.) para que el frontend pinte un fallback coherente si la imagen del video no carga.

## EJEMPLOS DE BUENAS REFERENCIAS

Ejemplo de imagen bien generada:
{
  "tipo": "unsplash",
  "query": "amazon rainforest canopy green trees",
  "alt": "Selva amazónica con árboles altos vista desde abajo",
  "orientacion": "horizontal",
  "contextoEducativo": "Muestra la densidad de vegetación característica del bioma selva"
}

Ejemplo de video bien generado:
{
  "titulo": "La Amazonia en 3 minutos",
  "duracion": "3 min",
  "fuente": "youtube",
  "queryBusqueda": "Amazonia Nat Geo Español 3 minutos",
  "descripcion": "Recorrido visual rápido por la selva amazónica, ideal para primera exposición al bioma",
  "thumbnailHint": "selva"
}

## REGLA CRÍTICA

Si no estás seguro de que un recurso existe, NO LO INCLUYAS. Es preferible devolver 2 videos verificables que 5 inventados. El docente pierde confianza en IncluIA si encuentra un solo link roto.
`;
```

---

## CAMBIO 3 · Builder del prompt actualizado

### Archivo a modificar: `lib/prompts.ts` (función `buildPromptDocentes` o equivalente)

```typescript
import { MULTIMEDIA_RULES } from "./multimedia-rules";
import { GuiaPedagogicaSchema } from "./schemas/guia-schema";

export function buildPromptDocentesV2(formData: FormularioDocente): string {
  const { contenido, discapacidades, nivel, anioGrado, materia,
          cantidadAlumnos, situacionApoyo, objetivoClase, contextoAula } = formData;

  return `
Sos IncluIA, experto argentino en educación inclusiva.
Conocés DUA, Resolución CFE 311/16 y los diseños curriculares provinciales.
Respondés siempre de forma concreta, práctica y aplicable al aula argentino.
Usás español rioplatense (vos, planificá, tenés).

## CONTEXTO DEL ALUMNO Y DEL AULA

- Contenido a enseñar: ${contenido}
- Nivel: ${nivel} · ${anioGrado}
- Área/Materia: ${materia}
- Cantidad de alumnos: ${cantidadAlumnos}
- Discapacidades presentes: ${discapacidades.join(", ")}
- Situación de apoyo: ${situacionApoyo}
- Objetivo declarado por el/la docente: ${objetivoClase}
- Contexto del aula: ${contextoAula}

${MULTIMEDIA_RULES}

## FORMATO DE SALIDA OBLIGATORIO

Devolvés ÚNICAMENTE un objeto JSON válido que cumpla con este schema:
${JSON.stringify(GuiaPedagogicaSchema.shape, null, 2)}

## REGLAS DE CONTENIDO

1. Priorizá siempre lo concreto sobre lo teórico.
2. Adecuaciones según Res. CFE 311/16: no simplifiques el contenido, adaptá el acceso.
3. Si el docente está solo/a sin apoyo, todas las estrategias deben ser ejecutables por una sola persona con 28 alumnos.
4. Incluí referencias normativas argentinas cuando corresponda (CFE 311/16, Ley 26.206, Ley 26.378).
5. Nunca asumas recursos tecnológicos avanzados. Priorizá lo que se hace con papel, cartón, celular.
6. El tono hacia el docente es de colega experto, nunca de superior ni de manual.

RESPONDE AHORA CON EL JSON DE LA GUÍA:
`;
}
```

---

## CAMBIO 4 · API route con validación y enriquecimiento

### Archivo a crear/modificar: `app/api/generar-guia/route.ts`

```typescript
import { Anthropic } from "@anthropic-ai/sdk";
import { GuiaPedagogicaSchema } from "@/lib/schemas/guia-schema";
import { buildPromptDocentesV2 } from "@/lib/prompts";
import { enriquecerImagenes } from "@/lib/servicios/unsplash";
import { enriquecerVideos } from "@/lib/servicios/videos";
import { supabaseServer } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const formData = await req.json();

    // 1. Verificar auth y plan del usuario (ya existente)
    const user = await verifyUserAndLimits(req);

    // 2. Construir prompt con nuevas reglas multimedia
    const prompt = buildPromptDocentesV2(formData);

    // 3. Llamar a Claude con formato JSON forzado
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const response = await anthropic.messages.create({
      model: "claude-opus-4-7",
      max_tokens: 8000,
      messages: [{ role: "user", content: prompt }],
    });

    // 4. Extraer y validar JSON
    const rawText = response.content[0].type === "text"
      ? response.content[0].text
      : "";

    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No se encontró JSON en la respuesta");

    const parsed = JSON.parse(jsonMatch[0]);

    // 5. Validar contra schema Zod
    const guiaValidada = GuiaPedagogicaSchema.parse(parsed);

    // 6. ENRIQUECIMIENTO POST-GENERACIÓN
    // Resolver queries de imágenes a URLs reales de Unsplash
    const guiaEnriquecida = await enriquecerGuia(guiaValidada);

    // 7. Guardar en Supabase
    const { data, error } = await supabaseServer
      .from("consultas")
      .insert({
        user_id: user.id,
        modulo: "docentes",
        datos_modulo: formData,
        respuesta_ia_estructurada: guiaEnriquecida,
        version_schema: "2.1",
        tokens_usados: response.usage.input_tokens + response.usage.output_tokens
      })
      .select()
      .single();

    if (error) throw error;

    return Response.json({ success: true, guia: guiaEnriquecida, id: data.id });

  } catch (err) {
    console.error("Error generando guía:", err);
    return Response.json({
      success: false,
      error: err instanceof Error ? err.message : "Error desconocido"
    }, { status: 500 });
  }
}

async function enriquecerGuia(guia: GuiaPedagogica): Promise<GuiaPedagogica> {
  // Resolver todas las imágenes en paralelo
  const conceptosEnriquecidos = await Promise.all(
    guia.conceptosClave.map(async (c) => ({
      ...c,
      imagen: await enriquecerImagenes(c.imagen)
    }))
  );

  const estrategiasEnriquecidas = await Promise.all(
    guia.estrategias.map(async (e) => ({
      ...e,
      imagenApoyo: e.imagenApoyo ? await enriquecerImagenes(e.imagenApoyo) : undefined,
      videoApoyo: e.videoApoyo ? await enriquecerVideos(e.videoApoyo) : undefined
    }))
  );

  const videosEnriquecidos = await Promise.all(
    guia.videos.map(v => enriquecerVideos(v))
  );

  return {
    ...guia,
    conceptosClave: conceptosEnriquecidos,
    estrategias: estrategiasEnriquecidas,
    videos: videosEnriquecidos
  };
}
```

---

## CAMBIO 5 · Servicio de imágenes (Unsplash)

### Archivo a crear: `lib/servicios/unsplash.ts`

```typescript
import type { ImagenRef } from "@/lib/schemas/guia-schema";

export interface ImagenEnriquecida extends ImagenRef {
  urls?: {
    small: string;   // 400px
    regular: string; // 1080px
    full: string;    // original
  };
  autor?: {
    nombre: string;
    url: string;
  };
}

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY!;

export async function enriquecerImagenes(ref: ImagenRef): Promise<ImagenEnriquecida> {
  if (ref.tipo !== "unsplash") return ref;

  try {
    const params = new URLSearchParams({
      query: ref.query,
      per_page: "1",
      orientation: ref.orientacion === "vertical" ? "portrait"
                 : ref.orientacion === "cuadrada" ? "squarish"
                 : "landscape"
    });

    const res = await fetch(
      `https://api.unsplash.com/search/photos?${params}`,
      {
        headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` },
        next: { revalidate: 86400 } // cachear 24h
      }
    );

    if (!res.ok) return ref;

    const data = await res.json();
    const foto = data.results?.[0];
    if (!foto) return ref;

    return {
      ...ref,
      urls: {
        small: foto.urls.small,
        regular: foto.urls.regular,
        full: foto.urls.full
      },
      autor: {
        nombre: foto.user.name,
        url: foto.user.links.html
      }
    };
  } catch (err) {
    console.error("Error enriqueciendo imagen:", err);
    return ref; // Fallback: devolver sin URLs, el frontend muestra placeholder
  }
}
```

---

## CAMBIO 6 · Servicio de videos (YouTube + verificación)

### Archivo a crear: `lib/servicios/videos.ts`

```typescript
import type { VideoRef } from "@/lib/schemas/guia-schema";

export interface VideoEnriquecido extends VideoRef {
  thumbnail?: string;
  urlEmbed?: string;
  urlBusqueda: string;
  verificado: boolean;
}

export async function enriquecerVideos(ref: VideoRef): Promise<VideoEnriquecido> {
  const urlBusqueda = `https://www.youtube.com/results?search_query=${encodeURIComponent(ref.queryBusqueda)}`;

  // Si el agente dio un embedId, lo usamos (sin verificación API para MVP)
  if (ref.embedId) {
    return {
      ...ref,
      thumbnail: `https://i.ytimg.com/vi/${ref.embedId}/hqdefault.jpg`,
      urlEmbed: `https://www.youtube.com/embed/${ref.embedId}`,
      urlBusqueda,
      verificado: true
    };
  }

  // Si no, devolvemos solo query de búsqueda
  return {
    ...ref,
    urlBusqueda,
    verificado: false
  };
}
```

---

## CAMBIO 7 · Migración de base de datos

### Nuevo campo en tabla `consultas`

```sql
-- Agregar columna para respuesta estructurada
ALTER TABLE public.consultas
ADD COLUMN IF NOT EXISTS respuesta_ia_estructurada JSONB;

ALTER TABLE public.consultas
ADD COLUMN IF NOT EXISTS version_schema TEXT DEFAULT '1.0';

-- Indexar para búsquedas en contenido estructurado
CREATE INDEX IF NOT EXISTS idx_consultas_version_schema
ON public.consultas(version_schema);

-- El campo respuesta_ia (markdown) se mantiene por retrocompatibilidad
-- Se puede deprecar cuando todas las consultas estén en v2.1
COMMENT ON COLUMN public.consultas.respuesta_ia IS 'Deprecado desde v2.1 — usar respuesta_ia_estructurada';
```

---

## CAMBIO 8 · Variables de entorno nuevas

### Agregar a `.env.local` y a Vercel

```bash
# Unsplash API (gratis hasta 50 req/hora, 5000/mes)
# Registrarse en: https://unsplash.com/developers
UNSPLASH_ACCESS_KEY=tu_access_key_aca

# YouTube Data API (opcional, para verificar videos)
# Consola: https://console.cloud.google.com/
YOUTUBE_API_KEY=tu_api_key_aca
```

---

## CAMBIO 9 · Testing del agente

### Archivo a crear: `tests/agente-multimedia.test.ts`

Casos de prueba obligatorios antes de deployar:

```typescript
describe("Agente v2.1 con multimedia", () => {

  it("debe devolver JSON válido según schema", async () => {
    const guia = await generarGuiaTest(casoBiomas);
    expect(() => GuiaPedagogicaSchema.parse(guia)).not.toThrow();
  });

  it("todas las imágenes deben tener query en inglés", async () => {
    const guia = await generarGuiaTest(casoBiomas);
    guia.conceptosClave.forEach(c => {
      expect(c.imagen.query).toMatch(/^[a-z\s]+$/);
    });
  });

  it("todos los videos deben durar menos de 5 minutos", async () => {
    const guia = await generarGuiaTest(casoBiomas);
    guia.videos.forEach(v => {
      const minutos = parseInt(v.duracion);
      expect(minutos).toBeLessThanOrEqual(5);
    });
  });

  it("no debe inventar URLs de YouTube", async () => {
    const guia = await generarGuiaTest(casoBiomas);
    guia.videos.forEach(v => {
      if (v.url) {
        expect(v.embedId).toBeDefined();
      }
    });
  });

  it("las imágenes se enriquecen con URLs de Unsplash", async () => {
    const guia = await generarGuiaTest(casoBiomas);
    const enriquecida = await enriquecerGuia(guia);
    enriquecida.conceptosClave.forEach(c => {
      expect(c.imagen.urls?.regular).toMatch(/^https:\/\/images\.unsplash\.com/);
    });
  });

});
```

---

## ORDEN DE IMPLEMENTACIÓN RECOMENDADO

1. Crear `lib/schemas/guia-schema.ts` con Zod schemas
2. Crear `lib/servicios/unsplash.ts` con llamada a API
3. Crear `lib/servicios/videos.ts` con helper de YouTube
4. Modificar `lib/prompts.ts` con nuevas reglas y builder v2
5. Migrar base de datos (agregar campo `respuesta_ia_estructurada`)
6. Modificar `app/api/generar-guia/route.ts` con validación y enriquecimiento
7. Registrarse en Unsplash Developers y obtener API key
8. Configurar variables de entorno
9. Correr tests
10. Hacer deploy a staging y probar con caso real

---

## RIESGOS Y MITIGACIONES

**Riesgo 1 — Claude devuelve JSON inválido**
→ Mitigación: retry con prompt de corrección + fallback a v1 markdown

**Riesgo 2 — Unsplash devuelve imágenes inapropiadas**
→ Mitigación: Agregar parámetro `content_filter=high` en la API + whitelist de queries

**Riesgo 3 — Videos recomendados no existen en YouTube**
→ Mitigación: siempre incluir `queryBusqueda`, y marcar `verificado: false` cuando no hay embedId

**Riesgo 4 — El rendimiento baja por el enriquecimiento en paralelo**
→ Mitigación: caché de 24h en Unsplash + streaming desde Claude mientras se enriquece

---

## MÉTRICAS A MONITOREAR POST-DEPLOY

- Tasa de parseo exitoso del JSON (objetivo: >98%)
- Tiempo promedio de respuesta total (objetivo: <15 segundos)
- Tasa de imágenes enriquecidas exitosamente (objetivo: >90%)
- Feedback positivo de docentes sobre recursos multimedia (objetivo: >4/5)

---

FIN DEL DOCUMENTO — CAMBIOS AL AGENTE

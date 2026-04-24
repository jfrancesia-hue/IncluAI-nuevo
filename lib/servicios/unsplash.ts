import 'server-only';
import type { ImagenRef } from '@/lib/schemas/guia-schema';

// ImagenEnriquecida vive ahora en el schema Zod (ImagenRefSchema.urls/autor).
// Lo dejamos como alias para no romper imports previos.
export type ImagenEnriquecida = ImagenRef;

type UnsplashPhoto = {
  urls: { small: string; regular: string; full: string };
  user: { name: string; links: { html: string } };
};

type UnsplashResponse = { results?: UnsplashPhoto[] };

const UNSPLASH_ENDPOINT = 'https://api.unsplash.com/search/photos';

function orientacionUnsplash(o: ImagenRef['orientacion']): string {
  if (o === 'vertical') return 'portrait';
  if (o === 'cuadrada') return 'squarish';
  return 'landscape';
}

// Fallback: primeras 2 palabras significativas del query (dropping stopwords).
// Claude a veces genera queries ultra específicos que no matchean en stock.
function queryFallback(query: string): string {
  const stopwords = new Set([
    'a', 'an', 'the', 'in', 'on', 'at', 'of', 'for', 'with', 'and', 'or',
    'to', 'from', 'by', 'as', 'into', 'about',
  ]);
  const words = query
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopwords.has(w));
  return words.slice(0, 2).join(' ') || query;
}

async function buscarEnUnsplash(
  query: string,
  orientation: string,
  accessKey: string
): Promise<UnsplashPhoto | null> {
  const params = new URLSearchParams({
    query,
    per_page: '5',
    orientation,
    content_filter: 'high',
  });
  const res = await fetch(`${UNSPLASH_ENDPOINT}?${params.toString()}`, {
    headers: { Authorization: `Client-ID ${accessKey}` },
    next: { revalidate: 86400 },
    signal: AbortSignal.timeout(5000),
  });
  if (!res.ok) {
    console.warn(
      `[unsplash] search failed — status ${res.status} query="${query}"`
    );
    return null;
  }
  const data = (await res.json()) as UnsplashResponse;
  return data.results?.[0] ?? null;
}

/**
 * Busca una foto en Unsplash y devuelve solo la URL regular. Uso: thumbnails
 * de videos sin embedId de YouTube cuando Pexels no encuentra nada.
 */
export async function fetchUnsplashThumbnail(
  query: string,
  orientation: 'horizontal' | 'vertical' | 'cuadrada' = 'horizontal'
): Promise<string | null> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) return null;
  try {
    const o = orientacionUnsplash(orientation);
    let foto = await buscarEnUnsplash(query, o, accessKey);
    if (!foto) {
      const fb = queryFallback(query);
      if (fb !== query) foto = await buscarEnUnsplash(fb, o, accessKey);
    }
    return foto?.urls.regular ?? null;
  } catch {
    return null;
  }
}

export async function enriquecerImagen(
  ref: ImagenRef
): Promise<ImagenEnriquecida> {
  // Solo enriquecemos Unsplash por ahora. El resto pasa tal cual.
  if (ref.tipo !== 'unsplash') return ref;

  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) {
    console.warn(
      '[unsplash] UNSPLASH_ACCESS_KEY no configurada — devuelvo ref sin URLs'
    );
    return ref;
  }

  try {
    const orientation = orientacionUnsplash(ref.orientacion);
    let foto = await buscarEnUnsplash(ref.query, orientation, accessKey);

    // Fallback: si el query específico no devolvió nada, degradar a 2 palabras
    if (!foto) {
      const fb = queryFallback(ref.query);
      if (fb !== ref.query) {
        foto = await buscarEnUnsplash(fb, orientation, accessKey);
      }
    }
    if (!foto) return ref;

    return {
      ...ref,
      urls: {
        small: foto.urls.small,
        regular: foto.urls.regular,
        full: foto.urls.full,
      },
      autor: {
        nombre: foto.user.name,
        url: foto.user.links.html,
      },
    };
  } catch (err) {
    console.error('[unsplash] error enriqueciendo imagen:', err);
    return ref;
  }
}

/**
 * Helper para enriquecer listas en paralelo tolerando fallos individuales.
 * Cada imagen que falla devuelve el ref sin URLs — el frontend decide fallback.
 */
export async function enriquecerImagenes(
  refs: ImagenRef[]
): Promise<ImagenEnriquecida[]> {
  return Promise.all(refs.map((r) => enriquecerImagen(r)));
}

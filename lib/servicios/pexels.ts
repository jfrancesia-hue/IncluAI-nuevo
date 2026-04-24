import 'server-only';
import type { ImagenRef } from '@/lib/schemas/guia-schema';
import type { ImagenEnriquecida } from '@/lib/servicios/unsplash';

type PexelsPhoto = {
  src: {
    small: string; // 130 tall
    medium: string; // 350 tall
    large: string; // 940x650
    large2x: string; // 1880x1300
    original: string;
    landscape: string;
    portrait: string;
  };
  photographer: string;
  photographer_url: string;
  alt: string;
};

type PexelsSearchResponse = {
  photos?: PexelsPhoto[];
};

const PEXELS_ENDPOINT = 'https://api.pexels.com/v1/search';

function orientacionPexels(o: ImagenRef['orientacion']): string {
  if (o === 'vertical') return 'portrait';
  if (o === 'cuadrada') return 'square';
  return 'landscape';
}

// Reducir un query largo a las 2-3 palabras más significativas para un
// fallback de búsqueda. Claude a veces genera queries muy específicos
// ("argentine teacher whiteboard math inclusive") que devuelven 0
// resultados. Degradarlo a "argentine teacher math" suele traer algo.
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

async function buscarEnPexels(
  query: string,
  orientation: string,
  apiKey: string
): Promise<PexelsPhoto | null> {
  const params = new URLSearchParams({
    query,
    per_page: '5',
    orientation,
  });
  const res = await fetch(`${PEXELS_ENDPOINT}?${params.toString()}`, {
    headers: { Authorization: apiKey },
    next: { revalidate: 86400 },
    signal: AbortSignal.timeout(5000),
  });
  if (!res.ok) {
    console.warn(
      `[pexels] search failed — status ${res.status} query="${query}"`
    );
    return null;
  }
  const data = (await res.json()) as PexelsSearchResponse;
  return data.photos?.[0] ?? null;
}

/**
 * Enriquece una ImagenRef con tipo="pexels" resolviendo el query contra la API
 * de Pexels. Busca 5 resultados (mejor probabilidad de cobertura que 1) y si
 * el query original no devuelve nada, reintenta con una versión simplificada
 * (2 palabras clave). Tolera ausencia de API key.
 */
export async function enriquecerImagenPexels(
  ref: ImagenRef
): Promise<ImagenEnriquecida> {
  if (ref.tipo !== 'pexels') return ref;

  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) {
    console.warn('[pexels] PEXELS_API_KEY no configurada — devuelvo ref sin URLs');
    return ref;
  }

  try {
    const orientation = orientacionPexels(ref.orientacion);
    let foto = await buscarEnPexels(ref.query, orientation, apiKey);

    // Fallback: si el query específico no devolvió nada, degradar a 2 palabras
    if (!foto) {
      const fb = queryFallback(ref.query);
      if (fb !== ref.query) {
        foto = await buscarEnPexels(fb, orientation, apiKey);
      }
    }
    if (!foto) return ref;

    return {
      ...ref,
      urls: {
        small: foto.src.medium,
        regular: foto.src.large,
        full: foto.src.original,
      },
      autor: {
        nombre: foto.photographer,
        url: foto.photographer_url,
      },
    };
  } catch (err) {
    console.error('[pexels] error enriqueciendo imagen:', err);
    return ref;
  }
}

/**
 * Busca una foto en Pexels y devuelve solo la URL regular. Uso: generar
 * thumbnails de videos que no tienen embedId de YouTube. No impone el tipo
 * 'pexels' ni usa el schema ImagenRef — es un helper interno de bajo nivel.
 */
export async function fetchPexelsThumbnail(
  query: string,
  orientation: 'horizontal' | 'vertical' | 'cuadrada' = 'horizontal'
): Promise<string | null> {
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) return null;
  try {
    const o = orientacionPexels(orientation);
    let foto = await buscarEnPexels(query, o, apiKey);
    if (!foto) {
      const fb = queryFallback(query);
      if (fb !== query) foto = await buscarEnPexels(fb, o, apiKey);
    }
    return foto?.src.large ?? null;
  } catch {
    return null;
  }
}

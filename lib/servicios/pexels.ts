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

/**
 * Enriquece una ImagenRef con tipo="pexels" resolviendo el query contra la API
 * de Pexels. Alternativa a Unsplash mientras se aprueba la app de Unsplash
 * (hasta 10 días hábiles). Pexels aprueba keys al instante.
 *
 * Tolera ausencia de API key: devuelve el ref tal cual, el frontend decide placeholder.
 */
export async function enriquecerImagenPexels(
  ref: ImagenRef
): Promise<ImagenEnriquecida> {
  if (ref.tipo !== 'pexels') return ref;

  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) {
    console.warn(
      '[pexels] PEXELS_API_KEY no configurada — devuelvo ref sin URLs'
    );
    return ref;
  }

  try {
    const params = new URLSearchParams({
      query: ref.query,
      per_page: '1',
      orientation: orientacionPexels(ref.orientacion),
    });

    const res = await fetch(`${PEXELS_ENDPOINT}?${params.toString()}`, {
      headers: { Authorization: apiKey },
      next: { revalidate: 86400 }, // caché 24h
    });

    if (!res.ok) {
      console.warn(
        `[pexels] search failed — status ${res.status} query="${ref.query}"`
      );
      return ref;
    }

    const data = (await res.json()) as PexelsSearchResponse;
    const foto = data.photos?.[0];
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

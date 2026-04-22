import 'server-only';
import type { ImagenRef } from '@/lib/schemas/guia-schema';

export interface ImagenEnriquecida extends ImagenRef {
  urls?: {
    small: string; // 400px
    regular: string; // 1080px
    full: string; // original
  };
  autor?: {
    nombre: string;
    url: string;
  };
}

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
    const params = new URLSearchParams({
      query: ref.query,
      per_page: '1',
      orientation: orientacionUnsplash(ref.orientacion),
      content_filter: 'high',
    });

    const res = await fetch(`${UNSPLASH_ENDPOINT}?${params.toString()}`, {
      headers: { Authorization: `Client-ID ${accessKey}` },
      next: { revalidate: 86400 }, // caché 24h
    });

    if (!res.ok) {
      console.warn(
        `[unsplash] search failed — status ${res.status} query="${ref.query}"`
      );
      return ref;
    }

    const data = (await res.json()) as UnsplashResponse;
    const foto = data.results?.[0];
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

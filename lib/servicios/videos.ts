import 'server-only';
import type { VideoRef } from '@/lib/schemas/guia-schema';
import { fetchPexelsThumbnail } from '@/lib/servicios/pexels';

export interface VideoEnriquecido extends VideoRef {
  thumbnail?: string;
  urlEmbed?: string;
  urlBusqueda: string;
  verificado: boolean;
}

/**
 * Enriquece una referencia de video:
 * - Si vino un embedId de YouTube, se arma thumbnail oficial + urlEmbed y se
 *   marca verificado.
 * - Si no vino embedId, intentamos un thumbnail "ambiental" desde Pexels
 *   usando el queryBusqueda (ej: "Amazonia Nat Geo Español 3 minutos" →
 *   imagen de selva amazónica). Así la tarjeta del video no queda como un
 *   gradiente plano, sino con una imagen coherente al tema.
 *
 * No inventamos URLs: si no hay embedId, verificado=false y el frontend muestra
 * botón "Buscar en YouTube" en vez de un embed que podría romperse.
 */
export async function enriquecerVideo(
  ref: VideoRef
): Promise<VideoEnriquecido> {
  const urlBusqueda = `https://www.youtube.com/results?search_query=${encodeURIComponent(ref.queryBusqueda)}`;

  if (ref.embedId) {
    return {
      ...ref,
      thumbnail: `https://i.ytimg.com/vi/${ref.embedId}/hqdefault.jpg`,
      urlEmbed: `https://www.youtube.com/embed/${ref.embedId}`,
      urlBusqueda,
      verificado: true,
    };
  }

  // Sin embedId: traemos una imagen "ambiental" de Pexels como thumbnail.
  // Si Pexels no responde o no hay match, queda undefined y el frontend
  // muestra el gradiente por thumbnailHint (fallback existente).
  const thumbnail = (await fetchPexelsThumbnail(ref.queryBusqueda)) ?? undefined;

  return {
    ...ref,
    thumbnail,
    urlBusqueda,
    verificado: false,
  };
}

export async function enriquecerVideos(
  refs: VideoRef[]
): Promise<VideoEnriquecido[]> {
  return Promise.all(refs.map((r) => enriquecerVideo(r)));
}

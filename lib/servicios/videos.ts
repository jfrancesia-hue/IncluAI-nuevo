import 'server-only';
import type { VideoRef } from '@/lib/schemas/guia-schema';

export interface VideoEnriquecido extends VideoRef {
  thumbnail?: string;
  urlEmbed?: string;
  urlBusqueda: string;
  verificado: boolean;
}

/**
 * Enriquece una referencia de video:
 * - Si vino un embedId de YouTube, se arma thumbnail + urlEmbed y se marca verificado.
 * - Si no, solo se arma la URL de búsqueda para que el docente lo encuentre.
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

  return {
    ...ref,
    urlBusqueda,
    verificado: false,
  };
}

export async function enriquecerVideos(
  refs: VideoRef[]
): Promise<VideoEnriquecido[]> {
  return Promise.all(refs.map((r) => enriquecerVideo(r)));
}

import 'server-only';
import type { ImagenRef } from '@/lib/schemas/guia-schema';
import { enriquecerImagen as unsplash, type ImagenEnriquecida } from '@/lib/servicios/unsplash';
import { enriquecerImagenPexels } from '@/lib/servicios/pexels';

export type { ImagenEnriquecida };

/**
 * Router de enriquecimiento de imágenes. Despacha según ref.tipo al proveedor
 * correspondiente. Los tipos que no tenemos implementados (banco_incluia,
 * wikimedia) devuelven la ref sin URLs — el frontend decide placeholder.
 */
export async function enriquecerImagen(
  ref: ImagenRef
): Promise<ImagenEnriquecida> {
  switch (ref.tipo) {
    case 'unsplash':
      return unsplash(ref);
    case 'pexels':
      return enriquecerImagenPexels(ref);
    default:
      return ref;
  }
}

export async function enriquecerImagenes(
  refs: ImagenRef[]
): Promise<ImagenEnriquecida[]> {
  return Promise.all(refs.map((r) => enriquecerImagen(r)));
}

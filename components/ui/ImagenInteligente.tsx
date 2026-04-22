'use client';

import Image from 'next/image';
import type { ImagenEnriquecida } from '@/lib/servicios/imagenes';

interface Props {
  imagen: ImagenEnriquecida;
  colorFallback?: string;
  aspectRatio?: string;
  prioridad?: boolean;
}

/**
 * Renderiza una imagen Unsplash/Pexels enriquecida. Si el enriquecimiento
 * falló (sin URLs), muestra un bloque con gradiente + alt-text como fallback
 * legible — evita placeholders vacíos que confunden al docente.
 */
export function ImagenInteligente({
  imagen,
  colorFallback = 'var(--color-docentes-bg)',
  aspectRatio = '16 / 10',
  prioridad = false,
}: Props) {
  if (!imagen.urls?.regular) {
    return (
      <div
        role="img"
        aria-label={imagen.alt}
        style={{
          width: '100%',
          aspectRatio,
          background: `linear-gradient(135deg, ${colorFallback}, rgba(0,0,0,0.1))`,
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'rgba(0,0,0,0.3)',
          fontSize: 14,
          padding: 20,
          textAlign: 'center',
        }}
      >
        {imagen.alt}
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio,
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
      }}
    >
      <Image
        src={imagen.urls.regular}
        alt={imagen.alt}
        fill
        sizes="(max-width: 720px) 100vw, 400px"
        style={{ objectFit: 'cover' }}
        priority={prioridad}
      />
      {imagen.autor && (
        <a
          href={imagen.autor.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            position: 'absolute',
            bottom: 6,
            right: 8,
            fontSize: 10,
            color: 'white',
            background: 'rgba(0,0,0,0.5)',
            padding: '2px 6px',
            borderRadius: 4,
            textDecoration: 'none',
            opacity: 0.7,
          }}
        >
          📷 {imagen.autor.nombre}
        </a>
      )}
    </div>
  );
}

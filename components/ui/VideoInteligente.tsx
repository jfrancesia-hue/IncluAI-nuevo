'use client';

import { useEffect, useState } from 'react';
import type { VideoRef } from '@/lib/schemas/guia-schema';
import type { VideoEnriquecido } from '@/lib/servicios/videos';

// Acepta tanto VideoRef (solo query) como VideoEnriquecido (embed/thumbnail).
// Si no viene urlBusqueda/verificado lo computamos en runtime.
type VideoInput = VideoRef | VideoEnriquecido;

interface Props {
  video: VideoInput;
}

function normalizar(v: VideoInput): VideoEnriquecido {
  if ('urlBusqueda' in v && typeof v.urlBusqueda === 'string') {
    return v as VideoEnriquecido;
  }
  return {
    ...v,
    urlBusqueda: `https://www.youtube.com/results?search_query=${encodeURIComponent(v.queryBusqueda)}`,
    verificado: Boolean(v.embedId),
    thumbnail: v.embedId
      ? `https://i.ytimg.com/vi/${v.embedId}/hqdefault.jpg`
      : undefined,
    urlEmbed: v.embedId
      ? `https://www.youtube.com/embed/${v.embedId}`
      : undefined,
  };
}

const colorPorHint: Record<string, string> = {
  selva: 'linear-gradient(135deg, #97C459, #3B6D11)',
  desierto: 'linear-gradient(135deg, #EF9F27, #D85A30)',
  pampa: 'linear-gradient(135deg, #FAC775, #97C459)',
  oceano: 'linear-gradient(135deg, #85B7EB, #185FA5)',
  montana: 'linear-gradient(135deg, #B4B2A9, #444441)',
  default: 'linear-gradient(135deg, #534AB7, #D4537E)',
};

const FUENTE_LABELS: Record<VideoEnriquecido['fuente'], string> = {
  youtube: 'YouTube',
  pakapaka: 'Pakapaka',
  encuentro: 'Canal Encuentro',
  educ_ar: 'Educ.ar',
};

export function VideoInteligente({ video: input }: Props) {
  const video = normalizar(input);
  const [modalAbierto, setModalAbierto] = useState(false);
  const gradiente = colorPorHint[video.thumbnailHint] ?? colorPorHint.default;

  const handleAbrir = () => {
    if (video.urlEmbed) {
      setModalAbierto(true);
    } else {
      window.open(video.urlBusqueda, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <>
      <button
        onClick={handleAbrir}
        className="video-card"
        aria-label={`Ver video: ${video.titulo}`}
        style={{
          background: 'white',
          border: '1px solid var(--color-borde)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          cursor: 'pointer',
          transition: 'transform 0.2s, box-shadow 0.2s',
          padding: 0,
          fontFamily: 'inherit',
          textAlign: 'left',
          width: '100%',
          display: 'block',
        }}
      >
        <div
          style={{
            height: 140,
            background: video.thumbnail
              ? `url(${video.thumbnail}) center/cover`
              : gradiente,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              background: 'rgba(255,255,255,0.95)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="var(--color-docentes-primary)"
              aria-hidden
            >
              <polygon points="5,3 19,12 5,21" />
            </svg>
          </div>
          <div
            style={{
              position: 'absolute',
              top: 10,
              right: 10,
              background: 'rgba(0,0,0,0.65)',
              color: 'white',
              padding: '3px 8px',
              borderRadius: 4,
              fontSize: 11,
              fontWeight: 600,
            }}
          >
            {video.duracion}
          </div>
        </div>
        <div style={{ padding: 16 }}>
          <div
            style={{
              fontSize: 15,
              fontWeight: 600,
              marginBottom: 4,
              lineHeight: 1.3,
            }}
          >
            {video.titulo}
          </div>
          <div style={{ fontSize: 13, color: 'var(--color-texto-medio)' }}>
            {FUENTE_LABELS[video.fuente] ?? video.fuente}
            {!video.verificado && ' · Buscar'}
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

function ModalVideo({
  url,
  titulo,
  onClose,
}: {
  url: string;
  titulo: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Video: ${titulo}`}
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.85)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 900,
          aspectRatio: '16 / 9',
          background: 'black',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
        }}
      >
        <iframe
          src={`${url}?autoplay=1`}
          title={titulo}
          style={{ width: '100%', height: '100%', border: 0 }}
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
      </div>
      <button
        onClick={onClose}
        aria-label="Cerrar video"
        style={{
          position: 'absolute',
          top: 20,
          right: 20,
          width: 44,
          height: 44,
          borderRadius: '50%',
          background: 'white',
          border: 'none',
          cursor: 'pointer',
          fontSize: 20,
        }}
      >
        ×
      </button>
    </div>
  );
}

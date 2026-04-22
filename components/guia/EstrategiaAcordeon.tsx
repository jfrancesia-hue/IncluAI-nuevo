'use client';

import { useState } from 'react';
import { ImagenInteligente } from '@/components/ui/ImagenInteligente';
import { VideoInteligente } from '@/components/ui/VideoInteligente';
import type { Estrategia } from '@/lib/schemas/guia-schema';

const iconosPorTipo: Record<Estrategia['tipo'], string> = {
  manipulativa: '📦',
  visual: '🗺️',
  audiovisual: '▶️',
  producto: '📖',
  corporal: '🤸',
  social: '👥',
};

function resaltar(texto: string, destacado?: string) {
  if (!destacado || !texto.includes(destacado)) return texto;
  const idx = texto.indexOf(destacado);
  return (
    <>
      {texto.slice(0, idx)}
      <strong>{destacado}</strong>
      {texto.slice(idx + destacado.length)}
    </>
  );
}

export function EstrategiaAcordeon({
  estrategia,
  abiertaPorDefecto = false,
}: {
  estrategia: Estrategia;
  abiertaPorDefecto?: boolean;
}) {
  const [abierta, setAbierta] = useState(abiertaPorDefecto);

  return (
    <details
      open={abierta}
      onToggle={(e) => setAbierta((e.target as HTMLDetailsElement).open)}
      className="estrategia-acordeon"
      style={{
        background: 'white',
        border: '1px solid var(--color-borde)',
        borderRadius: 'var(--radius-xl)',
        marginBottom: 14,
        overflow: 'hidden',
        transition: 'box-shadow 0.2s, border-color 0.2s',
      }}
    >
      <summary
        style={{
          listStyle: 'none',
          cursor: 'pointer',
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          userSelect: 'none',
          minHeight: 44,
        }}
      >
        <div
          aria-hidden
          style={{
            flexShrink: 0,
            width: 56,
            height: 56,
            borderRadius: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 28,
            background: 'var(--color-docentes-bg)',
          }}
        >
          {iconosPorTipo[estrategia.tipo] ?? '✦'}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 12,
              textTransform: 'uppercase',
              letterSpacing: 0.6,
              fontWeight: 700,
              color: 'var(--color-docentes-primary)',
              marginBottom: 2,
            }}
          >
            Estrategia {estrategia.numero} · {estrategia.tipo}
          </div>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 22,
              fontWeight: 600,
              lineHeight: 1.2,
              marginBottom: 4,
              color: 'var(--color-texto)',
            }}
          >
            {estrategia.titulo}
          </div>
          <div style={{ fontSize: 13, color: 'var(--color-texto-medio)' }}>
            {estrategia.subtitulo}
          </div>
        </div>
        <div
          aria-hidden
          style={{
            flexShrink: 0,
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: abierta
              ? 'var(--color-docentes-primary)'
              : 'var(--color-docentes-bg)',
            color: abierta ? 'white' : 'var(--color-docentes-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 20,
            fontWeight: 700,
            transition: 'transform 0.25s, background 0.25s',
            transform: abierta ? 'rotate(45deg)' : 'rotate(0deg)',
          }}
        >
          +
        </div>
      </summary>

      <div
        className="estrategia-body"
        style={{ padding: '0 24px 28px' }}
      >
        {estrategia.imagenApoyo && (
          <div style={{ marginBottom: 20 }}>
            <ImagenInteligente
              imagen={estrategia.imagenApoyo}
              aspectRatio="16 / 9"
            />
          </div>
        )}

        <ol
          style={{
            listStyle: 'none',
            counterReset: 'paso',
            margin: '0 0 20px',
            padding: 0,
          }}
        >
          {estrategia.pasos.map((paso, i) => (
            <li
              key={i}
              style={{
                counterIncrement: 'paso',
                padding: '12px 0 12px 44px',
                position: 'relative',
                borderBottom:
                  i < estrategia.pasos.length - 1
                    ? '1px dashed var(--color-borde)'
                    : 'none',
                fontSize: 16,
                lineHeight: 1.55,
                color: 'var(--color-texto)',
              }}
            >
              <span
                aria-hidden
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 10,
                  width: 30,
                  height: 30,
                  borderRadius: '50%',
                  background: 'var(--color-docentes-bg)',
                  color: 'var(--color-docentes-primary)',
                  fontWeight: 700,
                  fontSize: 14,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {i + 1}
              </span>
              {resaltar(paso.texto, paso.destacado)}
            </li>
          ))}
        </ol>

        <aside
          style={{
            background: 'var(--color-exito-bg)',
            borderLeft: '4px solid var(--color-exito)',
            padding: '16px 20px',
            borderRadius: '0 12px 12px 0',
            fontSize: 15,
            lineHeight: 1.5,
            color: 'var(--color-selva-dark)',
          }}
        >
          <strong
            style={{
              color: 'var(--color-exito)',
              display: 'block',
              marginBottom: 4,
              fontSize: 12,
              textTransform: 'uppercase',
              letterSpacing: 0.6,
            }}
          >
            Por qué funciona
          </strong>
          {estrategia.porQueFunciona}
        </aside>

        {estrategia.videoApoyo && (
          <div style={{ marginTop: 20 }}>
            <VideoInteligente video={estrategia.videoApoyo} />
          </div>
        )}
      </div>
    </details>
  );
}

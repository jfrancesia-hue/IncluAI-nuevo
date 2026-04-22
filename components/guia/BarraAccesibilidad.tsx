'use client';

import { useAccesibilidad } from '@/hooks/guia/useAccesibilidad';
import { useImprimir } from '@/hooks/guia/useImprimir';

export function BarraAccesibilidad() {
  const { tamano, setTamano, altoContraste, setAltoContraste } =
    useAccesibilidad();
  const imprimir = useImprimir();

  return (
    <div
      className="barra-accesibilidad"
      role="toolbar"
      aria-label="Controles de accesibilidad"
      data-no-print
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        background: 'white',
        borderBottom: '1px solid var(--color-borde)',
        padding: '8px 16px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: 8,
        alignItems: 'center',
        justifyContent: 'flex-end',
        fontSize: 13,
      }}
    >
      <span style={{ fontSize: 12, color: 'var(--color-texto-medio)', marginRight: 4 }}>
        Tamaño:
      </span>
      <TamanoButton actual={tamano} valor="normal" label="A" onSet={setTamano} sizePx={14} />
      <TamanoButton actual={tamano} valor="large" label="A" onSet={setTamano} sizePx={17} />
      <TamanoButton actual={tamano} valor="xlarge" label="A" onSet={setTamano} sizePx={20} />

      <button
        type="button"
        aria-pressed={altoContraste}
        onClick={() => setAltoContraste(!altoContraste)}
        style={{
          minWidth: 44,
          minHeight: 44,
          padding: '0 12px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-borde)',
          background: altoContraste ? 'var(--color-texto)' : 'white',
          color: altoContraste ? 'white' : 'var(--color-texto)',
          cursor: 'pointer',
          fontWeight: 600,
        }}
      >
        {altoContraste ? '◐ Normal' : '◑ Alto contraste'}
      </button>

      <button
        type="button"
        onClick={imprimir}
        aria-label="Imprimir o guardar como PDF"
        style={{
          minWidth: 44,
          minHeight: 44,
          padding: '0 12px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-borde)',
          background: 'white',
          color: 'var(--color-texto)',
          cursor: 'pointer',
          fontWeight: 600,
        }}
      >
        🖨️ Imprimir
      </button>
    </div>
  );
}

function TamanoButton({
  actual,
  valor,
  label,
  sizePx,
  onSet,
}: {
  actual: 'normal' | 'large' | 'xlarge';
  valor: 'normal' | 'large' | 'xlarge';
  label: string;
  sizePx: number;
  onSet: (v: 'normal' | 'large' | 'xlarge') => void;
}) {
  const activo = actual === valor;
  return (
    <button
      type="button"
      aria-pressed={activo}
      aria-label={`Texto ${valor === 'normal' ? 'normal' : valor === 'large' ? 'grande' : 'extra grande'}`}
      onClick={() => onSet(valor)}
      style={{
        minWidth: 44,
        minHeight: 44,
        padding: '0 10px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--color-borde)',
        background: activo ? 'var(--color-docentes-primary)' : 'white',
        color: activo ? 'white' : 'var(--color-texto)',
        cursor: 'pointer',
        fontSize: sizePx,
        fontWeight: 700,
        fontFamily: 'var(--font-display)',
      }}
    >
      {label}
    </button>
  );
}

'use client';

import { useRouter } from 'next/navigation';
import { track } from '@vercel/analytics';
import { useAccesibilidad } from '@/hooks/guia/useAccesibilidad';
import { useImprimir } from '@/hooks/guia/useImprimir';

type UserPlan = 'free' | 'basico' | 'profesional' | 'premium';

interface Props {
  /** Si es 'free', el botón PDF redirige a /planes. Planes pagos imprimen. */
  userPlan?: UserPlan;
}

export function BarraAccesibilidad({ userPlan = 'free' }: Props) {
  const router = useRouter();
  const { tamano, setTamano, altoContraste, setAltoContraste } =
    useAccesibilidad();
  const imprimir = useImprimir();
  const pdfHabilitado = userPlan !== 'free';

  function onClickPdf() {
    if (pdfHabilitado) {
      track('pdf_downloaded', { plan: userPlan });
      imprimir();
    } else {
      track('pdf_download_blocked', { plan: userPlan });
      router.push('/planes?feature=pdf');
    }
  }

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
        onClick={onClickPdf}
        aria-label={
          pdfHabilitado
            ? 'Descargar la guía como PDF'
            : 'Descargar PDF — disponible en planes pagos'
        }
        title={
          pdfHabilitado
            ? 'En el diálogo, elegí "Guardar como PDF" en destino.'
            : 'Funcionalidad de planes pagos — click para ver planes'
        }
        style={{
          minWidth: 44,
          minHeight: 44,
          padding: '0 12px',
          borderRadius: 'var(--radius-md)',
          border: pdfHabilitado
            ? '1px solid var(--color-borde)'
            : '1px dashed var(--color-borde)',
          background: 'white',
          color: 'var(--color-texto)',
          cursor: 'pointer',
          fontWeight: 600,
          opacity: pdfHabilitado ? 1 : 0.7,
        }}
      >
        📄 Descargar PDF{pdfHabilitado ? '' : ' 🔒'}
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

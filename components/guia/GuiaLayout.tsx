import { BarraAccesibilidad } from './BarraAccesibilidad';
import { HeroGuia } from './HeroGuia';
import { VistaRapida } from './VistaRapida';
import { SeccionConceptosClave } from './SeccionConceptosClave';
import { SeccionEstrategias } from './SeccionEstrategias';
import { SeccionVideos } from './SeccionVideos';
import { SeccionMateriales } from './SeccionMateriales';
import { GrillaEvaluacion } from './GrillaEvaluacion';
import { TipsComunicacion } from './TipsComunicacion';
import { AlertaErrores } from './AlertaErrores';
import { CtaFeedback } from './CtaFeedback';
import type { GuiaPedagogica } from '@/lib/schemas/guia-schema';
import type { VideoEnriquecido } from '@/lib/servicios/videos';

type Metadata = {
  id: string;
  modulo?: 'docentes' | 'familias' | 'profesionales';
  materia?: string | null;
  nivel?: string | null;
  anio_grado?: string | null;
  cantidad_alumnos?: number | null;
  discapacidades?: string[];
  feedback_estrellas?: number | null;
};

interface Props {
  guia: GuiaPedagogica;
  metadata: Metadata;
}

export function GuiaLayout({ guia, metadata }: Props) {
  // Los videos en runtime vienen enriquecidos (desde la DB ya se guardaron así).
  // Casteo necesario porque el schema Zod persiste solo los campos "fuente" de VideoRef.
  const videos = guia.videos as VideoEnriquecido[];

  return (
    <>
      <BarraAccesibilidad />

      <HeroGuia vistaRapida={guia.vistaRapida} metadata={metadata} />

      <div
        className="guia-container"
        style={{
          maxWidth: 900,
          margin: '0 auto',
          padding: '40px 24px 80px',
        }}
      >
        <VistaRapida data={guia.vistaRapida} />

        <SeccionConceptosClave conceptos={guia.conceptosClave} />

        <SeccionEstrategias estrategias={guia.estrategias} />

        <SeccionVideos videos={videos} />

        <SeccionMateriales materiales={guia.materiales} />

        <GrillaEvaluacion
          criterios={guia.criteriosEvaluacion}
          guiaId={metadata.id}
        />

        <TipsComunicacion tips={guia.tipsComunicacion} modulo={metadata.modulo} />

        <AlertaErrores errores={guia.erroresComunes} />

        <CtaFeedback
          guiaId={metadata.id}
          initialStars={metadata.feedback_estrellas ?? 0}
        />

        {guia.fuentesNormativas && guia.fuentesNormativas.length > 0 && (
          <footer
            style={{
              marginTop: 40,
              padding: '20px 0 0',
              borderTop: '1px solid var(--color-borde)',
              fontSize: 12,
              color: 'var(--color-texto-medio)',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: 11,
                textTransform: 'uppercase',
                letterSpacing: 0.6,
                fontWeight: 700,
                marginBottom: 6,
              }}
            >
              Fuentes normativas
            </div>
            {guia.fuentesNormativas.join(' · ')}
          </footer>
        )}
      </div>
    </>
  );
}

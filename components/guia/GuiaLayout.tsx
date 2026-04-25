import { BarraAccesibilidad } from './BarraAccesibilidad';
import { HeroGuia } from './HeroGuia';
import { VistaRapida } from './VistaRapida';
import { SeccionConceptosClave } from './SeccionConceptosClave';
import { SeccionEstrategias } from './SeccionEstrategias';
import { SeccionPlanificacion } from './SeccionPlanificacion';
import { SeccionVideos } from './SeccionVideos';
import { SeccionMateriales } from './SeccionMateriales';
import { GrillaEvaluacion } from './GrillaEvaluacion';
import { TipsComunicacion } from './TipsComunicacion';
import { AlertaErrores } from './AlertaErrores';
import { CtaFeedback } from './CtaFeedback';
import { RevealOnScroll } from '@/components/landing/RevealOnScroll';
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
  /** Plan del usuario — determina si puede usar "Descargar PDF". */
  userPlan?: 'free' | 'basico' | 'profesional' | 'premium';
}

export function GuiaLayout({ guia, metadata, userPlan = 'free' }: Props) {
  // Los videos en runtime vienen enriquecidos (desde la DB ya se guardaron así).
  // Casteo necesario porque el schema Zod persiste solo los campos "fuente" de VideoRef.
  const videos = guia.videos as VideoEnriquecido[];

  return (
    <>
      <BarraAccesibilidad userPlan={userPlan} />

      <HeroGuia vistaRapida={guia.vistaRapida} metadata={metadata} />

      <div
        className="guia-container"
        style={{
          maxWidth: 900,
          margin: '0 auto',
          padding: '40px 24px 80px',
        }}
      >
        <RevealOnScroll>
          <VistaRapida data={guia.vistaRapida} />
        </RevealOnScroll>

        <RevealOnScroll>
          <SeccionConceptosClave conceptos={guia.conceptosClave} />
        </RevealOnScroll>

        <RevealOnScroll>
          <SeccionEstrategias estrategias={guia.estrategias} />
        </RevealOnScroll>

        {guia.planificacion && (
          <RevealOnScroll>
            <SeccionPlanificacion data={guia.planificacion} />
          </RevealOnScroll>
        )}

        <RevealOnScroll>
          <SeccionVideos videos={videos} />
        </RevealOnScroll>

        <RevealOnScroll>
          <SeccionMateriales materiales={guia.materiales} />
        </RevealOnScroll>

        <RevealOnScroll>
          <GrillaEvaluacion
            criterios={guia.criteriosEvaluacion}
            guiaId={metadata.id}
          />
        </RevealOnScroll>

        <RevealOnScroll>
          <TipsComunicacion
            tips={guia.tipsComunicacion}
            modulo={metadata.modulo}
          />
        </RevealOnScroll>

        <RevealOnScroll>
          <AlertaErrores errores={guia.erroresComunes} />
        </RevealOnScroll>

        <RevealOnScroll>
          <CtaFeedback
            guiaId={metadata.id}
            initialStars={metadata.feedback_estrellas ?? 0}
          />
        </RevealOnScroll>

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

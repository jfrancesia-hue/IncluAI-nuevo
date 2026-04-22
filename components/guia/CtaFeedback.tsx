import { FeedbackStars } from '@/components/guide/feedback-stars';

export function CtaFeedback({
  guiaId,
  initialStars = 0,
}: {
  guiaId: string;
  initialStars?: number;
}) {
  return (
    <aside
      className="cta-feedback"
      aria-label="Feedback de la guía"
      data-no-print
      style={{
        background: 'linear-gradient(135deg, var(--color-sol), var(--color-terracota))',
        borderRadius: 'var(--radius-2xl)',
        padding: '28px 24px',
        textAlign: 'center',
        color: '#3A2800',
      }}
    >
      <p
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 22,
          fontWeight: 700,
          margin: '0 0 4px',
        }}
      >
        ¿Esta guía te resultó útil?
      </p>
      <p
        style={{
          fontSize: 14,
          margin: '0 0 16px',
          opacity: 0.85,
        }}
      >
        Tu feedback nos ayuda a mejorar las guías para todos los docentes.
      </p>
      <div style={{ display: 'inline-flex' }}>
        <FeedbackStars consultaId={guiaId} initial={initialStars} />
      </div>
    </aside>
  );
}

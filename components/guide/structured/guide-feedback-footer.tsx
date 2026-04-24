import type { ReactNode } from 'react';
import { FeedbackStars } from '@/components/guide/feedback-stars';
import { RefinarBotones } from '@/components/guide/refinar-botones';

export function GuideFeedbackFooter({
  consultaId,
  initialStars,
  legalFooter,
}: {
  consultaId: string;
  initialStars: number;
  legalFooter?: string;
}) {
  return (
    <section id="refinar" data-section="refinar" className="flex flex-col gap-6">
      <div className="rounded-[22px] bg-gradient-to-br from-[#2E86C1] to-[#0e4f68] p-8 text-white shadow-[0_12px_40px_rgba(15,34,64,0.2)]">
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-[1fr_1fr]">
          <div>
            <p className="font-serif text-2xl font-bold">¿Esta guía te sirvió?</p>
            <p className="mt-2 text-sm text-white/80">
              Tu feedback nos ayuda a mejorar el modelo para el próximo docente que genere algo parecido.
            </p>
            <div className="mt-4">
              <FeedbackStars consultaId={consultaId} initial={initialStars} />
            </div>
          </div>
          <FooterActions>
            <RefinarBotones consultaId={consultaId} />
          </FooterActions>
        </div>
      </div>
      {legalFooter && (
        <p className="text-center text-xs text-[#4A5968]">{legalFooter}</p>
      )}
    </section>
  );
}

function FooterActions({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-3">{children}</div>;
}

import type { GuideSection, StructuredGuide } from '@/lib/guide-schema';
import { GuideHeroCard } from './guide-hero-card';
import { GuideSidebar } from './guide-sidebar';
import { GuideFeedbackFooter } from './guide-feedback-footer';
import { RevealOnScroll } from './reveal-on-scroll';
import { TimelineSection } from './sections/timeline-section';
import { StrategiesSection } from './sections/strategies-section';
import { ResourcesSection } from './sections/resources-section';
import { EvaluationSection } from './sections/evaluation-section';
import { CommunicationSection } from './sections/communication-section';
import { AvoidSection } from './sections/avoid-section';
import { CoordinationSection } from './sections/coordination-section';

export function StructuredGuideView({
  guide,
  markdown,
  consultaId,
  initialStars,
  createdAtIso,
}: {
  guide: StructuredGuide;
  markdown: string;
  consultaId: string;
  initialStars: number;
  createdAtIso: string;
}) {
  return (
    <div className="flex flex-col gap-10">
      <GuideHeroCard guide={guide} markdown={markdown} createdAtIso={createdAtIso} />

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[260px_1fr]">
        <GuideSidebar sections={guide.sections} />

        <main className="order-1 flex min-w-0 flex-col gap-14 lg:order-2">
          {guide.sections.map((section, i) => (
            <RevealOnScroll key={`${section.kind}-${i}`}>
              <SectionRouter
                section={section}
                anchorId={`s-${i + 1}`}
                index={i + 1}
              />
            </RevealOnScroll>
          ))}

          <RevealOnScroll>
            <GuideFeedbackFooter
              consultaId={consultaId}
              initialStars={initialStars}
              legalFooter={guide.legalFooter}
            />
          </RevealOnScroll>
        </main>
      </div>
    </div>
  );
}

function SectionRouter({
  section,
  anchorId,
  index,
}: {
  section: GuideSection;
  anchorId: string;
  index: number;
}) {
  switch (section.kind) {
    case 'timeline':
      return <TimelineSection section={section} anchorId={anchorId} index={index} />;
    case 'strategies':
      return <StrategiesSection section={section} anchorId={anchorId} index={index} />;
    case 'resources':
      return <ResourcesSection section={section} anchorId={anchorId} index={index} />;
    case 'evaluation':
      return <EvaluationSection section={section} anchorId={anchorId} index={index} />;
    case 'communication':
      return <CommunicationSection section={section} anchorId={anchorId} index={index} />;
    case 'avoid':
      return <AvoidSection section={section} anchorId={anchorId} index={index} />;
    case 'coordination':
      return <CoordinationSection section={section} anchorId={anchorId} index={index} />;
    default:
      return null;
  }
}

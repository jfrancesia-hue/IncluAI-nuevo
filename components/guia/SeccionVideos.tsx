import { VideoInteligente } from '@/components/ui/VideoInteligente';
import type { VideoEnriquecido } from '@/lib/servicios/videos';

export function SeccionVideos({
  videos,
}: {
  videos: VideoEnriquecido[];
}) {
  return (
    <section aria-labelledby="h-videos" style={{ marginBottom: 56 }}>
      <h2
        id="h-videos"
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 26,
          fontWeight: 700,
          color: 'var(--color-docentes-dark)',
          marginBottom: 20,
          letterSpacing: '-0.01em',
        }}
      >
        ▶️ Videos recomendados
      </h2>
      <div
        className="videos-grid"
        style={{
          display: 'grid',
          gap: 16,
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        }}
      >
        {videos.map((v, i) => (
          <VideoInteligente key={`${v.titulo}-${i}`} video={v} />
        ))}
      </div>
    </section>
  );
}

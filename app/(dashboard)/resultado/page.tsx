import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { GuideView } from '@/components/dashboard/guide-view';
import { FeedbackStars } from '@/components/dashboard/feedback-stars';
import { Button } from '@/components/ui/button';
import { DISCAPACIDADES } from '@/data/discapacidades';

export const metadata = { title: 'Resultado · IncluIA' };

type SearchParams = Promise<{ id?: string }>;

type ConsultaRow = {
  id: string;
  materia: string;
  contenido: string;
  discapacidades: string[];
  respuesta_ia: string | null;
  feedback_estrellas: number | null;
  created_at: string;
};

export default async function ResultadoPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { id } = await searchParams;
  if (!id) {
    return (
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl text-primary">Resultado</h1>
        <p className="text-muted">
          Falta el parámetro <code>?id=</code>. Volvé al{' '}
          <Link href="/historial" className="text-accent underline">historial</Link>.
        </p>
      </div>
    );
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from('consultas')
    .select('id, materia, contenido, discapacidades, respuesta_ia, feedback_estrellas, created_at')
    .eq('id', id)
    .single<ConsultaRow>();

  if (!data) notFound();

  const tags = data.discapacidades
    .map((did) => DISCAPACIDADES.find((d) => d.id === did))
    .filter((x): x is (typeof DISCAPACIDADES)[number] => Boolean(x));

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-[14px] bg-primary-bg p-4 text-sm text-primary">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span>📚 {data.materia}</span>
          <span aria-hidden>·</span>
          <span>📝 {data.contenido}</span>
          {tags.map((t) => (
            <span key={t.id} className="rounded-full bg-card px-2 py-0.5 text-xs">
              {t.icon} {t.label}
            </span>
          ))}
        </div>
      </div>

      {data.respuesta_ia ? (
        <GuideView markdown={data.respuesta_ia} />
      ) : (
        <p className="text-muted">Esta consulta aún no tiene respuesta generada.</p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Button asChild variant="outline">
          <Link href="/historial">Volver al historial</Link>
        </Button>
        <Button asChild>
          <Link href="/nueva-consulta">+ Nueva consulta</Link>
        </Button>
      </div>

      <FeedbackStars consultaId={data.id} initial={data.feedback_estrellas ?? 0} />
    </div>
  );
}

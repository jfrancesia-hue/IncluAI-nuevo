import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { GuideView } from '@/components/dashboard/guide-view';
import { GuideActions } from '@/components/dashboard/guide-actions';
import { RefinarBotones } from '@/components/dashboard/refinar-botones';
import { FeedbackStars } from '@/components/dashboard/feedback-stars';
import { Button } from '@/components/ui/button';
import { DISCAPACIDADES } from '@/data/discapacidades';
import { getEspecialidadById } from '@/data/especialidades';
import { getAreaFamiliaById } from '@/data/areas-familia';
import { RANGOS_EDAD } from '@/data/rangos-edad';

export const metadata = { title: 'Resultado · IncluIA' };

type SearchParams = Promise<{ id?: string }>;

type ConsultaRow = {
  id: string;
  modulo: 'docentes' | 'familias' | 'profesionales';
  datos_modulo: Record<string, unknown> | null;
  materia: string | null;
  contenido: string;
  discapacidades: string[];
  respuesta_ia: string | null;
  feedback_estrellas: number | null;
  created_at: string;
};

const MODULO_META: Record<ConsultaRow['modulo'], { icon: string; label: string; nuevaHref: string }> = {
  docentes: { icon: '📚', label: 'Guía para docente', nuevaHref: '/nueva-consulta' },
  familias: { icon: '🏠', label: 'Guía para familia', nuevaHref: '/familias/nueva-consulta' },
  profesionales: { icon: '⚕️', label: 'Guía profesional', nuevaHref: '/profesionales/nueva-consulta' },
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
    .select('id, modulo, datos_modulo, materia, contenido, discapacidades, respuesta_ia, feedback_estrellas, created_at')
    .eq('id', id)
    .single<ConsultaRow>();

  if (!data) notFound();

  const meta = MODULO_META[data.modulo] ?? MODULO_META.docentes;
  const tags = data.discapacidades
    .map((did) => DISCAPACIDADES.find((d) => d.id === did))
    .filter((x): x is (typeof DISCAPACIDADES)[number] => Boolean(x));

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-[14px] bg-primary-bg p-4 text-sm text-primary">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="font-semibold">
            {meta.icon} {meta.label}
          </span>
          <span aria-hidden>·</span>
          <SummaryBar row={data} />
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

      {data.respuesta_ia && (
        <GuideActions
          markdown={data.respuesta_ia}
          titulo={data.materia ?? meta.label}
        />
      )}

      {data.respuesta_ia && <RefinarBotones consultaId={data.id} />}

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end" data-no-print>
        <Button asChild variant="outline">
          <Link href="/historial">Volver al historial</Link>
        </Button>
        <Button asChild>
          <Link href={meta.nuevaHref}>+ Nueva guía</Link>
        </Button>
      </div>

      <FeedbackStars consultaId={data.id} initial={data.feedback_estrellas ?? 0} />
    </div>
  );
}

function SummaryBar({ row }: { row: ConsultaRow }) {
  if (row.modulo === 'docentes') {
    return (
      <>
        {row.materia && <span>📚 {row.materia}</span>}
        {row.materia && <span aria-hidden>·</span>}
        <span>📝 {row.contenido}</span>
      </>
    );
  }
  if (row.modulo === 'familias') {
    const dm = (row.datos_modulo ?? {}) as Record<string, unknown>;
    const edad = typeof dm.edad_rango === 'string' ? dm.edad_rango : undefined;
    const areas = Array.isArray(dm.areas_ayuda)
      ? (dm.areas_ayuda as string[]).map((a) => getAreaFamiliaById(a)?.label ?? a).slice(0, 3).join(', ')
      : '';
    const edadLabel = edad ? RANGOS_EDAD.find((r) => r.id === edad)?.label ?? edad : '';
    return (
      <>
        {edadLabel && <span>👶 {edadLabel}</span>}
        {areas && <span aria-hidden>·</span>}
        {areas && <span>{areas}</span>}
      </>
    );
  }
  if (row.modulo === 'profesionales') {
    const dm = (row.datos_modulo ?? {}) as Record<string, unknown>;
    const esp = typeof dm.especialidad === 'string' ? getEspecialidadById(dm.especialidad) : undefined;
    const edad = typeof dm.edad_paciente === 'string' ? dm.edad_paciente : undefined;
    const edadLabel = edad ? RANGOS_EDAD.find((r) => r.id === edad)?.label ?? edad : '';
    return (
      <>
        {esp && <span>{esp.icon} {esp.label}</span>}
        {edadLabel && <span aria-hidden>·</span>}
        {edadLabel && <span>paciente {edadLabel}</span>}
      </>
    );
  }
  return <span>{row.contenido}</span>;
}

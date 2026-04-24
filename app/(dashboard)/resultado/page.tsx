import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { GuideView } from '@/components/guide/guide-view';
import { GuideActions } from '@/components/guide/guide-actions';
import { RefinarBotones } from '@/components/guide/refinar-botones';
import { FeedbackStars } from '@/components/guide/feedback-stars';
import { StructuredGuideView } from '@/components/guide/structured/structured-guide-view';
import { RegenerarBanner } from '@/components/guide/regenerar-banner';
import { GuiaLayout } from '@/components/guia/GuiaLayout';
import { readStructuredGuide } from '@/lib/structure-guide';
import { isGuiaIncompleta } from '@/lib/guide-status';
import { GuiaPedagogicaSchema } from '@/lib/schemas/guia-schema';
import { DISCAPACIDADES } from '@/data/discapacidades';
import { getEspecialidadById } from '@/data/especialidades';
import { getAreaFamiliaById } from '@/data/areas-familia';
import { RANGOS_EDAD } from '@/data/rangos-edad';
import { PHOTOS } from '@/lib/photos';

export const metadata = { title: 'Resultado · IncluAI' };

type SearchParams = Promise<{ id?: string }>;

type ConsultaRow = {
  id: string;
  modulo: 'docentes' | 'familias' | 'profesionales';
  datos_modulo: Record<string, unknown> | null;
  materia: string | null;
  nivel: string | null;
  anio_grado: string | null;
  cantidad_alumnos: number | null;
  contenido: string;
  discapacidades: string[];
  respuesta_ia: string | null;
  respuesta_ia_estructurada: unknown;
  version_schema: string | null;
  feedback_estrellas: number | null;
  created_at: string;
};

const MODULO_META: Record<
  ConsultaRow['modulo'],
  { icon: string; label: string; nuevaHref: string }
> = {
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
        <h1 className="font-serif text-3xl text-[#1e3a5f]">Resultado</h1>
        <p className="text-[#5c6b7f]">
          Falta el parámetro <code>?id=</code>. Volvé al{' '}
          <Link href="/historial" className="text-[#15803d] underline">
            historial
          </Link>
          .
        </p>
      </div>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) notFound();

  const [{ data }, { data: perfilRow }] = await Promise.all([
    supabase
      .from('consultas')
      .select(
        'id, modulo, datos_modulo, materia, nivel, anio_grado, cantidad_alumnos, contenido, discapacidades, respuesta_ia, respuesta_ia_estructurada, version_schema, feedback_estrellas, created_at'
      )
      .eq('id', id)
      .eq('user_id', user.id)
      .single<ConsultaRow>(),
    supabase
      .from('perfiles')
      .select('plan')
      .eq('id', user.id)
      .single<{ plan: 'free' | 'pro' | 'institucional' }>(),
  ]);

  if (!data) notFound();
  const userPlan = perfilRow?.plan ?? 'free';

  const meta = MODULO_META[data.modulo] ?? MODULO_META.docentes;
  const tags = data.discapacidades
    .map((did) => DISCAPACIDADES.find((d) => d.id === did))
    .filter((x): x is (typeof DISCAPACIDADES)[number] => Boolean(x));

  const incompleta = isGuiaIncompleta(data);

  // v2.1: JSON estructurado enriquecido con multimedia — renderer nuevo.
  if (data.version_schema === '2.1' && data.respuesta_ia_estructurada) {
    const parsed = GuiaPedagogicaSchema.safeParse(data.respuesta_ia_estructurada);
    if (parsed.success) {
      return (
        <GuiaLayout
          guia={parsed.data}
          metadata={{
            id: data.id,
            modulo: data.modulo,
            materia: data.materia,
            nivel: data.nivel,
            anio_grado: data.anio_grado,
            cantidad_alumnos: data.cantidad_alumnos,
            discapacidades: data.discapacidades,
            feedback_estrellas: data.feedback_estrellas,
          }}
          userPlan={userPlan}
        />
      );
    }
    // Si el JSON está corrupto caemos al renderer estructurado legacy.
    console.warn('[resultado] v2.1 JSON inválido — fallback a structured-view', parsed.error);
  }

  // v1 estructurado (schema interno): structured-guide-view
  const structured = readStructuredGuide(data.datos_modulo);
  if (structured && data.respuesta_ia && !incompleta) {
    return (
      <StructuredGuideView
        guide={structured}
        markdown={data.respuesta_ia}
        consultaId={data.id}
        initialStars={data.feedback_estrellas ?? 0}
        createdAtIso={data.created_at}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div
        data-no-print
        className="sticky top-14 z-10 -mx-4 rounded-[14px] border-b border-[#e2e8f0] bg-[#e8f0fe]/95 px-4 py-3 text-xs text-[#1e3a5f] backdrop-blur sm:-mx-6 sm:px-6"
      >
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-3 gap-y-1">
          <span className="font-bold">
            {meta.icon} {meta.label}
          </span>
          <span aria-hidden className="text-[#5c6b7f]">·</span>
          <SummaryBar row={data} />
          {tags.map((t) => (
            <span
              key={t.id}
              className="rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold"
            >
              {t.icon} {t.label}
            </span>
          ))}
        </div>
      </div>

      <header className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-start sm:text-left">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[16px] sm:h-28 sm:w-28">
          <Image
            src={PHOTOS.guiaHeader}
            alt=""
            width={200}
            height={200}
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#1e3a5f] sm:text-3xl">
            {incompleta ? 'Tu guía quedó incompleta' : 'Tu guía inclusiva está lista ✨'}
          </h1>
          <p className="mt-1 text-sm text-[#5c6b7f]">
            {incompleta ? 'Generada parcialmente para' : 'Generada especialmente para'}{' '}
            <strong className="text-[#1e3a5f]">
              {data.materia ? `${data.materia} · ${data.contenido}` : data.contenido}
            </strong>
          </p>
        </div>
      </header>

      {incompleta && <RegenerarBanner consultaId={data.id} />}

      {data.respuesta_ia ? (
        <div className="overflow-hidden rounded-[20px] border border-[#e2e8f0] bg-white p-6 shadow-[0_4px_20px_rgba(15,34,64,0.06)] sm:p-8">
          <GuideView markdown={data.respuesta_ia} />
        </div>
      ) : (
        !incompleta && (
          <p className="text-[#5c6b7f]">
            Esta consulta aún no tiene respuesta generada.
          </p>
        )
      )}

      {data.respuesta_ia && !incompleta && (
        <GuideActions
          markdown={data.respuesta_ia}
          titulo={data.materia ?? meta.label}
        />
      )}

      {data.respuesta_ia && !incompleta && <RefinarBotones consultaId={data.id} />}

      {!incompleta && (
        <aside aria-label="Feedback de la guía" className="rounded-[20px] bg-[#fff7ed] p-6 text-center">
          <p className="font-serif text-lg font-bold text-[#1e3a5f]">
            ¿Esta guía te resultó útil para tu clase?
          </p>
          <p className="mt-1 text-xs text-[#5c6b7f]">
            Tu feedback nos ayuda a mejorar las guías
          </p>
          <div className="mt-4 flex justify-center">
            <FeedbackStars consultaId={data.id} initial={data.feedback_estrellas ?? 0} />
          </div>
        </aside>
      )}

      {!incompleta && (
        <div
          data-no-print
          className="flex flex-col gap-3 rounded-[20px] border-2 border-[#15803d] bg-[#f0fdf4] p-6 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p className="font-serif text-lg font-bold text-[#1e3a5f]">
              ¿Necesitás otra guía?
            </p>
            <p className="text-xs text-[#5c6b7f]">
              Otra clase, otro alumno, otro contenido.
            </p>
          </div>
          <Link
            href={meta.nuevaHref}
            className="inline-flex items-center justify-center rounded-[12px] bg-[#15803d] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#15803d]"
          >
            Nueva consulta →
          </Link>
        </div>
      )}

      <div data-no-print className="text-center">
        <Link
          href="/historial"
          className="text-xs text-[#5c6b7f] hover:text-[#1e3a5f] hover:underline"
        >
          ← Volver al historial
        </Link>
      </div>
    </div>
  );
}

function SummaryBar({ row }: { row: ConsultaRow }) {
  if (row.modulo === 'docentes') {
    return (
      <>
        {row.materia && <span>📚 {row.materia}</span>}
        {row.materia && <span aria-hidden className="text-[#5c6b7f]">·</span>}
        <span>📝 {row.contenido}</span>
      </>
    );
  }
  if (row.modulo === 'familias') {
    const dm = (row.datos_modulo ?? {}) as Record<string, unknown>;
    const edad = typeof dm.edad_rango === 'string' ? dm.edad_rango : undefined;
    const areas = Array.isArray(dm.areas_ayuda)
      ? (dm.areas_ayuda as string[])
          .map((a) => getAreaFamiliaById(a)?.label ?? a)
          .slice(0, 3)
          .join(', ')
      : '';
    const edadLabel = edad
      ? RANGOS_EDAD.find((r) => r.id === edad)?.label ?? edad
      : '';
    return (
      <>
        {edadLabel && <span>👶 {edadLabel}</span>}
        {areas && <span aria-hidden className="text-[#5c6b7f]">·</span>}
        {areas && <span>{areas}</span>}
      </>
    );
  }
  if (row.modulo === 'profesionales') {
    const dm = (row.datos_modulo ?? {}) as Record<string, unknown>;
    const esp =
      typeof dm.especialidad === 'string' ? getEspecialidadById(dm.especialidad) : undefined;
    const edad = typeof dm.edad_paciente === 'string' ? dm.edad_paciente : undefined;
    const edadLabel = edad
      ? RANGOS_EDAD.find((r) => r.id === edad)?.label ?? edad
      : '';
    return (
      <>
        {esp && (
          <span>
            {esp.icon} {esp.label}
          </span>
        )}
        {edadLabel && <span aria-hidden className="text-[#5c6b7f]">·</span>}
        {edadLabel && <span>paciente {edadLabel}</span>}
      </>
    );
  }
  return <span>{row.contenido}</span>;
}

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { PPIEditor } from '@/components/ppi/PPIEditor';
import type { PPIDocumento } from '@/lib/types/ppi';
import { RevealOnScroll } from '@/components/landing/RevealOnScroll';

export const dynamic = 'force-dynamic';

export default async function PPIDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) notFound();

  const { data: ppi } = await supabase
    .from('ppi_documentos')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single<PPIDocumento>();

  if (!ppi) notFound();

  return (
    <div>
      <Link
        href="/ppi"
        className="mb-6 inline-flex items-center gap-1 text-sm font-semibold text-[#042C53] transition hover:text-[#185FA5]"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        ← Volver al listado
      </Link>

      <RevealOnScroll>
        <header className="bento-card mb-6 flex flex-col items-start gap-3 rounded-[20px] border border-[#e2e8f0] bg-white p-6 shadow-[0_2px_12px_rgba(15,34,64,0.04)] sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span
              className="inline-flex items-center gap-1.5 rounded-full bg-[#D7EAF6] px-3 py-1 text-xs font-semibold uppercase text-[#042C53]"
              style={{
                fontFamily: 'var(--font-display)',
                letterSpacing: '0.08em',
              }}
            >
              📋 PPI
            </span>
            <h1
              className="mt-3 text-2xl font-bold text-[#1F2E3D]"
              style={{
                fontFamily: 'var(--font-display)',
                letterSpacing: '-0.02em',
              }}
            >
              {ppi.alumno_identificador}
            </h1>
            <p className="mt-1 text-sm text-[#4A5968]">
              {ppi.alumno_edad} años · {ppi.alumno_nivel}
              {ppi.alumno_anio_grado ? ` · ${ppi.alumno_anio_grado}` : ''} ·{' '}
              {ppi.institucion} · Ciclo {ppi.ciclo_lectivo}
            </p>
          </div>
          <Link
            href={`/ppi/${id}/imprimir`}
            target="_blank"
            className="magnetic-btn inline-flex items-center gap-2 rounded-[12px] bg-[#042C53] px-5 py-2.5 text-sm font-bold text-white"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            🖨 Versión imprimible
          </Link>
        </header>
      </RevealOnScroll>

      {ppi.estado === 'borrador' &&
        (!ppi.secciones || Object.keys(ppi.secciones).length === 0) && (
          <RevealOnScroll>
            <div
              role="status"
              className="mb-6 rounded-[16px] border border-[#fcd34d]/40 bg-[#fef3c7] p-4 text-sm text-[#854f0b]"
            >
              <strong style={{ fontFamily: 'var(--font-display)' }}>
                ⚠️ PPI sin generar.
              </strong>{' '}
              Podés intentar regenerar cada sección manualmente más abajo, o
              crear un nuevo PPI desde el listado.
            </div>
          </RevealOnScroll>
        )}

      <PPIEditor ppi={ppi} />
    </div>
  );
}

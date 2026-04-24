import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { PPIDocumento, PPISeccionKey } from '@/lib/types/ppi'
import { SECCIONES_ORDEN, SECCION_LABELS } from '@/lib/types/ppi'
import { findJurisdiccion } from '@/data/jurisdicciones-ar'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'PPI — Versión imprimible',
  robots: { index: false, follow: false },
}

export default async function PPIImprimirPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) notFound()

  const { data: ppi } = await supabase
    .from('ppi_documentos')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single<PPIDocumento>()
  if (!ppi) notFound()

  const { data: perfil } = await supabase
    .from('perfiles')
    .select('nombre, apellido, email, especialidad')
    .eq('id', user.id)
    .single<{
      nombre: string
      apellido: string
      email: string
      especialidad: string | null
    }>()

  const docenteNombre = perfil ? `${perfil.nombre} ${perfil.apellido}`.trim() : '—'
  const juris = findJurisdiccion(ppi.jurisdiccion)
  const tituloPPI = juris?.alias_ppi ?? 'Proyecto Pedagógico Individual (PPI)'
  const familia = ppi.familia_responsable

  return (
    <>
      <style>{`
        @page { size: A4; margin: 22mm 18mm; }
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          .ppi-page { box-shadow: none !important; border: none !important; }
        }
        body { background: #f4f5f7; }
        .ppi-page {
          max-width: 780px;
          margin: 24px auto;
          background: white;
          padding: 40px 48px;
          font-family: 'Inter', 'Times New Roman', serif;
          color: #111;
          line-height: 1.55;
          font-size: 12pt;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          border-radius: 8px;
        }
        .ppi-page h1 {
          font-size: 20pt;
          margin: 0 0 4px;
          letter-spacing: -0.01em;
          text-align: center;
          color: #042C53;
        }
        .ppi-page h2 {
          font-size: 13pt;
          margin: 22px 0 6px;
          border-bottom: 1px solid #042C53;
          padding-bottom: 2px;
          color: #042C53;
          page-break-after: avoid;
        }
        .ppi-header {
          text-align: center;
          margin-bottom: 20px;
          padding-bottom: 12px;
          border-bottom: 2px solid #042C53;
        }
        .ppi-header .sub {
          font-size: 10pt;
          color: #5c6b7f;
          margin-top: 4px;
        }
        .ppi-datos {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 6px 24px;
          font-size: 11pt;
          margin: 12px 0 20px;
        }
        .ppi-datos dt {
          font-weight: 600;
          color: #042C53;
        }
        .ppi-datos dd {
          margin: 0;
        }
        .ppi-seccion {
          page-break-inside: avoid;
          margin-bottom: 14px;
        }
        .ppi-seccion ul {
          padding-left: 22px;
          margin: 6px 0;
        }
        .ppi-seccion li {
          margin-bottom: 4px;
        }
        .ppi-firmas {
          margin-top: 44px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          page-break-inside: avoid;
        }
        .ppi-firmas .firma {
          border-top: 1px solid #111;
          padding-top: 6px;
          font-size: 10pt;
          text-align: center;
        }
        .ppi-footer {
          margin-top: 40px;
          padding-top: 12px;
          border-top: 1px solid #ccc;
          font-size: 8.5pt;
          color: #5c6b7f;
          line-height: 1.4;
        }
        .no-print {
          position: sticky;
          top: 0;
          background: white;
          border-bottom: 1px solid #e2e8f0;
          padding: 12px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: 10;
        }
        .no-print button {
          padding: 8px 16px;
          background: #042C53;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
        }
      `}</style>

      <div className="no-print">
        <strong>PPI — Versión imprimible</strong>
        <form>
          <button type="button" formAction="javascript:window.print()" onClick={() => {}}>
            Imprimir o guardar como PDF
          </button>
        </form>
      </div>

      <article className="ppi-page">
        <header className="ppi-header">
          <h1>{tituloPPI}</h1>
          <div className="sub">
            Conforme a Resolución CFE 311/16, Ley 26.206 y Ley 26.378
            {juris?.norma_provincial && <> — {juris.norma_provincial}</>}
          </div>
          <div className="sub" style={{ marginTop: 8, fontWeight: 600 }}>
            {ppi.institucion} — {juris?.nombre ?? 'Argentina'} — Ciclo lectivo {ppi.ciclo_lectivo}
          </div>
        </header>

        <dl className="ppi-datos">
          <dt>Estudiante (identificación interna)</dt>
          <dd>{ppi.alumno_identificador} — <em>completar nombre a mano</em></dd>

          <dt>Edad</dt>
          <dd>{ppi.alumno_edad} años</dd>

          <dt>Nivel</dt>
          <dd>{ppi.alumno_nivel}</dd>

          <dt>Año/Grado</dt>
          <dd>{ppi.alumno_anio_grado ?? '—'}</dd>

          <dt>Condición(es)</dt>
          <dd>{ppi.alumno_discapacidades.join(', ')}</dd>

          <dt>Período</dt>
          <dd>{ppi.periodo.replace(/_/g, ' ')}</dd>

          <dt>Docente responsable</dt>
          <dd>{docenteNombre}</dd>

          <dt>Fecha de elaboración</dt>
          <dd>
            {new Date(ppi.generado_at ?? ppi.created_at).toLocaleDateString('es-AR')}
          </dd>

          {ppi.requiere_interprete_lsa && (
            <>
              <dt>Intérprete LSA</dt>
              <dd>Requiere intérprete de Lengua de Señas Argentina</dd>
            </>
          )}

          {familia && (
            <>
              <dt>Familia/tutor responsable</dt>
              <dd>
                {familia.parentesco} ({familia.iniciales_o_alias}
                {familia.contacto_masked ? ` · ${familia.contacto_masked}` : ''})
              </dd>
            </>
          )}
        </dl>

        {SECCIONES_ORDEN.map((key: PPISeccionKey) => {
          const s = ppi.secciones[key]
          if (!s) return null
          return (
            <section key={key} className="ppi-seccion">
              <h2>{s.titulo || SECCION_LABELS[key]}</h2>
              {s.contenido && <p>{s.contenido}</p>}
              {s.puntos && s.puntos.length > 0 && (
                <ul>
                  {s.puntos.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              )}
            </section>
          )
        })}

        <div className="ppi-firmas">
          <div className="firma">
            {docenteNombre}
            <br />
            Docente responsable
          </div>
          <div className="firma">
            <br />
            Equipo directivo / Equipo de orientación escolar
          </div>
        </div>

        <footer className="ppi-footer">
          Documento generado con asistencia de IncluAI ({new Date().toLocaleDateString('es-AR')}).
          Requiere revisión, edición y firma del equipo docente y directivo.
          <br />
          <strong>Marco normativo nacional:</strong> Resolución CFE 311/16 (ejes prioritarios
          Anexo II · trayectorias educativas integrales de estudiantes con discapacidad),
          Ley 26.206 (Educación Nacional), Ley 26.378 (Convención sobre los Derechos de las
          Personas con Discapacidad), Ley 25.326 (Protección de Datos Personales).
          {juris?.norma_provincial && (
            <>
              <br />
              <strong>Marco normativo provincial:</strong> {juris.nombre} — {juris.norma_provincial}.
            </>
          )}
          <br />
          <em>
            Este documento cumple los ejes prioritarios del Anexo II de la Res. CFE 311/16.
            Si tu jurisdicción exige un formulario específico adicional, podés usar este PPI
            como base para trasladar el contenido al formato requerido por tu institución.
          </em>
        </footer>
      </article>
    </>
  )
}

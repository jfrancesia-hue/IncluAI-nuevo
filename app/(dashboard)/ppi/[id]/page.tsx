import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { PPIEditor } from '@/components/ppi/PPIEditor'
import type { PPIDocumento } from '@/lib/types/ppi'

export const dynamic = 'force-dynamic'

export default async function PPIDetallePage({
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

  return (
    <main style={{ maxWidth: 880, margin: '0 auto', padding: '32px 24px' }}>
      <nav style={{ marginBottom: 20 }}>
        <Link
          href="/ppi"
          style={{
            fontSize: 13,
            color: '#042C53',
            textDecoration: 'none',
            fontWeight: 600,
          }}
        >
          ← Volver al listado
        </Link>
      </nav>

      <header
        style={{
          background: 'white',
          border: '1px solid #e5e2d6',
          borderRadius: 12,
          padding: '20px 24px',
          marginBottom: 20,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 16,
          flexWrap: 'wrap',
        }}
      >
        <div>
          <h1 style={{ margin: '0 0 4px', fontSize: 22, color: '#042C53', fontWeight: 700 }}>
            PPI — {ppi.alumno_identificador}
          </h1>
          <div style={{ fontSize: 13, color: '#5c6b7f' }}>
            {ppi.alumno_edad} años · {ppi.alumno_nivel}
            {ppi.alumno_anio_grado ? ` · ${ppi.alumno_anio_grado}` : ''} · {ppi.institucion} · Ciclo{' '}
            {ppi.ciclo_lectivo}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link
            href={`/ppi/${id}/imprimir`}
            target="_blank"
            style={{
              padding: '10px 16px',
              background: '#042C53',
              color: 'white',
              borderRadius: 8,
              fontWeight: 600,
              fontSize: 13,
              textDecoration: 'none',
            }}
          >
            Ver versión imprimible
          </Link>
        </div>
      </header>

      {ppi.estado === 'borrador' && (!ppi.secciones || Object.keys(ppi.secciones).length === 0) && (
        <div
          role="status"
          style={{
            padding: 20,
            background: '#faeeda',
            color: '#854f0b',
            borderRadius: 12,
            marginBottom: 20,
          }}
        >
          El PPI quedó sin generar. Podés intentar regenerar cada sección manualmente más abajo, o
          crear un nuevo PPI desde el listado.
        </div>
      )}

      <PPIEditor ppi={ppi} />
    </main>
  )
}

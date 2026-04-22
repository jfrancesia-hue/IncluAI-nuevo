import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { checkPPILimit } from '@/lib/ppi/plan-limits'
import type { PPIDocumento } from '@/lib/types/ppi'
import { cicloLectivoActual } from '@/lib/types/ppi'

export const dynamic = 'force-dynamic'

const ESTADO_LABEL: Record<string, string> = {
  borrador: 'Borrador',
  completo: 'Listo para revisar',
  presentado: 'Presentado',
  archivado: 'Archivado',
}

export default async function PPIListadoPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const ciclo = cicloLectivoActual()
  const [{ data: ppis }, limit] = await Promise.all([
    supabase
      .from('ppi_documentos')
      .select(
        'id, alumno_identificador, alumno_edad, alumno_nivel, alumno_anio_grado, institucion, ciclo_lectivo, estado, created_at, updated_at'
      )
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(50)
      .returns<Array<Pick<PPIDocumento, 'id' | 'alumno_identificador' | 'alumno_edad' | 'alumno_nivel' | 'alumno_anio_grado' | 'institucion' | 'ciclo_lectivo' | 'estado' | 'created_at' | 'updated_at'>>>(),
    checkPPILimit(),
  ])

  const enCicloActual = (ppis ?? []).filter((p) => p.ciclo_lectivo === ciclo)

  return (
    <main style={{ maxWidth: 960, margin: '0 auto', padding: '32px 24px' }}>
      <header style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, margin: '0 0 4px', color: '#042C53' }}>
          Proyectos Pedagógicos Individuales
        </h1>
        <p style={{ color: '#5c6b7f', fontSize: 14, margin: 0 }}>
          Generá un PPI completo conforme a la Resolución CFE 311/16 en minutos. Ciclo lectivo{' '}
          <strong>{ciclo}</strong>.
        </p>
      </header>

      <section
        style={{
          background: 'linear-gradient(135deg, #042C53, #185FA5)',
          color: 'white',
          padding: '20px 24px',
          borderRadius: 12,
          marginBottom: 24,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 16,
          flexWrap: 'wrap',
        }}
      >
        <div>
          <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 4 }}>
            Plan {limit.plan.toUpperCase()} — Ciclo {ciclo}
          </div>
          <div style={{ fontSize: 18, fontWeight: 600 }}>
            {limit.ppis_usados} de {limit.limite} PPI{limit.limite === 1 ? '' : 's'} utilizado
            {limit.ppis_usados === 1 ? '' : 's'}
          </div>
          <div style={{ fontSize: 13, opacity: 0.85, marginTop: 4 }}>
            {limit.permitido
              ? `Te queda${limit.ppis_restantes === 1 ? '' : 'n'} ${limit.ppis_restantes} disponible${limit.ppis_restantes === 1 ? '' : 's'} este ciclo.`
              : 'Alcanzaste el límite del plan. Mejorá a Pro para más PPIs.'}
          </div>
        </div>
        {limit.permitido ? (
          <Link
            href="/ppi/nuevo"
            style={{
              background: 'white',
              color: '#042C53',
              padding: '10px 20px',
              borderRadius: 8,
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            + Crear nuevo PPI
          </Link>
        ) : (
          <Link
            href="/planes"
            style={{
              background: '#fac775',
              color: '#042C53',
              padding: '10px 20px',
              borderRadius: 8,
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            Mejorar a Pro
          </Link>
        )}
      </section>

      {enCicloActual.length === 0 ? (
        <div
          style={{
            padding: '40px 24px',
            background: '#f9f7f0',
            borderRadius: 12,
            textAlign: 'center',
            color: '#5c6b7f',
          }}
        >
          <p style={{ fontSize: 16, margin: '0 0 12px' }}>
            Aún no creaste ningún PPI en este ciclo lectivo.
          </p>
          <p style={{ fontSize: 14, margin: 0 }}>
            El PPI es el documento formal que presentás a la institución por cada alumno con
            discapacidad. IncluIA lo arma en base a tus observaciones en pocos minutos.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {enCicloActual.map((p) => (
            <article
              key={p.id}
              style={{
                background: 'white',
                border: '1px solid #e5e2d6',
                borderRadius: 12,
                padding: '16px 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 16,
              }}
            >
              <div>
                <div style={{ fontSize: 16, fontWeight: 600, color: '#042C53' }}>
                  {p.alumno_identificador}
                </div>
                <div style={{ fontSize: 13, color: '#5c6b7f', marginTop: 2 }}>
                  {p.alumno_edad} años · {p.alumno_nivel}
                  {p.alumno_anio_grado ? ` · ${p.alumno_anio_grado}` : ''} · {p.institucion}
                </div>
                <div style={{ fontSize: 11, color: '#888780', marginTop: 6 }}>
                  Actualizado {new Date(p.updated_at).toLocaleDateString('es-AR')}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span
                  style={{
                    padding: '4px 10px',
                    borderRadius: 999,
                    fontSize: 11,
                    fontWeight: 600,
                    background:
                      p.estado === 'presentado'
                        ? '#e1f5ee'
                        : p.estado === 'completo'
                          ? '#faeeda'
                          : '#fee4e2',
                    color:
                      p.estado === 'presentado'
                        ? '#1d9e75'
                        : p.estado === 'completo'
                          ? '#854f0b'
                          : '#b42318',
                  }}
                >
                  {ESTADO_LABEL[p.estado] ?? p.estado}
                </span>
                <Link
                  href={`/ppi/${p.id}`}
                  style={{
                    padding: '8px 14px',
                    background: '#042C53',
                    color: 'white',
                    borderRadius: 6,
                    fontSize: 13,
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}
                >
                  Abrir
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}

      <section style={{ marginTop: 40, padding: '20px 24px', background: '#f4f5f7', borderRadius: 12 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, margin: '0 0 8px', color: '#042C53' }}>
          ¿Qué es un PPI y por qué lo necesitás?
        </h2>
        <p style={{ fontSize: 13, lineHeight: 1.6, color: '#5c6b7f', margin: 0 }}>
          El <strong>Proyecto Pedagógico Individual</strong> es el documento formal que establece
          las configuraciones de apoyo, contenidos priorizados, adaptaciones metodológicas y
          criterios de evaluación para un estudiante con discapacidad. Es obligatorio según la{' '}
          <strong>Resolución CFE 311/16</strong> y lo presentás a la dirección de la escuela al
          comienzo del ciclo. IncluIA lo redacta en base a tus observaciones y el perfil del
          alumno — vos lo revisás, editás lo que quieras, y lo imprimís para firma.
        </p>
      </section>
    </main>
  )
}

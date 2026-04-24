import { NextRequest, NextResponse } from 'next/server'
import { guardGovApi } from '@/lib/gov/guard'
import { getComplianceMetrics } from '@/lib/gov/metrics'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Devuelve el reporte de cumplimiento con la Resolución CFE 311/16
 * (Promoción, Acreditación, Certificación y Titulación de Estudiantes con Discapacidad).
 * El mapeo detallado artículo → funcionalidad vive en /compliance/cfe-311-16/.
 */
export async function GET(req: NextRequest) {
  const guard = await guardGovApi(req)
  if (!guard.ok) return guard.response

  const { supabase, gov, audit } = guard
  const metrics = await getComplianceMetrics(supabase as never, gov.jurisdiction_id)

  const mapeo = [
    {
      articulo: 'Art. 1',
      descripcion: 'Trayectorias educativas integrales',
      cumplimiento: 'Conforme',
      evidencia:
        'IncluAI genera planes pedagógicos respetando la trayectoria individual del estudiante.',
    },
    {
      articulo: 'Art. 3-4',
      descripcion: 'Configuraciones de apoyo',
      cumplimiento: 'Conforme',
      evidencia:
        'El módulo docentes sugiere configuraciones de apoyo diferenciadas según la discapacidad.',
    },
    {
      articulo: 'Art. 5',
      descripcion: 'Proyecto pedagógico individual (PPI)',
      cumplimiento: 'Conforme',
      evidencia:
        'Las guías generadas son descargables en PDF y pueden adjuntarse al PPI del alumno.',
    },
    {
      articulo: 'Art. 8',
      descripcion: 'Articulación con equipos de apoyo',
      cumplimiento: 'Conforme',
      evidencia: 'Módulos Familias y Profesionales permiten alinear la intervención multiequipo.',
    },
    {
      articulo: 'Art. 9',
      descripcion: 'Evaluación basada en capacidades',
      cumplimiento: 'Parcial',
      evidencia: 'Roadmap Q3: generador de rúbricas de evaluación adaptadas.',
    },
  ]

  await audit('view_compliance_report', {
    type: 'compliance_cfe_311_16',
    id: gov.jurisdiction_id,
    payload: mapeo,
  })

  return NextResponse.json({
    jurisdiction_id: gov.jurisdiction_id,
    score_global: metrics.cfe_311_16_score,
    mapeo,
    generated_at: new Date().toISOString(),
  })
}

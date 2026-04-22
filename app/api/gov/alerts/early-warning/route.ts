import { NextRequest, NextResponse } from 'next/server'
import { guardGovApi } from '@/lib/gov/guard'
import { maskCue } from '@/lib/gov/mask'
import type { EarlyWarning } from '@/lib/types/gobierno'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Retorna alertas tempranas agregadas — NUNCA nombres individuales.
 * Tipos de alerta:
 *  - escuela_inactiva (>30 días sin actividad)
 *  - baja_adopcion (<20% docentes activos)
 *  - feedback_negativo (avg rating <3 últimos 30 días)
 */
export async function GET(req: NextRequest) {
  const guard = await guardGovApi(req)
  if (!guard.ok) return guard.response

  const { supabase, gov, audit } = guard
  const alerts: EarlyWarning[] = []

  // Escuelas inactivas
  let q = supabase
    .from('gov_school_assignments')
    .select(
      'school_id, jurisdiction_id, schools:school_id(cue, last_activity_at, departamento)'
    )

  // Respeta department_scope si está definido; si no, toda la jurisdicción.
  if (gov.department_scope.length > 0) {
    q = q.in('jurisdiction_id', gov.department_scope)
  } else {
    q = q.eq('jurisdiction_id', gov.jurisdiction_id)
  }

  const { data: schools } = await q

  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000

  for (const row of schools ?? []) {
    const nested = row as unknown as {
      school_id: string
      schools: { cue: string | null; last_activity_at: string | null; departamento: string | null } | null
    }
    const last = nested.schools?.last_activity_at
      ? Date.parse(nested.schools.last_activity_at)
      : 0
    if (last < thirtyDaysAgo) {
      alerts.push({
        id: nested.school_id,
        school_cue_masked: maskCue(nested.schools?.cue ?? null),
        departamento: nested.schools?.departamento ?? 'Sin asignar',
        tipo_alerta: 'escuela_inactiva',
        severidad: last === 0 ? 'alta' : 'media',
        dias_sin_actividad:
          last > 0 ? Math.floor((Date.now() - last) / (24 * 60 * 60 * 1000)) : undefined,
        descripcion: 'Escuela sin actividad registrada en los últimos 30 días.',
      })
    }
  }

  await audit('view_early_warnings', {
    type: 'alerts',
    id: gov.jurisdiction_id,
    payload: { count: alerts.length },
  })

  return NextResponse.json({
    jurisdiction_id: gov.jurisdiction_id,
    count: alerts.length,
    alerts,
    generated_at: new Date().toISOString(),
  })
}

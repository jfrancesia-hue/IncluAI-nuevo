import { NextRequest, NextResponse } from 'next/server'
import { guardGovApi } from '@/lib/gov/guard'
import type { HeatmapResponse, HeatmapCell } from '@/lib/types/gobierno'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const guard = await guardGovApi(req)
  if (!guard.ok) return guard.response

  const { supabase, gov, audit } = guard

  // Jurisdicciones hijas directas (departamentos).
  let depQuery = supabase
    .from('gov_jurisdictions')
    .select('id, name')
    .eq('parent_id', gov.jurisdiction_id)
    .eq('type', 'departamento')

  // Si el gov_user tiene department_scope, restringir a esos departamentos.
  if (gov.department_scope.length > 0) {
    depQuery = depQuery.in('id', gov.department_scope)
  }

  const { data: departamentos, error: errDeps } = await depQuery

  if (errDeps) {
    return NextResponse.json({ error: 'Error consultando jurisdicciones' }, { status: 500 })
  }

  // Agregaciones por departamento: schools_total y schools_active_30d.
  // Usamos gov_school_assignments + schools filtrado por activity reciente.
  const cells: HeatmapCell[] = []
  for (const dep of departamentos ?? []) {
    const { data: schools } = await supabase
      .from('gov_school_assignments')
      .select('schools:school_id(id, last_activity_at)')
      .eq('jurisdiction_id', dep.id)

    const total = schools?.length ?? 0
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000

    let active = 0
    for (const row of schools ?? []) {
      const nested = (row as unknown as { schools: { last_activity_at: string | null } | null })
        .schools
      const ts = nested?.last_activity_at ? Date.parse(nested.last_activity_at) : 0
      if (ts >= thirtyDaysAgo) active++
    }

    cells.push({
      departamento: dep.name as string,
      departamento_id: dep.id as string,
      schools_total: total,
      schools_active: active,
      cobertura_pct: total > 0 ? Math.round((active / total) * 100) : 0,
    })
  }

  const response: HeatmapResponse = {
    jurisdiction_id: gov.jurisdiction_id,
    cells,
    generated_at: new Date().toISOString(),
  }

  await audit('view_coverage_heatmap', {
    type: 'heatmap',
    id: gov.jurisdiction_id,
    payload: cells,
  })

  return NextResponse.json(response)
}

import { NextRequest, NextResponse } from 'next/server'
import { guardGovApi } from '@/lib/gov/guard'
import {
  getCoverageMetrics,
  getImpactMetrics,
  getComplianceMetrics,
  buildDashboardKPIs,
} from '@/lib/gov/metrics'
import type { DashboardResponse } from '@/lib/types/gobierno'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const guard = await guardGovApi(req)
  if (!guard.ok) return guard.response

  const { supabase, gov, audit } = guard

  const { data: jurisdiction, error } = await supabase
    .from('gov_jurisdictions')
    .select('id, name, type')
    .eq('id', gov.jurisdiction_id)
    .single()

  if (error || !jurisdiction) {
    return NextResponse.json(
      { error: 'Jurisdicción no encontrada' },
      { status: 404 }
    )
  }

  const [coverage, impact, compliance] = await Promise.all([
    getCoverageMetrics(supabase as never, gov.jurisdiction_id),
    getImpactMetrics(supabase as never, gov.jurisdiction_id),
    getComplianceMetrics(supabase as never, gov.jurisdiction_id),
  ])

  const kpis = buildDashboardKPIs(coverage, impact, compliance)

  const response: DashboardResponse = {
    jurisdiction: {
      id: jurisdiction.id as string,
      name: jurisdiction.name as string,
      type: jurisdiction.type as never,
    },
    snapshot_date: new Date().toISOString().slice(0, 10),
    kpis,
    coverage,
    impact,
    compliance,
    last_refresh: new Date().toISOString(),
  }

  await audit('view_dashboard', {
    type: 'dashboard',
    id: gov.jurisdiction_id,
    payload: kpis,
  })

  return NextResponse.json(response, {
    headers: { 'Cache-Control': 'private, max-age=60' },
  })
}

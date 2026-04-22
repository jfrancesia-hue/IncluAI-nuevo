import { NextRequest, NextResponse } from 'next/server'
import { guardGovApi } from '@/lib/gov/guard'
import { getImpactMetrics } from '@/lib/gov/metrics'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const guard = await guardGovApi(req)
  if (!guard.ok) return guard.response

  const { supabase, gov, audit } = guard
  const metrics = await getImpactMetrics(supabase as never, gov.jurisdiction_id)

  await audit('view_impact_indicators', {
    type: 'impact_metrics',
    id: gov.jurisdiction_id,
    payload: metrics,
  })

  return NextResponse.json(
    {
      jurisdiction_id: gov.jurisdiction_id,
      snapshot_date: new Date().toISOString().slice(0, 10),
      ...metrics,
    },
    { headers: { 'Cache-Control': 'private, max-age=60' } }
  )
}

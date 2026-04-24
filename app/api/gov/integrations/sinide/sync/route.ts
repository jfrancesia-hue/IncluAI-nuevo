import { NextRequest, NextResponse } from 'next/server'
import { guardGovApi } from '@/lib/gov/guard'
import { syncToSinide } from '@/lib/integraciones/sinide'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Sincronización unidireccional IncluAI → SINIDE.
 * STUB: el cliente real requiere credenciales que se firman por convenio.
 * Por ahora valida permisos y devuelve preview de lo que se exportaría.
 */
export async function POST(req: NextRequest) {
  const guard = await guardGovApi(req)
  if (!guard.ok) return guard.response

  const { gov, audit, supabase } = guard

  if (gov.role !== 'gov_admin') {
    return NextResponse.json(
      { error: 'Solo gov_admin puede iniciar sincronizaciones con SINIDE.' },
      { status: 403 }
    )
  }

  const result = await syncToSinide(supabase as never, gov.jurisdiction_id)

  await audit('sync_integration_sinide', {
    type: 'integration_sync',
    id: gov.jurisdiction_id,
    payload: result,
  })

  return NextResponse.json(result)
}

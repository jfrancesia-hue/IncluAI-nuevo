import { NextRequest, NextResponse } from 'next/server'
import { guardGovApi } from '@/lib/gov/guard'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Cada gov_user puede consultar su propio log de auditoría (transparencia).
 * RLS garantiza que NO ve las acciones de otros gov_users.
 */
export async function GET(req: NextRequest) {
  const guard = await guardGovApi(req)
  if (!guard.ok) return guard.response

  const { supabase, gov } = guard

  const url = new URL(req.url)
  const limit = Math.min(Number(url.searchParams.get('limit')) || 100, 500)

  const { data, error } = await supabase
    .from('gov_audit_log')
    .select('id, action, resource_type, resource_id, ip_address, occurred_at')
    .eq('gov_user_id', gov.id)
    .order('occurred_at', { ascending: false })
    .limit(limit)

  if (error) {
    return NextResponse.json({ error: 'Error consultando auditoría' }, { status: 500 })
  }

  return NextResponse.json({
    count: data?.length ?? 0,
    entries: data ?? [],
  })
}

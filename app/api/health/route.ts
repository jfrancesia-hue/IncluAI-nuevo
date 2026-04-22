import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { HealthCheck } from '@/lib/observability'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

async function checkSupabase(): Promise<HealthCheck> {
  const start = Date.now()
  try {
    const supabase = await createClient()
    const { error } = await supabase.from('perfiles').select('id').limit(1)
    const latency = Date.now() - start
    if (error) return { name: 'supabase', status: 'down', latency_ms: latency, detail: error.message }
    return {
      name: 'supabase',
      status: latency > 800 ? 'degraded' : 'ok',
      latency_ms: latency,
    }
  } catch (err) {
    return {
      name: 'supabase',
      status: 'down',
      latency_ms: Date.now() - start,
      detail: err instanceof Error ? err.message : String(err),
    }
  }
}

async function checkAnthropic(): Promise<HealthCheck> {
  return {
    name: 'anthropic',
    status: process.env.ANTHROPIC_API_KEY ? 'ok' : 'degraded',
    latency_ms: 0,
    detail: process.env.ANTHROPIC_API_KEY ? undefined : 'ANTHROPIC_API_KEY no configurada',
  }
}

export async function GET() {
  const [supabase, anthropic] = await Promise.all([checkSupabase(), checkAnthropic()])

  const overall = [supabase, anthropic].every((c) => c.status === 'ok')
    ? 'ok'
    : [supabase, anthropic].some((c) => c.status === 'down')
      ? 'down'
      : 'degraded'

  return NextResponse.json(
    {
      status: overall,
      timestamp: new Date().toISOString(),
      version: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? 'dev',
      checks: [supabase, anthropic],
    },
    {
      status: overall === 'down' ? 503 : 200,
      headers: { 'Cache-Control': 'no-store' },
    }
  )
}

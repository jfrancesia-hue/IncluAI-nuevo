import 'server-only'
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'node:crypto'
import { createClient } from '@/lib/supabase/server'
import { checkRateLimit } from '@/lib/rate-limit'
import type { GovRole, GovAuditAction } from '@/lib/types/gobierno'

type Supabase = Awaited<ReturnType<typeof createClient>>

export type GovGuardOK = {
  ok: true
  user: { id: string; email?: string | null }
  gov: {
    id: string
    jurisdiction_id: string
    role: GovRole
    department_scope: string[]
  }
  supabase: Supabase
  /**
   * Registra una acción de auditoría contra gov_audit_log.
   * Llamar DESPUÉS de servir la data (o al menos antes de devolver la response).
   */
  audit: (
    action: GovAuditAction,
    resource?: { type?: string; id?: string; payload?: unknown }
  ) => Promise<void>
}

export type GovGuardFail = {
  ok: false
  response: NextResponse
}

/**
 * Guard para endpoints /api/gov/*.
 *  - Verifica sesión Supabase.
 *  - Rate-limit (Upstash si está disponible).
 *  - Valida que el usuario exista en gov_users y esté activo.
 *  - Devuelve helpers de jurisdicción + auditoría.
 *
 * El llamador es responsable de invocar `audit(...)` por cada acceso a datos.
 */
export async function guardGovApi(req: NextRequest): Promise<GovGuardOK | GovGuardFail> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return {
      ok: false,
      response: NextResponse.json({ error: 'No autorizado' }, { status: 401 }),
    }
  }

  const rl = await checkRateLimit(`gov:${user.id}`)
  if (!rl.success) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: 'Demasiadas solicitudes en poco tiempo.' },
        { status: 429, headers: { 'Retry-After': '60' } }
      ),
    }
  }

  const { data: govUser, error } = await supabase
    .from('gov_users')
    .select('id, jurisdiction_id, role, department_scope')
    .eq('user_id', user.id)
    .single()

  if (error || !govUser) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: 'Acceso gubernamental no habilitado para esta cuenta.' },
        { status: 403 }
      ),
    }
  }

  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    req.headers.get('x-real-ip') ||
    null
  const ua = req.headers.get('user-agent') || null

  const audit: GovGuardOK['audit'] = async (action, resource) => {
    const payloadHash =
      resource?.payload !== undefined
        ? crypto
            .createHash('sha256')
            .update(JSON.stringify(resource.payload))
            .digest('hex')
        : null

    const { error } = await supabase.rpc('registrar_auditoria_gov', {
      p_action: action,
      p_resource_type: resource?.type ?? null,
      p_resource_id: resource?.id ?? null,
      p_ip_address: ip,
      p_user_agent: ua,
      p_payload_hash: payloadHash,
    })

    if (error) {
      // Auditoría es obligatoria por compliance (Ley 25.326). Si falla, se propaga.
      console.error('[gov-audit] fallo crítico al registrar auditoría', {
        action,
        govUserId: govUser.id,
        errorMessage: error instanceof Error ? error.message : String(error),
      })
      throw new Error('Fallo de auditoría obligatoria — operación abortada.')
    }
  }

  return {
    ok: true,
    user: { id: user.id, email: user.email },
    gov: {
      id: govUser.id as string,
      jurisdiction_id: govUser.jurisdiction_id as string,
      role: govUser.role as GovRole,
      department_scope: (govUser.department_scope as string[] | null) ?? [],
    },
    supabase,
    audit,
  }
}

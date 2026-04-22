import 'server-only'

/**
 * Feature flags con PostHog (opcional).
 * Si no hay POSTHOG_KEY, cae a variables de entorno con prefijo NEXT_PUBLIC_FLAG_*.
 *
 * Para activar PostHog completo:
 *   npm i posthog-node posthog-js
 *   Configurar POSTHOG_KEY y POSTHOG_HOST en env
 *
 * Uso:
 *   const enabled = await isFeatureEnabled('nuevo_onboarding', userId)
 */

type FlagContext = {
  userId?: string
  tipo_usuario?: string
  plan?: string
  jurisdiction_id?: string
}

type PosthogLike = {
  isFeatureEnabled: (flag: string, distinctId: string, opts?: unknown) => Promise<boolean>
  getFeatureFlag: (flag: string, distinctId: string, opts?: unknown) => Promise<string | boolean | undefined>
  capture: (opts: { distinctId: string; event: string; properties?: Record<string, unknown> }) => void
}

let _posthog: PosthogLike | null | false = null

async function getPosthog(): Promise<PosthogLike | null> {
  if (_posthog === false) return null
  if (_posthog) return _posthog
  if (!process.env.POSTHOG_KEY) {
    _posthog = false
    return null
  }
  try {
    const mod = (await import(
      // @ts-expect-error — dependencia opcional, puede no estar instalada
      /* webpackIgnore: true */ /* turbopackIgnore: true */ 'posthog-node'
    )) as {
      PostHog?: new (key: string, opts?: unknown) => PosthogLike
    }
    if (!mod?.PostHog) {
      _posthog = false
      return null
    }
    _posthog = new mod.PostHog(process.env.POSTHOG_KEY, {
      host: process.env.POSTHOG_HOST ?? 'https://app.posthog.com',
    }) as PosthogLike
    return _posthog
  } catch {
    _posthog = false
    return null
  }
}

function envFallback(flag: string): boolean {
  const key = `NEXT_PUBLIC_FLAG_${flag.toUpperCase().replace(/[^A-Z0-9]/g, '_')}`
  const value = process.env[key]
  return value === 'true' || value === '1'
}

export async function isFeatureEnabled(flag: string, ctx: FlagContext): Promise<boolean> {
  const posthog = await getPosthog()
  if (!posthog) return envFallback(flag)

  const distinctId = ctx.userId ?? 'anonymous'
  try {
    return await posthog.isFeatureEnabled(flag, distinctId, {
      personProperties: {
        tipo_usuario: ctx.tipo_usuario,
        plan: ctx.plan,
        jurisdiction_id: ctx.jurisdiction_id,
      },
    })
  } catch {
    return envFallback(flag)
  }
}

export async function getFeatureVariant(flag: string, ctx: FlagContext): Promise<string | null> {
  const posthog = await getPosthog()
  if (!posthog) return null
  const distinctId = ctx.userId ?? 'anonymous'
  try {
    const v = await posthog.getFeatureFlag(flag, distinctId)
    return typeof v === 'string' ? v : null
  } catch {
    return null
  }
}

export async function captureProductEvent(
  event: string,
  ctx: FlagContext,
  properties?: Record<string, unknown>
): Promise<void> {
  const posthog = await getPosthog()
  if (!posthog) return
  posthog.capture({
    distinctId: ctx.userId ?? 'anonymous',
    event,
    properties: {
      ...properties,
      tipo_usuario: ctx.tipo_usuario,
      plan: ctx.plan,
      jurisdiction_id: ctx.jurisdiction_id,
    },
  })
}

/** Flags en uso — mantener acá el inventario para evitar flag rot. */
export const KNOWN_FLAGS = [
  'nuevo_onboarding_familias',
  'guia_renderer_v2',
  'gov_heatmap_experimental',
  'admin_evals_dashboard',
] as const

export type KnownFlag = (typeof KNOWN_FLAGS)[number]

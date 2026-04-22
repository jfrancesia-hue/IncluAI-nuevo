/**
 * Capa de observabilidad minimalista.
 * Se integra con Sentry si SENTRY_DSN está configurado.
 * Si no, hace console.error/warn para no forzar dependencia.
 *
 * Para activar Sentry completo:
 *   npm i @sentry/nextjs
 *   npx @sentry/wizard@latest -i nextjs
 *   agregar SENTRY_DSN al .env
 */

type ErrorContext = {
  user_id?: string
  action?: string
  resource?: string
  severity?: 'low' | 'medium' | 'high' | 'critical'
  tags?: Record<string, string>
  extra?: Record<string, unknown>
}

type SentryLike = {
  captureException: (err: unknown, ctx?: unknown) => void
  captureMessage: (msg: string, level?: string) => void
}

let _sentry: SentryLike | null = null

async function getSentry(): Promise<SentryLike | null> {
  if (!process.env.SENTRY_DSN) return null
  if (_sentry) return _sentry
  try {
    const mod = (await import('@sentry/nextjs' as string).catch(() => null)) as unknown as {
      captureException: SentryLike['captureException']
      captureMessage: SentryLike['captureMessage']
    } | null
    if (!mod) return null
    _sentry = mod
    return mod
  } catch {
    return null
  }
}

export async function captureError(err: unknown, ctx?: ErrorContext): Promise<void> {
  const sentry = await getSentry()
  if (sentry) {
    sentry.captureException(err, { tags: ctx?.tags, extra: { ...ctx?.extra, severity: ctx?.severity } })
    return
  }
  console.error('[observability]', ctx?.action ?? 'error', err, ctx ?? {})
}

export async function captureEvent(
  message: string,
  level: 'info' | 'warning' | 'error' = 'info',
  ctx?: ErrorContext
): Promise<void> {
  const sentry = await getSentry()
  if (sentry) {
    sentry.captureMessage(message, level)
    return
  }
  const fn = level === 'error' ? console.error : level === 'warning' ? console.warn : console.info
  fn('[observability]', message, ctx ?? {})
}

export type HealthCheck = {
  name: string
  status: 'ok' | 'degraded' | 'down'
  latency_ms: number
  detail?: string
}

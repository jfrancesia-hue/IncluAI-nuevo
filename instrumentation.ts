// Next.js 15+ instrumentation hook
// Se ejecuta antes del primer request. Ideal para inicializar Sentry, OpenTelemetry, etc.
export async function register() {
  if (!process.env.SENTRY_DSN) return

  try {
    // Evita fallar el build si @sentry/nextjs no está instalado.
    const sentry = (await import('@sentry/nextjs' as string).catch(() => null)) as {
      init?: (cfg: unknown) => void
    } | null
    if (!sentry?.init) return

    sentry.init({
      dsn: process.env.SENTRY_DSN,
      tracesSampleRate: 0.1,
      profilesSampleRate: 0.1,
      environment: process.env.VERCEL_ENV ?? 'development',
      release: process.env.VERCEL_GIT_COMMIT_SHA,
      ignoreErrors: [
        // Ruidos comunes de navegador que no son accionables
        'ResizeObserver loop limit exceeded',
        'Non-Error promise rejection captured',
      ],
    })
  } catch (err) {
    console.warn('[instrumentation] Sentry init falló:', err)
  }
}

export async function onRequestError(
  err: unknown,
  request: { path: string; method: string; headers: Record<string, string> },
  context: { routerKind: 'Pages Router' | 'App Router'; routePath: string; routeType: 'render' | 'route' | 'action' | 'middleware' }
) {
  console.error('[onRequestError]', context.routePath, err)
  if (!process.env.SENTRY_DSN) return
  try {
    const sentry = (await import('@sentry/nextjs' as string).catch(() => null)) as {
      captureRequestError?: (err: unknown, req: unknown, ctx: unknown) => void
    } | null
    sentry?.captureRequestError?.(err, request, context)
  } catch {}
}

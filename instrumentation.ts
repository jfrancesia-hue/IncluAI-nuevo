// Next.js instrumentation hook — se ejecuta antes del primer request.
// Ideal para inicializar Sentry, OpenTelemetry, etc.
//
// Los imports de @sentry/nextjs son dinámicos y opcionales: si el paquete no
// está instalado (caso por defecto en este repo) el bundler los omite y el
// sistema corre sin observabilidad externa.

type SentryInitModule = { init?: (cfg: unknown) => void }
type SentryRequestErrorModule = {
  captureRequestError?: (err: unknown, req: unknown, ctx: unknown) => void
}

async function loadSentry<T>(): Promise<T | null> {
  if (!process.env.SENTRY_DSN) return null
  try {
    // @ts-expect-error — dependencia opcional, puede no estar instalada
    return (await import(/* webpackIgnore: true */ /* turbopackIgnore: true */ '@sentry/nextjs')) as T
  } catch {
    return null
  }
}

export async function register() {
  const sentry = await loadSentry<SentryInitModule>()
  if (!sentry?.init) return

  try {
    sentry.init({
      dsn: process.env.SENTRY_DSN,
      tracesSampleRate: 0.1,
      profilesSampleRate: 0.1,
      environment: process.env.VERCEL_ENV ?? 'development',
      release: process.env.VERCEL_GIT_COMMIT_SHA,
      ignoreErrors: [
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
  context: {
    routerKind: 'Pages Router' | 'App Router'
    routePath: string
    routeType: 'render' | 'route' | 'action' | 'middleware'
  }
) {
  console.error('[onRequestError]', context.routePath, err)
  const sentry = await loadSentry<SentryRequestErrorModule>()
  sentry?.captureRequestError?.(err, request, context)
}

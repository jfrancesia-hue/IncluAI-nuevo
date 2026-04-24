import 'server-only';

// Logging estructurado de errores.
//
// Escribe a console.error en formato JSON: Vercel Logs y cualquier log drain
// (Datadog, Axiom, Better Stack) pueden parsear estos objetos directamente.
//
// Si process.env.SENTRY_DSN está definida y @sentry/nextjs está instalado,
// instrumentation.ts ya inicializó Sentry — acá hacemos forward opcional.

export type ErrorContext = {
  /** Endpoint, server action o job que capturó el error. Ej: "api/generar-guia-v2". */
  source: string;
  /** ID del usuario autenticado, si aplica. Ayuda a reproducir. */
  userId?: string;
  /** Request-id, payment-id, consulta-id, etc. para correlacionar. */
  correlationId?: string;
  /** Metadata adicional serializable (sin PII). */
  metadata?: Record<string, unknown>;
};

type SerializedError = {
  name: string;
  message: string;
  stack?: string;
  cause?: unknown;
};

function serializeError(err: unknown): SerializedError {
  if (err instanceof Error) {
    return {
      name: err.name,
      message: err.message,
      stack: err.stack,
      cause: err.cause,
    };
  }
  if (typeof err === 'string') {
    return { name: 'StringError', message: err };
  }
  try {
    return { name: 'UnknownError', message: JSON.stringify(err) };
  } catch {
    return { name: 'UnknownError', message: String(err) };
  }
}

export function logError(err: unknown, context: ErrorContext): void {
  const serialized = serializeError(err);
  const payload = {
    level: 'error' as const,
    timestamp: new Date().toISOString(),
    source: context.source,
    userId: context.userId,
    correlationId: context.correlationId,
    metadata: context.metadata,
    error: serialized,
    env: process.env.VERCEL_ENV ?? 'development',
    release: process.env.VERCEL_GIT_COMMIT_SHA,
  };

  console.error(JSON.stringify(payload));

  // Forward a Sentry si está configurado. Dynamic import para no sumar peso
  // al bundle cuando el paquete no está instalado.
  if (process.env.SENTRY_DSN) {
    void forwardToSentry(err, context).catch(() => {
      // silencio: ya logueamos local, no queremos loop de errores
    });
  }
}

async function forwardToSentry(err: unknown, context: ErrorContext): Promise<void> {
  try {
    // @ts-expect-error — dependencia opcional
    const sentry = await import(/* webpackIgnore: true */ /* turbopackIgnore: true */ '@sentry/nextjs');
    if (typeof sentry?.captureException === 'function') {
      sentry.captureException(err, {
        tags: { source: context.source },
        user: context.userId ? { id: context.userId } : undefined,
        extra: {
          correlationId: context.correlationId,
          ...context.metadata,
        },
      });
    }
  } catch {
    // paquete no instalado o falla — ignoramos
  }
}

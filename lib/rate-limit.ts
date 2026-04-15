import 'server-only';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Rate limiting con Upstash Redis. Solo se activa si hay credenciales,
// así dev local sigue funcionando sin Upstash configurado.

let limiter: Ratelimit | null = null;

function getLimiter(): Ratelimit | null {
  if (limiter) return limiter;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  const redis = new Redis({ url, token });
  limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '1 m'),
    analytics: true,
    prefix: 'inclua:generar',
  });
  return limiter;
}

export type RateLimitResult = {
  success: boolean;
  remaining: number;
  reset: number;
};

export async function checkRateLimit(identifier: string): Promise<RateLimitResult> {
  const l = getLimiter();
  if (!l) {
    // Sin Upstash configurado: pasa siempre (dev / preview).
    return { success: true, remaining: 99, reset: 0 };
  }
  const r = await l.limit(identifier);
  return { success: r.success, remaining: r.remaining, reset: r.reset };
}

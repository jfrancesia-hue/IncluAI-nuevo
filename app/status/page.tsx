import { headers } from 'next/headers';
import { LogoLockup } from '@/components/branding/LogoLockup';

export const dynamic = 'force-dynamic';

type HealthResponse = {
  status: 'ok' | 'degraded' | 'down';
  timestamp: string;
  version: string;
  checks: Array<{
    name: string;
    status: 'ok' | 'degraded' | 'down';
    latency_ms: number;
    detail?: string;
  }>;
};

export const metadata = {
  title: 'IncluAI · Estado del servicio',
  description:
    'Estado operativo de IncluAI en tiempo real. Latencia y disponibilidad por componente.',
};

async function fetchHealth(): Promise<HealthResponse | null> {
  try {
    const h = await headers();
    const host = h.get('host') ?? 'localhost:3000';
    const proto = h.get('x-forwarded-proto') ?? 'http';
    const res = await fetch(`${proto}://${host}/api/health`, {
      cache: 'no-store',
    });
    if (!res.ok && res.status !== 503) return null;
    return (await res.json()) as HealthResponse;
  } catch {
    return null;
  }
}

const STATUS_TONE = {
  ok: { color: '#27AE60', bg: '#D6F0E0', label: 'Operativo' },
  degraded: { color: '#92400e', bg: '#fef3c7', label: 'Degradado' },
  down: { color: '#b42318', bg: '#fee4e2', label: 'Caído' },
} as const;

export default async function StatusPage() {
  const data = await fetchHealth();

  return (
    <div className="min-h-screen bg-[#0a1a30] text-white">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0"
        style={{ filter: 'blur(80px)', opacity: 0.4 }}
      >
        <div
          style={{
            position: 'absolute',
            top: '0%',
            left: '0%',
            width: '40%',
            height: '40%',
            background:
              'radial-gradient(circle, rgba(46,134,193,0.5), transparent 60%)',
            animation: 'mesh-orb-1 22s ease-in-out infinite',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '30%',
            right: '0%',
            width: '40%',
            height: '40%',
            background:
              'radial-gradient(circle, rgba(39,174,96,0.4), transparent 60%)',
            animation: 'mesh-orb-2 26s ease-in-out infinite',
          }}
        />
      </div>

      <header className="relative border-b border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-5">
          <LogoLockup
            href="/"
            size="md"
            tone="dark"
            logoVariant="white"
            gradientId="status-logo"
          />
          <span className="text-xs text-white/60">Status page</span>
        </div>
      </header>

      <main className="relative mx-auto max-w-4xl px-6 py-16">
        <span
          className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold uppercase backdrop-blur"
          style={{
            fontFamily: 'var(--font-display)',
            letterSpacing: '0.08em',
          }}
        >
          <span
            className="kpi-dot"
            style={{
              background: data ? STATUS_TONE[data.status].color : '#b42318',
            }}
          />
          Estado del servicio
        </span>

        <h1
          className="mt-5 text-4xl font-extrabold sm:text-5xl"
          style={{
            fontFamily: 'var(--font-display)',
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
          }}
        >
          {data
            ? data.status === 'ok'
              ? 'Todos los sistemas operativos'
              : data.status === 'degraded'
                ? 'Degradación parcial'
                : 'Incidente en curso'
            : 'No se pudo consultar el estado'}
        </h1>

        <p className="mt-3 text-sm text-white/70">
          Última verificación:{' '}
          {data ? new Date(data.timestamp).toLocaleString('es-AR') : '—'}
          {data && ` · Versión ${data.version}`}
        </p>

        {!data && (
          <div className="mt-8 rounded-[16px] border border-red-400/30 bg-red-500/10 p-5 text-sm text-red-200">
            No se pudo consultar el estado. Intentá recargar en unos segundos.
          </div>
        )}

        {data && (
          <>
            <h2
              className="mt-12 text-xl font-bold"
              style={{
                fontFamily: 'var(--font-display)',
                letterSpacing: '-0.02em',
              }}
            >
              Componentes
            </h2>
            <ul className="mt-4 flex flex-col gap-2">
              {data.checks.map((c) => {
                const tone = STATUS_TONE[c.status];
                return (
                  <li
                    key={c.name}
                    className="bento-card flex items-center justify-between rounded-[14px] border border-white/10 bg-white/5 p-4 backdrop-blur"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="kpi-dot"
                        style={{ background: tone.color }}
                      />
                      <div>
                        <p
                          className="text-sm font-bold"
                          style={{ fontFamily: 'var(--font-display)' }}
                        >
                          {c.name}
                        </p>
                        {c.detail && (
                          <p className="mt-0.5 text-xs text-white/60">
                            {c.detail}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase"
                        style={{
                          fontFamily: 'var(--font-display)',
                          background: tone.bg,
                          color: tone.color,
                          letterSpacing: '0.06em',
                        }}
                      >
                        {tone.label}
                      </span>
                      <p
                        className="mt-1 text-xs text-white/60"
                        style={{ fontVariantNumeric: 'tabular-nums' }}
                      >
                        {c.latency_ms} ms
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </>
        )}

        <footer className="mt-16 border-t border-white/10 pt-6 text-xs text-white/50">
          <p>SLO: 99.5% uptime mensual · p95 latencia &lt; 800 ms</p>
          <p className="mt-2">IncluAI · Nativos Consultora Digital</p>
        </footer>
      </main>
    </div>
  );
}

import { headers } from 'next/headers'

export const dynamic = 'force-dynamic'

type HealthResponse = {
  status: 'ok' | 'degraded' | 'down'
  timestamp: string
  version: string
  checks: Array<{ name: string; status: 'ok' | 'degraded' | 'down'; latency_ms: number; detail?: string }>
}

export const metadata = {
  title: 'IncluAI · Estado del servicio',
  description: 'Estado operativo de IncluAI en tiempo real. Latencia y disponibilidad por componente.',
}

async function fetchHealth(): Promise<HealthResponse | null> {
  try {
    const h = await headers()
    const host = h.get('host') ?? 'localhost:3000'
    const proto = h.get('x-forwarded-proto') ?? 'http'
    const res = await fetch(`${proto}://${host}/api/health`, { cache: 'no-store' })
    if (!res.ok && res.status !== 503) return null
    return (await res.json()) as HealthResponse
  } catch {
    return null
  }
}

export default async function StatusPage() {
  const data = await fetchHealth()
  const statusColor = (s: string) =>
    s === 'ok' ? '#27AE60' : s === 'degraded' ? '#854f0b' : '#b42318'

  return (
    <main style={{ maxWidth: 680, margin: '0 auto', padding: '48px 24px', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <h1 style={{ fontSize: 32, fontWeight: 700, margin: '0 0 8px' }}>Estado del servicio</h1>
      <p style={{ color: '#4A5968', margin: '0 0 32px' }}>
        Última verificación: {data ? new Date(data.timestamp).toLocaleString('es-AR') : '—'}
      </p>

      {!data && (
        <div style={{ padding: 16, background: '#fee4e2', borderRadius: 8, color: '#b42318' }}>
          No se pudo consultar el estado. Intentá recargar en unos segundos.
        </div>
      )}

      {data && (
        <>
          <div
            style={{
              padding: 20,
              borderRadius: 12,
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              marginBottom: 16,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  background: statusColor(data.status),
                  display: 'inline-block',
                }}
                aria-hidden="true"
              />
              <strong style={{ fontSize: 20, color: statusColor(data.status) }}>
                {data.status === 'ok'
                  ? 'Todos los sistemas operativos'
                  : data.status === 'degraded'
                    ? 'Degradación parcial'
                    : 'Incidente en curso'}
              </strong>
            </div>
            <div style={{ color: '#4A5968', marginTop: 8, fontSize: 13 }}>
              Versión {data.version}
            </div>
          </div>

          <h2 style={{ fontSize: 18, fontWeight: 600, margin: '24px 0 12px' }}>Componentes</h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {data.checks.map((c) => (
              <li
                key={c.name}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 16px',
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: 8,
                  marginBottom: 8,
                }}
              >
                <div>
                  <div style={{ fontWeight: 500 }}>{c.name}</div>
                  {c.detail && (
                    <div style={{ fontSize: 12, color: '#4A5968', marginTop: 2 }}>{c.detail}</div>
                  )}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: statusColor(c.status),
                    }}
                  >
                    {c.status.toUpperCase()}
                  </span>
                  <div style={{ fontSize: 12, color: '#4A5968' }}>{c.latency_ms} ms</div>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      <p style={{ fontSize: 12, color: '#4A5968', marginTop: 48 }}>
        SLO: 99.5% uptime mensual · p95 latencia &lt; 800 ms · IncluAI · Nativos Consultora Digital
      </p>
    </main>
  )
}

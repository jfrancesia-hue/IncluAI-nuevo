'use client'

import { useState } from 'react'
import type { ReportGenerateRequest, ReportGenerateResponse } from '@/lib/types/gobierno'

type Kind = ReportGenerateRequest['kind']

const KINDS: Array<{ id: Kind; label: string; descripcion: string }> = [
  {
    id: 'pdf_ejecutivo',
    label: 'PDF ejecutivo (1 página)',
    descripcion: 'Listo para enviar a prensa o al Gobernador.',
  },
  {
    id: 'pdf_tecnico',
    label: 'PDF técnico (5-10 páginas)',
    descripcion: 'Metodología e indicadores para Concejo Deliberante.',
  },
  {
    id: 'xlsx_dataset',
    label: 'Dataset CSV anonimizado',
    descripcion: 'Para investigadores académicos.',
  },
  {
    id: 'png_infografia',
    label: 'Infografía SVG',
    descripcion: 'Para redes sociales del Ministerio.',
  },
]

export function ReporteForm() {
  const [kind, setKind] = useState<Kind>('pdf_ejecutivo')
  const today = new Date().toISOString().slice(0, 10)
  const firstDay = today.slice(0, 8) + '01'
  const [from, setFrom] = useState(firstDay)
  const [to, setTo] = useState(today)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ReportGenerateResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch('/api/gov/reports/generate', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          kind,
          jurisdiction_id: '', // el backend lo valida contra gov_users; el campo se usa por prolijidad
          period_from: from,
          period_to: to,
        }),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({ error: 'Error desconocido' }))
        throw new Error(body.error || `HTTP ${res.status}`)
      }

      const data = (await res.json()) as ReportGenerateResponse
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
        <legend style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
          Tipo de reporte
        </legend>
        <div style={{ display: 'grid', gap: 8 }}>
          {KINDS.map((k) => (
            <label
              key={k.id}
              style={{
                border: `1px solid ${kind === k.id ? 'var(--gov-primary)' : 'var(--gov-border)'}`,
                borderRadius: 8,
                padding: '10px 14px',
                display: 'flex',
                gap: 10,
                cursor: 'pointer',
              }}
            >
              <input
                type="radio"
                name="kind"
                value={k.id}
                checked={kind === k.id}
                onChange={() => setKind(k.id)}
              />
              <span>
                <strong>{k.label}</strong>
                <br />
                <span style={{ color: 'var(--gov-text-muted)', fontSize: 13 }}>
                  {k.descripcion}
                </span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <label>
          <div style={{ fontSize: 13, marginBottom: 4 }}>Desde</div>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            style={{ width: '100%', padding: 8, border: '1px solid var(--gov-border)', borderRadius: 6 }}
          />
        </label>
        <label>
          <div style={{ fontSize: 13, marginBottom: 4 }}>Hasta</div>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            style={{ width: '100%', padding: 8, border: '1px solid var(--gov-border)', borderRadius: 6 }}
          />
        </label>
      </div>

      <div>
        <button type="submit" className="gov-btn gov-btn--primary" disabled={loading}>
          {loading ? 'Generando…' : 'Generar reporte'}
        </button>
      </div>

      {error && (
        <div className="gov-badge gov-badge--crit" role="alert" style={{ padding: '8px 12px' }}>
          {error}
        </div>
      )}

      {result && (
        <div
          role="status"
          style={{
            background: 'var(--gov-ok-bg)',
            color: 'var(--gov-ok)',
            padding: 14,
            borderRadius: 8,
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Reporte listo</div>
          <div style={{ fontSize: 13 }}>
            {(result.size_bytes / 1024).toFixed(1)} KB · expira{' '}
            {new Date(result.expires_at).toLocaleString('es-AR')}
          </div>
          <a
            href={result.url}
            download
            className="gov-btn gov-btn--primary"
            style={{ marginTop: 8, textDecoration: 'none' }}
          >
            Descargar
          </a>
        </div>
      )}
    </form>
  )
}

'use client'

import { useState } from 'react'
import type { PPIDocumento, PPISeccion, PPISeccionKey } from '@/lib/types/ppi'
import { SECCIONES_ORDEN, SECCION_LABELS } from '@/lib/types/ppi'

export function PPIEditor({ ppi }: { ppi: PPIDocumento }) {
  const [secciones, setSecciones] = useState(ppi.secciones)
  const [regenerating, setRegenerating] = useState<PPISeccionKey | null>(null)
  const [estado, setEstado] = useState(ppi.estado)
  const [error, setError] = useState<string | null>(null)

  async function regenerar(key: PPISeccionKey) {
    setRegenerating(key)
    setError(null)
    try {
      const instruccion = window.prompt(
        `Instrucción adicional para regenerar "${SECCION_LABELS[key]}" (opcional):`,
        ''
      )
      const res = await fetch(`/api/ppi/${ppi.id}/regenerar-seccion`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          seccion: key,
          instruccion_adicional: instruccion || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error regenerando')
      setSecciones((prev) => ({ ...prev, [key]: data.contenido as PPISeccion }))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setRegenerating(null)
    }
  }

  async function marcarPresentado() {
    await fetch(`/api/ppi/${ppi.id}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ estado: 'presentado' }),
    })
    setEstado('presentado')
  }

  return (
    <div>
      {error && (
        <div
          role="alert"
          style={{
            padding: '10px 14px',
            background: '#fee4e2',
            color: '#b42318',
            borderRadius: 8,
            marginBottom: 16,
            fontSize: 13,
          }}
        >
          {error}
        </div>
      )}

      {SECCIONES_ORDEN.map((key) => {
        const s = secciones[key]
        const isLoading = regenerating === key
        return (
          <section
            key={key}
            style={{
              background: 'white',
              border: '1px solid #e5e2d6',
              borderRadius: 12,
              padding: '18px 22px',
              marginBottom: 12,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 10,
                gap: 12,
              }}
            >
              <h2 style={{ fontSize: 16, fontWeight: 700, color: '#042C53', margin: 0 }}>
                {s?.titulo || SECCION_LABELS[key]}
              </h2>
              <button
                type="button"
                onClick={() => regenerar(key)}
                disabled={isLoading}
                style={{
                  padding: '6px 12px',
                  fontSize: 12,
                  fontWeight: 600,
                  background: 'transparent',
                  color: '#042C53',
                  border: '1px solid #dde3ec',
                  borderRadius: 6,
                  cursor: isLoading ? 'wait' : 'pointer',
                }}
              >
                {isLoading ? 'Regenerando…' : 'Regenerar con IA'}
              </button>
            </div>

            {s ? (
              <>
                {s.contenido && (
                  <p style={{ fontSize: 14, lineHeight: 1.65, color: '#1f1f1d', margin: '0 0 8px' }}>
                    {s.contenido}
                  </p>
                )}
                {s.puntos && s.puntos.length > 0 && (
                  <ul style={{ paddingLeft: 20, margin: 0, fontSize: 14, lineHeight: 1.6 }}>
                    {s.puntos.map((p, i) => (
                      <li key={i} style={{ marginBottom: 4 }}>
                        {p}
                      </li>
                    ))}
                  </ul>
                )}
              </>
            ) : (
              <p style={{ color: '#888780', fontSize: 13, fontStyle: 'italic', margin: 0 }}>
                Sin contenido. Hacé clic en &quot;Regenerar con IA&quot; para que se genere.
              </p>
            )}
          </section>
        )
      })}

      <div
        style={{
          marginTop: 20,
          padding: 16,
          background: estado === 'presentado' ? '#e1f5ee' : '#f9f7f0',
          borderRadius: 12,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 16,
          flexWrap: 'wrap',
        }}
      >
        <div style={{ fontSize: 13, color: '#5c6b7f' }}>
          {estado === 'presentado' ? (
            <>
              <strong style={{ color: '#1d9e75' }}>✓ Presentado.</strong> Este PPI ya fue marcado
              como presentado a la institución.
            </>
          ) : (
            <>
              Cuando imprimas y firmes este PPI con la dirección, marcalo como presentado para
              llevar registro.
            </>
          )}
        </div>
        {estado !== 'presentado' && (
          <button
            type="button"
            onClick={marcarPresentado}
            style={{
              padding: '10px 16px',
              background: '#1d9e75',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              fontWeight: 600,
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            Marcar como presentado
          </button>
        )}
      </div>
    </div>
  )
}

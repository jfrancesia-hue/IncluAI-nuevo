'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type DiscapacidadOpt = { id: string; label: string }
type JurisdiccionOpt = { id: string; nombre: string }

type FamiliaResp = {
  parentesco: 'madre' | 'padre' | 'tutor' | 'otro'
  iniciales_o_alias: string
  contacto_masked: string
  ocupacion: string
}

export function PPIWizard({
  discapacidades,
  jurisdicciones,
  cicloLectivoDefault,
}: {
  discapacidades: DiscapacidadOpt[]
  jurisdicciones: JurisdiccionOpt[]
  cicloLectivoDefault: string
}) {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    alumno_identificador: '',
    alumno_edad: 8,
    alumno_nivel: 'primaria' as 'inicial' | 'primaria' | 'secundaria',
    alumno_anio_grado: '',
    alumno_discapacidades: [] as string[],
    alumno_diagnostico: '',
    institucion: '',
    jurisdiccion: 'bsas',
    ciclo_lectivo: cicloLectivoDefault,
    periodo: 'anual' as 'anual' | 'primer_cuatrimestre' | 'segundo_cuatrimestre' | 'trimestral',
    fortalezas_observadas: '',
    barreras_observadas: '',
    contexto_familiar: '',
    equipo_externo: '',
    familia_responsable: {
      parentesco: 'madre' as FamiliaResp['parentesco'],
      iniciales_o_alias: '',
      contacto_masked: '',
      ocupacion: '',
    },
    requiere_interprete_lsa: false,
  })

  function update<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((f) => ({ ...f, [k]: v }))
  }

  function toggleDiscap(id: string) {
    setForm((f) => {
      const next = f.alumno_discapacidades.includes(id)
        ? f.alumno_discapacidades.filter((x) => x !== id)
        : [...f.alumno_discapacidades, id]
      // Si agregan/quitan "auditiva" sugerimos LSA (el docente puede desmarcar).
      const sugerirLsa = next.includes('auditiva') ? true : f.requiere_interprete_lsa
      return { ...f, alumno_discapacidades: next, requiere_interprete_lsa: sugerirLsa }
    })
  }

  function canContinueStep1(): boolean {
    return (
      form.alumno_identificador.trim().length >= 1 &&
      form.alumno_identificador.length <= 40 &&
      form.alumno_edad >= 3 &&
      form.alumno_edad <= 25 &&
      form.alumno_discapacidades.length > 0
    )
  }

  function canContinueStep2(): boolean {
    return form.institucion.trim().length >= 2 && /^\d{4}$/.test(form.ciclo_lectivo)
  }

  function canContinueStep3(): boolean {
    return (
      form.fortalezas_observadas.trim().length >= 20 &&
      form.barreras_observadas.trim().length >= 20
    )
  }

  async function submit() {
    setLoading(true)
    setError(null)
    try {
      const body = {
        ...form,
        familia_responsable: form.familia_responsable.iniciales_o_alias
          ? form.familia_responsable
          : null,
      }
      const res = await fetch('/api/ppi/crear', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Error creando PPI')
      }
      router.push(`/ppi/${data.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      setLoading(false)
    }
  }

  return (
    <div style={container}>
      <StepIndicator step={step} />

      {step === 1 && (
        <section style={stepSection}>
          <h2 style={stepTitle}>1. Datos del estudiante</h2>
          <p style={warn}>
            ⚠ No ingreses el nombre completo del alumno. Usá iniciales o un pseudónimo (ej:
            &quot;M.G.&quot; o &quot;Alumno A&quot;). Cuando imprimas el PPI, lo completás a mano.
          </p>

          <label style={label}>
            Identificador del alumno
            <input
              type="text"
              value={form.alumno_identificador}
              onChange={(e) => update('alumno_identificador', e.target.value)}
              placeholder="Ej: M.G. — Alumno A"
              maxLength={40}
              style={input}
            />
          </label>

          <div style={row}>
            <label style={label}>
              Edad
              <input
                type="number"
                min={3}
                max={25}
                value={form.alumno_edad}
                onChange={(e) => update('alumno_edad', Number(e.target.value))}
                style={input}
              />
            </label>

            <label style={label}>
              Nivel
              <select
                value={form.alumno_nivel}
                onChange={(e) =>
                  update('alumno_nivel', e.target.value as typeof form.alumno_nivel)
                }
                style={input}
              >
                <option value="inicial">Inicial</option>
                <option value="primaria">Primaria</option>
                <option value="secundaria">Secundaria</option>
              </select>
            </label>

            <label style={label}>
              Año/Grado
              <input
                type="text"
                value={form.alumno_anio_grado}
                onChange={(e) => update('alumno_anio_grado', e.target.value)}
                placeholder='Ej: 5° grado'
                style={input}
              />
            </label>
          </div>

          <div style={label}>
            Discapacidad / condición
            <div style={chipWrap}>
              {discapacidades.map((d) => {
                const on = form.alumno_discapacidades.includes(d.id)
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => toggleDiscap(d.id)}
                    style={{
                      ...chip,
                      background: on ? '#042C53' : 'white',
                      color: on ? 'white' : '#042C53',
                      borderColor: on ? '#042C53' : '#dde3ec',
                    }}
                  >
                    {d.label}
                  </button>
                )
              })}
            </div>
          </div>

          <label style={label}>
            Diagnóstico o CUD (opcional)
            <textarea
              value={form.alumno_diagnostico}
              onChange={(e) => update('alumno_diagnostico', e.target.value)}
              rows={2}
              placeholder="Ej: CUD emitido 2024, diagnóstico TEA grado 1"
              style={{ ...input, resize: 'vertical' }}
            />
          </label>

          <Nav
            onNext={() => setStep(2)}
            canNext={canContinueStep1()}
          />
        </section>
      )}

      {step === 2 && (
        <section style={stepSection}>
          <h2 style={stepTitle}>2. Institución y período</h2>

          <label style={label}>
            Nombre de la institución
            <input
              type="text"
              value={form.institucion}
              onChange={(e) => update('institucion', e.target.value)}
              placeholder="Ej: Escuela N° 19 Bernardino Rivadavia"
              style={input}
            />
          </label>

          <label style={label}>
            Jurisdicción
            <select
              value={form.jurisdiccion}
              onChange={(e) => update('jurisdiccion', e.target.value)}
              style={input}
            >
              {jurisdicciones.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.nombre}
                </option>
              ))}
            </select>
            <small style={charCount}>
              Ajusta el alias del PPI y la norma provincial que se cita al pie del documento.
            </small>
          </label>

          <div style={row}>
            <label style={label}>
              Ciclo lectivo
              <input
                type="text"
                value={form.ciclo_lectivo}
                onChange={(e) => update('ciclo_lectivo', e.target.value)}
                style={input}
              />
            </label>

            <label style={label}>
              Período
              <select
                value={form.periodo}
                onChange={(e) => update('periodo', e.target.value as typeof form.periodo)}
                style={input}
              >
                <option value="anual">Anual</option>
                <option value="primer_cuatrimestre">Primer cuatrimestre</option>
                <option value="segundo_cuatrimestre">Segundo cuatrimestre</option>
                <option value="trimestral">Trimestral</option>
              </select>
            </label>
          </div>

          {form.alumno_discapacidades.includes('auditiva') && (
            <label
              style={{
                display: 'flex',
                gap: 10,
                padding: 12,
                background: '#e6f1fb',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 500,
                color: '#042C53',
                cursor: 'pointer',
                alignItems: 'flex-start',
              }}
            >
              <input
                type="checkbox"
                checked={form.requiere_interprete_lsa}
                onChange={(e) => update('requiere_interprete_lsa', e.target.checked)}
                style={{ marginTop: 2 }}
              />
              <span>
                <strong>Requiere intérprete de Lengua de Señas Argentina (LSA)</strong>
                <br />
                <span style={{ fontWeight: 400, color: '#4A5968' }}>
                  Obligatorio según el Anexo II de la Res. CFE 311/16 cuando aplica.
                </span>
              </span>
            </label>
          )}

          <Nav
            onBack={() => setStep(1)}
            onNext={() => setStep(3)}
            canNext={canContinueStep2()}
          />
        </section>
      )}

      {step === 3 && (
        <section style={stepSection}>
          <h2 style={stepTitle}>3. Tus observaciones</h2>
          <p style={help}>
            Cuanto más concreto, mejor será el PPI. Pensá en lo que ves en el aula día a día.
          </p>

          <label style={label}>
            Fortalezas que observás
            <textarea
              value={form.fortalezas_observadas}
              onChange={(e) => update('fortalezas_observadas', e.target.value)}
              rows={4}
              placeholder="Ej: responde muy bien a material visual, memoriza fácilmente canciones, tiene interés profundo por los animales..."
              style={{ ...input, resize: 'vertical' }}
            />
            <small style={charCount}>{form.fortalezas_observadas.length}/2000 — mínimo 20 caracteres</small>
          </label>

          <label style={label}>
            Barreras que detectás en el aula
            <textarea
              value={form.barreras_observadas}
              onChange={(e) => update('barreras_observadas', e.target.value)}
              rows={4}
              placeholder="Ej: se le dificulta seguir consignas largas; los cambios de rutina le generan angustia; el aula tiene mucho estímulo auditivo..."
              style={{ ...input, resize: 'vertical' }}
            />
            <small style={charCount}>{form.barreras_observadas.length}/2000 — mínimo 20 caracteres</small>
          </label>

          <Nav
            onBack={() => setStep(2)}
            onNext={() => setStep(4)}
            canNext={canContinueStep3()}
          />
        </section>
      )}

      {step === 4 && (
        <section style={stepSection}>
          <h2 style={stepTitle}>4. Contexto (opcional)</h2>
          <p style={help}>
            Estos campos son opcionales pero enriquecen mucho el PPI. Si no los sabés, seguí adelante.
          </p>

          <label style={label}>
            Contexto familiar
            <textarea
              value={form.contexto_familiar}
              onChange={(e) => update('contexto_familiar', e.target.value)}
              rows={3}
              placeholder="Ej: familia muy presente en el proceso, 2 hermanos mayores, mamá maestra..."
              style={{ ...input, resize: 'vertical' }}
            />
          </label>

          <fieldset style={{ border: '1px solid #e5e2d6', padding: 12, borderRadius: 8, margin: 0 }}>
            <legend style={{ padding: '0 6px', fontSize: 13, fontWeight: 600, color: '#042C53' }}>
              Familia / tutor responsable (Anexo II CFE 311/16)
            </legend>
            <p style={{ ...help, margin: '4px 0 10px' }}>
              Sin nombre completo. Usá iniciales o alias. Campos opcionales.
            </p>
            <div style={row}>
              <label style={label}>
                Parentesco
                <select
                  value={form.familia_responsable.parentesco}
                  onChange={(e) =>
                    update('familia_responsable', {
                      ...form.familia_responsable,
                      parentesco: e.target.value as FamiliaResp['parentesco'],
                    })
                  }
                  style={input}
                >
                  <option value="madre">Madre</option>
                  <option value="padre">Padre</option>
                  <option value="tutor">Tutor/a legal</option>
                  <option value="otro">Otro</option>
                </select>
              </label>
              <label style={label}>
                Iniciales o alias
                <input
                  type="text"
                  value={form.familia_responsable.iniciales_o_alias}
                  onChange={(e) =>
                    update('familia_responsable', {
                      ...form.familia_responsable,
                      iniciales_o_alias: e.target.value,
                    })
                  }
                  placeholder='Ej: S.G. (mamá)'
                  maxLength={40}
                  style={input}
                />
              </label>
              <label style={label}>
                Contacto (enmascarado)
                <input
                  type="text"
                  value={form.familia_responsable.contacto_masked}
                  onChange={(e) =>
                    update('familia_responsable', {
                      ...form.familia_responsable,
                      contacto_masked: e.target.value,
                    })
                  }
                  placeholder='Ej: 11-****-5432'
                  style={input}
                />
              </label>
            </div>
          </fieldset>

          <label style={label}>
            Equipo externo de apoyo
            <textarea
              value={form.equipo_externo}
              onChange={(e) => update('equipo_externo', e.target.value)}
              rows={3}
              placeholder="Ej: fonoaudióloga 2x/semana, TO mensual, acompañante terapéutica..."
              style={{ ...input, resize: 'vertical' }}
            />
          </label>

          {error && (
            <div role="alert" style={errorBox}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
            <button type="button" onClick={() => setStep(3)} style={btnGhost} disabled={loading}>
              ← Atrás
            </button>
            <button type="button" onClick={submit} style={btnPrimary} disabled={loading}>
              {loading ? 'Generando PPI…' : 'Generar PPI con IA'}
            </button>
          </div>
          {loading && (
            <p style={{ ...help, marginTop: 12 }}>
              Esto tarda entre 20 y 60 segundos. Estamos redactando las 10 secciones del PPI
              conforme a la Res. CFE 311/16…
            </p>
          )}
        </section>
      )}
    </div>
  )
}

function StepIndicator({ step }: { step: 1 | 2 | 3 | 4 }) {
  return (
    <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
      {[1, 2, 3, 4].map((n) => (
        <div
          key={n}
          style={{
            flex: 1,
            height: 4,
            borderRadius: 2,
            background: n <= step ? '#042C53' : '#dde3ec',
            transition: 'background 180ms ease',
          }}
        />
      ))}
    </div>
  )
}

function Nav({
  onBack,
  onNext,
  canNext,
}: {
  onBack?: () => void
  onNext: () => void
  canNext: boolean
}) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
      {onBack ? (
        <button type="button" onClick={onBack} style={btnGhost}>
          ← Atrás
        </button>
      ) : (
        <span />
      )}
      <button type="button" onClick={onNext} style={btnPrimary} disabled={!canNext}>
        Continuar →
      </button>
    </div>
  )
}

// ---- Estilos inline (coherentes con paleta esperanza) ----

const container: React.CSSProperties = {
  background: 'white',
  border: '1px solid #e5e2d6',
  borderRadius: 12,
  padding: 24,
}
const stepSection: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 14 }
const stepTitle: React.CSSProperties = { margin: '0 0 8px', fontSize: 18, fontWeight: 700, color: '#042C53' }
const label: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  fontSize: 13,
  fontWeight: 600,
  color: '#042C53',
}
const input: React.CSSProperties = {
  padding: '8px 10px',
  border: '1px solid #dde3ec',
  borderRadius: 6,
  fontSize: 14,
  fontWeight: 400,
  fontFamily: 'inherit',
  color: '#111',
}
const row: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }
const chipWrap: React.CSSProperties = { display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }
const chip: React.CSSProperties = {
  padding: '6px 12px',
  border: '1px solid',
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'background 120ms ease',
}
const help: React.CSSProperties = { fontSize: 13, color: '#4A5968', margin: 0 }
const warn: React.CSSProperties = {
  background: '#faeeda',
  color: '#854f0b',
  padding: '10px 12px',
  borderRadius: 8,
  fontSize: 13,
  margin: 0,
}
const charCount: React.CSSProperties = { color: '#888780', fontSize: 11, fontWeight: 400 }
const errorBox: React.CSSProperties = {
  background: '#fee4e2',
  color: '#b42318',
  padding: '10px 12px',
  borderRadius: 8,
  fontSize: 13,
  marginTop: 12,
}
const btnPrimary: React.CSSProperties = {
  padding: '10px 20px',
  background: '#042C53',
  color: 'white',
  border: 'none',
  borderRadius: 8,
  fontSize: 14,
  fontWeight: 600,
  cursor: 'pointer',
}
const btnGhost: React.CSSProperties = {
  padding: '10px 16px',
  background: 'transparent',
  color: '#042C53',
  border: '1px solid #dde3ec',
  borderRadius: 8,
  fontSize: 14,
  fontWeight: 600,
  cursor: 'pointer',
}

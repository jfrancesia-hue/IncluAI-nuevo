'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { NIVELES, getNivelById, getAniosDisponibles } from '@/data/niveles';
import { getMateriasPorNivel } from '@/data/materias';
import { DISCAPACIDADES } from '@/data/discapacidades';
import type { FormularioConsulta, SituacionApoyo } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Alert } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { GuideView } from '../guide/guide-view';
import { consumirSSE } from './sse';
import { PLANTILLAS_DOCENTE } from '@/data/plantillas-docente';
import { cn } from '@/lib/utils';

type Step = 1 | 2 | 3 | 'generando';

const estadoInicial: FormularioConsulta = {
  nivel_id: '',
  subnivel_id: '',
  anio_grado: '',
  materia: '',
  contenido: '',
  discapacidades: [],
  cantidad_alumnos: 1,
  situacion_apoyo: 'sin_apoyo',
  contexto_aula: '',
  objetivo_clase: '',
};

export function ConsultaWizard() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormularioConsulta>(estadoInicial);
  const [error, setError] = useState<string | null>(null);
  const [streamText, setStreamText] = useState('');
  const [consultaId, setConsultaId] = useState<string | null>(null);

  const nivel = useMemo(
    () => (form.nivel_id ? getNivelById(form.nivel_id) : undefined),
    [form.nivel_id]
  );
  const subniveles = nivel?.subniveles ?? [];
  const anios = useMemo(
    () => getAniosDisponibles(form.nivel_id, form.subnivel_id),
    [form.nivel_id, form.subnivel_id]
  );
  const materias = useMemo(
    () => (form.nivel_id ? getMateriasPorNivel(form.nivel_id) : []),
    [form.nivel_id]
  );

  function update<K extends keyof FormularioConsulta>(
    key: K,
    value: FormularioConsulta[K]
  ) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function toggleDiscapacidad(id: string) {
    setForm((f) => ({
      ...f,
      discapacidades: f.discapacidades.includes(id)
        ? f.discapacidades.filter((x) => x !== id)
        : [...f.discapacidades, id],
    }));
  }

  function validarPaso(n: Step): string | null {
    if (n === 1) {
      if (!form.nivel_id) return 'Elegí un nivel educativo';
      if (subniveles.length && !form.subnivel_id) return 'Elegí un ciclo / subnivel';
      if (!form.anio_grado) return 'Elegí año / grado / sala';
      if (!form.materia) return 'Elegí una materia';
      if (form.contenido.trim().length < 5)
        return 'Describí el contenido con más detalle (mín. 5 caracteres)';
    }
    if (n === 2) {
      if (form.discapacidades.length === 0)
        return 'Seleccioná al menos una discapacidad';
      if (form.cantidad_alumnos < 1) return 'La cantidad de alumnos debe ser ≥ 1';
    }
    return null;
  }

  async function submit() {
    setError(null);
    const err = validarPaso(1) || validarPaso(2);
    if (err) {
      setError(err);
      return;
    }
    setStep('generando');
    setStreamText('');
    setConsultaId(null);

    let acumulado = '';
    let streamError: string | null = null;
    try {
      const res = await fetch('/api/generar-guia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? 'Error generando la guía');
      }

      await consumirSSE(res, {
        onDelta: (t) => {
          acumulado += t;
          setStreamText(acumulado);
        },
        onDone: (id) => setConsultaId(id),
        onError: (msg) => {
          streamError = msg;
        },
      });
      if (streamError) setError(streamError);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error inesperado');
      setStep(3);
    }
  }

  if (step === 'generando') {
    return (
      <div className="flex flex-col gap-6">
        <StreamingHeader hasText={streamText.length > 0} />
        {error && <Alert variant="error">{error}</Alert>}
        {streamText ? (
          <GuideView markdown={streamText} />
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center gap-3 p-10 text-center text-muted">
              <Spinner />
              <p>Generando tu guía inclusiva…</p>
              <p className="text-xs">Esto puede tomar unos segundos.</p>
            </CardContent>
          </Card>
        )}

        {consultaId && (
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button variant="outline" onClick={() => router.push('/inicio')}>
              Ir al inicio
            </Button>
            <Button onClick={() => router.push(`/resultado?id=${consultaId}`)}>
              Ver guía completa →
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Progress step={step} />
      {error && <Alert variant="error">{error}</Alert>}

      {step === 1 && (
        <>
          <Card>
            <CardContent className="flex flex-col gap-3 p-5">
              <p className="text-sm font-semibold text-primary">Plantillas rápidas</p>
              <p className="text-xs text-muted">
                Arrancá con un ejemplo y editá lo que necesites.
              </p>
              <div className="flex flex-wrap gap-2">
                {PLANTILLAS_DOCENTE.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({ ...prev, ...p.form } as typeof prev))
                    }
                    className="inline-flex items-center gap-2 rounded-[10px] border border-border bg-card px-3 py-2 text-xs font-medium text-primary transition-colors hover:border-accent hover:bg-primary-bg"
                    title={p.descripcion}
                  >
                    <span aria-hidden>{p.icon}</span>
                    <span>{p.titulo}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

        <Card>
          <CardContent className="flex flex-col gap-4 p-6">
            <header className="flex flex-col gap-1">
              <h2 className="font-serif text-2xl text-primary">Contexto de tu clase</h2>
              <p className="text-sm text-muted">Contanos qué vas a enseñar y a qué nivel.</p>
            </header>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Nivel educativo">
                <Select
                  value={form.nivel_id}
                  onChange={(e) => {
                    update('nivel_id', e.target.value);
                    update('subnivel_id', '');
                    update('anio_grado', '');
                    update('materia', '');
                  }}
                >
                  <option value="">Seleccionar…</option>
                  {NIVELES.map((n) => (
                    <option key={n.id} value={n.id}>
                      {n.label}
                    </option>
                  ))}
                </Select>
              </Field>

              {subniveles.length > 0 && (
                <Field label="Ciclo / Subnivel">
                  <Select
                    value={form.subnivel_id}
                    onChange={(e) => {
                      update('subnivel_id', e.target.value);
                      update('anio_grado', '');
                    }}
                  >
                    <option value="">Seleccionar…</option>
                    {subniveles.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </Select>
                </Field>
              )}

              {anios.length > 0 && (
                <Field label="Año / Grado / Sala">
                  <Select
                    value={form.anio_grado}
                    onChange={(e) => update('anio_grado', e.target.value)}
                  >
                    <option value="">Seleccionar…</option>
                    {anios.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </Select>
                </Field>
              )}

              {materias.length > 0 && (
                <Field label="Materia / Área">
                  <Select
                    value={form.materia}
                    onChange={(e) => update('materia', e.target.value)}
                  >
                    <option value="">Seleccionar…</option>
                    {materias.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </Select>
                </Field>
              )}
            </div>

            <Field label="Contenido específico">
              <textarea
                value={form.contenido}
                onChange={(e) => update('contenido', e.target.value)}
                placeholder="Ej: Fracciones equivalentes, La fotosíntesis, El cuento fantástico…"
                rows={3}
                className="min-h-[88px] w-full rounded-[10px] border border-border bg-card p-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              />
              <span className="text-xs text-muted">
                Cuanto más específico, mejor será la guía.
              </span>
            </Field>
          </CardContent>
        </Card>
        </>
      )}

      {step === 2 && (
        <Card>
          <CardContent className="flex flex-col gap-4 p-6">
            <header className="flex flex-col gap-1">
              <h2 className="font-serif text-2xl text-primary">
                Discapacidad del alumno/a
              </h2>
              <p className="text-sm text-muted">
                Seleccioná una o más — la guía se adaptará a cada una.
              </p>
            </header>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {DISCAPACIDADES.map((d) => {
                const selected = form.discapacidades.includes(d.id);
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => toggleDiscapacidad(d.id)}
                    className={cn(
                      'flex flex-col items-center gap-1 rounded-[14px] border px-3 py-4 text-center text-xs font-medium transition',
                      selected
                        ? 'border-accent bg-accent-light text-accent'
                        : 'border-border bg-card text-primary hover:bg-primary-bg'
                    )}
                    aria-pressed={selected}
                  >
                    <span className="text-2xl" aria-hidden>
                      {d.icon}
                    </span>
                    <span>{d.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Cantidad de alumnos con discapacidad">
                <Input
                  type="number"
                  min={1}
                  max={50}
                  value={form.cantidad_alumnos}
                  onChange={(e) =>
                    update('cantidad_alumnos', Math.max(1, Number(e.target.value) || 1))
                  }
                />
              </Field>

              <Field label="Situación de apoyo">
                <Select
                  value={form.situacion_apoyo}
                  onChange={(e) =>
                    update('situacion_apoyo', e.target.value as SituacionApoyo)
                  }
                >
                  <option value="maestra_integradora">Maestra integradora / MAI</option>
                  <option value="acompanante_terapeutico">Acompañante terapéutico (AT)</option>
                  <option value="sin_apoyo">Sin apoyo profesional</option>
                  <option value="en_diagnostico">En proceso de diagnóstico</option>
                  <option value="otro">Otra</option>
                </Select>
              </Field>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <Card>
          <CardContent className="flex flex-col gap-4 p-6">
            <header className="flex flex-col gap-1">
              <h2 className="font-serif text-2xl text-primary">Contexto adicional</h2>
              <p className="text-sm text-muted">
                Opcional pero recomendado — mejora mucho la calidad.
              </p>
            </header>

            <Field label="Descripción de tu aula y situación">
              <textarea
                value={form.contexto_aula ?? ''}
                onChange={(e) => update('contexto_aula', e.target.value)}
                rows={3}
                placeholder="Ej: Grupo de 25 alumnos, aula con proyector, sin netbooks…"
                className="min-h-[88px] w-full rounded-[10px] border border-border bg-card p-3 text-sm"
              />
            </Field>

            <Field label="Objetivo de la clase">
              <textarea
                value={form.objetivo_clase ?? ''}
                onChange={(e) => update('objetivo_clase', e.target.value)}
                rows={2}
                placeholder="Ej: Que los alumnos comprendan el concepto de fracción equivalente…"
                className="min-h-[72px] w-full rounded-[10px] border border-border bg-card p-3 text-sm"
              />
            </Field>

            <div className="rounded-[14px] bg-primary-bg p-4 text-sm">
              <p className="mb-2 font-semibold text-primary">📋 Resumen</p>
              <ul className="flex flex-col gap-0.5 text-primary/80">
                <li>
                  <strong>Nivel:</strong> {labelNivel(form)} · {form.anio_grado || '—'}
                </li>
                <li>
                  <strong>Materia:</strong> {form.materia || '—'}
                </li>
                <li>
                  <strong>Contenido:</strong> {form.contenido || '—'}
                </li>
                <li>
                  <strong>Discapacidad/es:</strong>{' '}
                  {form.discapacidades.length
                    ? form.discapacidades
                        .map((id) => DISCAPACIDADES.find((d) => d.id === id)?.label)
                        .filter(Boolean)
                        .join(', ')
                    : '—'}
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex items-center justify-between">
        {step > 1 ? (
          <Button
            variant="outline"
            onClick={() => setStep(((step as number) - 1) as Step)}
          >
            ← Anterior
          </Button>
        ) : (
          <span />
        )}

        {step < 3 ? (
          <Button
            onClick={() => {
              const err = validarPaso(step);
              if (err) return setError(err);
              setError(null);
              setStep(((step as number) + 1) as Step);
            }}
          >
            Siguiente →
          </Button>
        ) : (
          <Button onClick={submit} size="lg">
            🧩 Generar guía inclusiva
          </Button>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function Progress({ step }: { step: Step }) {
  const n = typeof step === 'number' ? step : 3;
  const labels = ['Contexto de tu clase', 'Discapacidad del alumno/a', 'Contexto adicional'];
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between text-xs text-muted">
        <span>Paso {n} de 3</span>
        <span>{labels[n - 1]}</span>
      </div>
      <div className="flex items-center gap-2">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={cn(
              'h-1.5 flex-1 rounded-full transition-colors',
              i <= n ? 'bg-accent' : 'bg-border'
            )}
          />
        ))}
      </div>
    </div>
  );
}

function StreamingHeader({ hasText }: { hasText: boolean }) {
  return (
    <div className="flex items-center gap-3">
      {hasText ? null : <Spinner />}
      <h1 className="text-2xl text-primary sm:text-3xl">
        {hasText ? 'Tu guía inclusiva' : 'Generando tu guía…'}
      </h1>
    </div>
  );
}

function Spinner() {
  return (
    <span
      aria-hidden
      className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-accent border-t-transparent"
    />
  );
}

function labelNivel(form: FormularioConsulta) {
  const nivel = form.nivel_id ? getNivelById(form.nivel_id) : undefined;
  if (!nivel) return '—';
  const sub = nivel.subniveles?.find((s) => s.id === form.subnivel_id);
  return sub ? `${nivel.label} · ${sub.label}` : nivel.label;
}


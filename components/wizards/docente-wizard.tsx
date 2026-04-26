'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { NIVELES, getNivelById, getAniosDisponibles } from '@/data/niveles';
import { getMateriasPorNivel } from '@/data/materias';
import { DISCAPACIDADES } from '@/data/discapacidades';
import type { FormularioConsulta } from '@/lib/types';
import type { SituacionApoyo } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Alert } from '@/components/ui/alert';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { LoaderGenerando } from './loader-generando';
import { PLANTILLAS_DOCENTE } from '@/data/plantillas-docente';
import { cn } from '@/lib/utils';
import { PHOTOS } from '@/lib/photos';
import { trackPixelCustom } from '@/lib/pixel';

const BANNERS: Record<1 | 2 | 3, { photo: string; title: string; subtitle: string; tip?: string }> = {
  1: {
    photo: PHOTOS.wizardClase,
    title: 'Contanos sobre tu clase',
    subtitle: 'Empezamos por lo básico: ¿qué vas a enseñar?',
    tip: '💡 Cuanto más específico seas con el contenido, mejor será tu guía',
  },
  2: {
    photo: PHOTOS.wizardAlumno,
    title: 'Contanos sobre tu alumno/a',
    subtitle: 'Seleccioná una o más discapacidades — la guía se adapta a cada una',
  },
  3: {
    photo: PHOTOS.wizardContexto,
    title: 'Un poco más de contexto',
    subtitle: 'Opcional pero muy recomendado — mejora mucho la calidad de tu guía',
    tip: '⭐ Los docentes que completan este paso reciben guías 40% más específicas',
  },
};

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

    try {
      const res = await fetch('/api/generar-guia-v2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success || !data.id) {
        throw new Error(data.error ?? 'No se pudo generar la guía');
      }
      trackPixelCustom('ActividadCreada', { tipo: 'guia', modulo: 'docente' });
      router.push(`/resultado?id=${data.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error inesperado');
      setStep(3);
    }
  }

  if (step === 'generando') {
    return <LoaderGenerando error={error} onVolver={() => setStep(3)} />;
  }

  const currentBanner =
    typeof step === 'number' ? BANNERS[step] : null;

  return (
    <div className="flex flex-col gap-6">
      <Progress step={step} />
      {currentBanner && (
        <section className="overflow-hidden rounded-[20px] bg-white shadow-[0_2px_12px_rgba(15,34,64,0.05)]">
          <div className="relative h-32 w-full overflow-hidden sm:h-40">
            <Image
              src={currentBanner.photo}
              alt=""
              width={900}
              height={400}
              className="h-full w-full object-cover"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-white/70 via-transparent to-transparent"
            />
          </div>
          <div className="px-6 py-5">
            <h2 className="font-serif text-2xl font-bold text-[#2E86C1] sm:text-3xl">
              {currentBanner.title}
            </h2>
            <p className="mt-1 text-sm text-[#4A5968]">
              {currentBanner.subtitle}
            </p>
            {currentBanner.tip && (
              <div className="mt-3 inline-flex items-start gap-2 rounded-[10px] bg-[#fef3c7] px-3 py-2 text-xs text-[#1F2E3D]">
                {currentBanner.tip}
              </div>
            )}
          </div>
        </section>
      )}
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

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: step > 1 ? '1fr 1fr' : '1fr',
          gap: '12px',
          marginTop: '16px',
          padding: '20px',
          borderRadius: '16px',
          border: '3px solid #27AE60',
          backgroundColor: '#D6F0E0',
          position: 'relative',
          zIndex: 100,
        }}
      >
        {step > 1 ? (
          <button
            type="button"
            onClick={() => setStep(((step as number) - 1) as Step)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              padding: '14px 24px',
              fontSize: '16px',
              fontWeight: 600,
              border: '2px solid #2E86C1',
              borderRadius: '10px',
              backgroundColor: 'white',
              color: '#2E86C1',
              cursor: 'pointer',
            }}
          >
            ← Anterior
          </button>
        ) : (
          <span aria-hidden />
        )}

        {step < 3 ? (
          <button
            type="button"
            onClick={() => {
              const err = validarPaso(step);
              if (err) return setError(err);
              setError(null);
              setStep(((step as number) + 1) as Step);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              padding: '14px 28px',
              fontSize: '16px',
              fontWeight: 700,
              border: 'none',
              borderRadius: '10px',
              backgroundColor: '#27AE60',
              color: 'white',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(22,163,74,0.35)',
            }}
          >
            Siguiente →
          </button>
        ) : (
          <button
            type="button"
            onClick={submit}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              padding: '14px 28px',
              fontSize: '16px',
              fontWeight: 700,
              border: 'none',
              borderRadius: '10px',
              backgroundColor: '#27AE60',
              color: 'white',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(22,163,74,0.35)',
            }}
          >
            🧩 Generar guía
          </button>
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
  const labels = ['Tu clase', 'Discapacidad', 'Contexto'];
  return (
    <div className="flex items-center justify-between gap-2 px-2 sm:gap-4">
      {[1, 2, 3].map((i, idx) => {
        const done = i < n;
        const active = i === n;
        return (
          <div key={i} className="flex flex-1 items-center gap-2 sm:gap-3">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  'flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold transition sm:h-10 sm:w-10 sm:text-sm',
                  done && 'bg-[#27AE60] text-white shadow-[0_2px_8px_rgba(22,163,74,0.3)]',
                  active && 'bg-[#27AE60] text-white ring-4 ring-[#D6F0E0]',
                  !done && !active && 'border-2 border-[#e2e8f0] bg-white text-[#4A5968]'
                )}
              >
                {done ? '✓' : i}
              </div>
              <span
                className={cn(
                  'text-[10px] font-semibold sm:text-xs',
                  active || done ? 'text-[#2E86C1]' : 'text-[#4A5968]'
                )}
              >
                {labels[idx]}
              </span>
            </div>
            {i < 3 && (
              <div
                className={cn(
                  'mb-5 h-0.5 flex-1 rounded-full transition',
                  done ? 'bg-[#27AE60]' : 'bg-[#e2e8f0]'
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}


function labelNivel(form: FormularioConsulta) {
  const nivel = form.nivel_id ? getNivelById(form.nivel_id) : undefined;
  if (!nivel) return '—';
  const sub = nivel.subniveles?.find((s) => s.id === form.subnivel_id);
  return sub ? `${nivel.label} · ${sub.label}` : nivel.label;
}


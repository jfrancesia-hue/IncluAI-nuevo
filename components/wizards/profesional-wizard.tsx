'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { DISCAPACIDADES } from '@/data/discapacidades';
import { ESPECIALIDADES } from '@/data/especialidades';
import { OBJETIVOS_PROFESIONAL, CONTEXTOS_ATENCION } from '@/data/objetivos-profesional';
import { RANGOS_EDAD } from '@/data/rangos-edad';
import type {
  FormularioProfesional,
  EspecialidadProfesional,
  ContextoAtencion,
  RangoEdad,
} from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Alert } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { LoaderGenerando } from './loader-generando';
import { cn } from '@/lib/utils';
import { PHOTOS } from '@/lib/photos';

const BANNERS: Record<1 | 2 | 3, { photo: string; title: string; subtitle: string; tip?: string }> = {
  1: {
    photo: PHOTOS.wizardProfesional1,
    title: 'Tu practica profesional',
    subtitle: 'Contanos desde donde vas a atender.',
    tip: '💡 La guia se adapta a tu especialidad y contexto de atencion',
  },
  2: {
    photo: PHOTOS.wizardProfesional2,
    title: 'Sobre el paciente',
    subtitle: 'Quien es y como se comunica.',
  },
  3: {
    photo: PHOTOS.wizardProfesional3,
    title: '¿Que necesitas?',
    subtitle: 'Elegi los objetivos y describi la situacion.',
    tip: '⭐ Cuanto mas detalle aportes, mas especifica sera la guia clinica',
  },
};

type Step = 1 | 2 | 3 | 'generando';

const initial: FormularioProfesional = {
  especialidad: 'psicologo',
  especialidad_otra: '',
  contexto_atencion: 'primera_consulta',
  lugar_atencion: '',
  edad_paciente: '6-8',
  discapacidades: [],
  discapacidad_otra: '',
  diagnostico_detalle: '',
  comunicacion_paciente: 'Verbal',
  objetivos: [],
  situacion_especifica: '',
  contexto_adicional: '',
};

export function ProfesionalWizard({
  especialidadDefault,
}: {
  especialidadDefault?: EspecialidadProfesional;
}) {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormularioProfesional>({
    ...initial,
    especialidad: especialidadDefault ?? initial.especialidad,
  });
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof FormularioProfesional>(
    key: K,
    value: FormularioProfesional[K]
  ) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function toggleArr(
    key: 'discapacidades' | 'objetivos',
    id: string
  ) {
    setForm((f) => {
      const arr = f[key] as string[];
      const next = arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id];
      return { ...f, [key]: next } as FormularioProfesional;
    });
  }

  function validar(n: Step): string | null {
    if (n === 1) {
      if (!form.lugar_atencion.trim()) return 'Indica el lugar de atencion';
    }
    if (n === 2) {
      if (form.discapacidades.length === 0) return 'Elegi al menos una discapacidad';
      if (!form.comunicacion_paciente.trim()) return 'Describi el nivel de comunicacion del paciente';
    }
    if (n === 3) {
      if (form.objetivos.length === 0) return 'Elegi al menos un objetivo';
      if (form.situacion_especifica.trim().length < 10) return 'Contanos un poco mas';
    }
    return null;
  }

  async function submit() {
    setError(null);
    const err = validar(1) || validar(2) || validar(3);
    if (err) return setError(err);

    setStep('generando');
    try {
      const res = await fetch('/api/generar-guia-v2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ modulo: 'profesionales', ...form }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success || !data.id) {
        throw new Error(data.error ?? 'No se pudo generar la guía');
      }
      router.push(`/resultado?id=${data.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error inesperado');
      setStep(3);
    }
  }

  if (step === 'generando') {
    return <LoaderGenerando error={error} onVolver={() => setStep(3)} />;
  }

  const currentBanner = typeof step === 'number' ? BANNERS[step] : null;

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
        <Card>
          <CardContent className="flex flex-col gap-4 p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Especialidad">
                <Select
                  value={form.especialidad}
                  onChange={(e) => update('especialidad', e.target.value as EspecialidadProfesional)}
                >
                  {ESPECIALIDADES.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.icon} {e.label}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Contexto de atencion">
                <Select
                  value={form.contexto_atencion}
                  onChange={(e) => update('contexto_atencion', e.target.value as ContextoAtencion)}
                >
                  {CONTEXTOS_ATENCION.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>

            {form.especialidad === 'otro' && (
              <Field label="¿Cual especialidad?">
                <Input
                  value={form.especialidad_otra ?? ''}
                  onChange={(e) => update('especialidad_otra', e.target.value)}
                  placeholder="Especifica tu especialidad"
                />
              </Field>
            )}

            <Field label="Lugar de atencion">
              <Input
                value={form.lugar_atencion}
                onChange={(e) => update('lugar_atencion', e.target.value)}
                placeholder='Ej: Consultorio privado / Hospital publico / Domicilio'
              />
            </Field>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardContent className="flex flex-col gap-4 p-6">
            <Field label="Edad">
              <Select
                value={form.edad_paciente}
                onChange={(e) => update('edad_paciente', e.target.value as RangoEdad)}
              >
                {RANGOS_EDAD.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.label}
                  </option>
                ))}
              </Select>
            </Field>

            <Field label="Discapacidad/es">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {DISCAPACIDADES.map((d) => {
                  const selected = form.discapacidades.includes(d.id);
                  return (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => toggleArr('discapacidades', d.id)}
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
            </Field>

            <Field label="Detalle del diagnostico (opcional)">
              <Input
                value={form.diagnostico_detalle ?? ''}
                onChange={(e) => update('diagnostico_detalle', e.target.value)}
              />
            </Field>

            <Field label="Nivel de comunicacion del paciente">
              <Input
                value={form.comunicacion_paciente}
                onChange={(e) => update('comunicacion_paciente', e.target.value)}
                placeholder='Ej: "Verbal" / "Verbal limitado" / "Usa CAA" / "No verbal"'
              />
            </Field>
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <Card>
          <CardContent className="flex flex-col gap-4 p-6">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {OBJETIVOS_PROFESIONAL.map((o) => {
                const selected = form.objetivos.includes(o.id);
                return (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => toggleArr('objetivos', o.id)}
                    className={cn(
                      'flex items-start gap-2 rounded-[14px] border px-4 py-4 text-left text-sm transition',
                      selected
                        ? 'border-accent bg-accent-light text-accent'
                        : 'border-border bg-card text-primary hover:bg-primary-bg'
                    )}
                    aria-pressed={selected}
                  >
                    <span className="text-xl" aria-hidden>
                      {o.icon}
                    </span>
                    <span className="flex flex-col">
                      <span className="font-medium">{o.label}</span>
                      <span className="text-xs text-muted">{o.descripcion}</span>
                    </span>
                  </button>
                );
              })}
            </div>

            <Field label="Situacion especifica">
              <textarea
                value={form.situacion_especifica}
                onChange={(e) => update('situacion_especifica', e.target.value)}
                rows={4}
                placeholder="Ej: Primera consulta odontologica con nene de 6 anios con TEA, antecedentes de desregulacion en intentos previos..."
                className="min-h-[108px] w-full rounded-[10px] border border-border bg-card p-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              />
            </Field>

            <Field label="Contexto adicional (opcional)">
              <textarea
                value={form.contexto_adicional ?? ''}
                onChange={(e) => update('contexto_adicional', e.target.value)}
                rows={3}
                className="min-h-[80px] w-full rounded-[10px] border border-border bg-card p-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              />
            </Field>

            <div className="rounded-[14px] bg-primary-bg p-4 text-sm">
              <p className="mb-2 font-semibold text-primary">📋 Resumen</p>
              <ul className="flex flex-col gap-0.5 text-primary/80">
                <li>
                  <strong>Especialidad:</strong>{' '}
                  {ESPECIALIDADES.find((e) => e.id === form.especialidad)?.label || '—'}
                </li>
                <li>
                  <strong>Lugar:</strong> {form.lugar_atencion || '—'}
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
                <li>
                  <strong>Objetivos:</strong>{' '}
                  {form.objetivos.length
                    ? form.objetivos
                        .map((id) => OBJETIVOS_PROFESIONAL.find((o) => o.id === id)?.label)
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
              const err = validar(step);
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
            ⚕️ Generar guia clinica
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
  const labels = ['Tu practica', 'Paciente', 'Objetivos'];
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


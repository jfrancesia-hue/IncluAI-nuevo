'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Alert } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { GuideView } from './guide-view';
import { consumirSSE } from './sse';
import { cn } from '@/lib/utils';

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
  const [streamText, setStreamText] = useState('');
  const [consultaId, setConsultaId] = useState<string | null>(null);

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
      if (!form.lugar_atencion.trim()) return 'Indicá el lugar de atención';
    }
    if (n === 2) {
      if (form.discapacidades.length === 0) return 'Elegí al menos una discapacidad';
      if (!form.comunicacion_paciente.trim()) return 'Describí el nivel de comunicación del paciente';
    }
    if (n === 3) {
      if (form.objetivos.length === 0) return 'Elegí al menos un objetivo';
      if (form.situacion_especifica.trim().length < 10) return 'Contanos un poco más';
    }
    return null;
  }

  async function submit() {
    setError(null);
    const err = validar(1) || validar(2) || validar(3);
    if (err) return setError(err);

    setStep('generando');
    setStreamText('');
    setConsultaId(null);

    let acumulado = '';
    try {
      const res = await fetch('/api/generar-guia-profesional', {
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
          throw new Error(msg);
        },
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error inesperado');
      setStep(3);
    }
  }

  if (step === 'generando') {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl text-primary sm:text-3xl">
          {streamText ? 'Guía clínica adaptada' : 'Generando tu guía…'}
        </h1>
        {error && <Alert variant="error">{error}</Alert>}
        {streamText ? (
          <GuideView markdown={streamText} />
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center gap-3 p-10 text-center text-muted">
              <Spinner />
              <p>Generando tu guía…</p>
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
        <Card>
          <CardContent className="flex flex-col gap-4 p-6">
            <header>
              <h2 className="font-serif text-2xl text-primary">Tu práctica profesional</h2>
              <p className="text-sm text-muted">
                Contanos desde dónde vas a atender.
              </p>
            </header>

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
              <Field label="Contexto de atención">
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
              <Field label="¿Cuál especialidad?">
                <Input
                  value={form.especialidad_otra ?? ''}
                  onChange={(e) => update('especialidad_otra', e.target.value)}
                  placeholder="Especificá tu especialidad"
                />
              </Field>
            )}

            <Field label="Lugar de atención">
              <Input
                value={form.lugar_atencion}
                onChange={(e) => update('lugar_atencion', e.target.value)}
                placeholder='Ej: Consultorio privado / Hospital público / Domicilio'
              />
            </Field>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardContent className="flex flex-col gap-4 p-6">
            <header>
              <h2 className="font-serif text-2xl text-primary">Sobre el paciente</h2>
              <p className="text-sm text-muted">Quién es y cómo se comunica.</p>
            </header>

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
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                {DISCAPACIDADES.map((d) => {
                  const selected = form.discapacidades.includes(d.id);
                  return (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => toggleArr('discapacidades', d.id)}
                      className={cn(
                        'flex flex-col items-center gap-1 rounded-[12px] border px-3 py-3 text-center text-xs font-medium transition',
                        selected
                          ? 'border-accent bg-accent-light text-accent'
                          : 'border-border bg-card text-primary hover:bg-primary-bg'
                      )}
                      aria-pressed={selected}
                    >
                      <span className="text-xl" aria-hidden>
                        {d.icon}
                      </span>
                      <span>{d.label}</span>
                    </button>
                  );
                })}
              </div>
            </Field>

            <Field label="Detalle del diagnóstico (opcional)">
              <Input
                value={form.diagnostico_detalle ?? ''}
                onChange={(e) => update('diagnostico_detalle', e.target.value)}
              />
            </Field>

            <Field label="Nivel de comunicación del paciente">
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
            <header>
              <h2 className="font-serif text-2xl text-primary">¿Qué necesitás?</h2>
              <p className="text-sm text-muted">Elegí los objetivos y describí la situación.</p>
            </header>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {OBJETIVOS_PROFESIONAL.map((o) => {
                const selected = form.objetivos.includes(o.id);
                return (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => toggleArr('objetivos', o.id)}
                    className={cn(
                      'flex items-start gap-2 rounded-[12px] border px-3 py-3 text-left text-sm transition',
                      selected
                        ? 'border-accent bg-accent-light text-accent'
                        : 'border-border bg-card text-primary hover:bg-primary-bg'
                    )}
                    aria-pressed={selected}
                  >
                    <span className="text-lg" aria-hidden>
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

            <Field label="Situación específica">
              <textarea
                value={form.situacion_especifica}
                onChange={(e) => update('situacion_especifica', e.target.value)}
                rows={4}
                placeholder="Ej: Primera consulta odontológica con nene de 6 años con TEA, antecedentes de desregulación en intentos previos…"
                className="min-h-[108px] w-full rounded-[10px] border border-border bg-card p-3 text-sm"
              />
            </Field>

            <Field label="Contexto adicional (opcional)">
              <textarea
                value={form.contexto_adicional ?? ''}
                onChange={(e) => update('contexto_adicional', e.target.value)}
                rows={3}
                className="min-h-[80px] w-full rounded-[10px] border border-border bg-card p-3 text-sm"
              />
            </Field>
          </CardContent>
        </Card>
      )}

      <div className="flex items-center justify-between">
        {step > 1 ? (
          <Button variant="outline" onClick={() => setStep(((step as number) - 1) as Step)}>
            ← Anterior
          </Button>
        ) : (
          <span />
        )}
        {step < 3 ? (
          <Button
            onClick={() => {
              const err = validar(step);
              if (err) return setError(err);
              setError(null);
              setStep(((step as number) + 1) as Step);
            }}
          >
            Siguiente →
          </Button>
        ) : (
          <Button onClick={submit} size="lg">
            ⚕️ Generar guía clínica
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
  return (
    <div className="flex items-center gap-2">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className={cn('h-1.5 flex-1 rounded-full transition-colors', i <= n ? 'bg-accent' : 'bg-border')}
        />
      ))}
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

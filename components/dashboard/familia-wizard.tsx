'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DISCAPACIDADES } from '@/data/discapacidades';
import { AREAS_FAMILIA } from '@/data/areas-familia';
import { RANGOS_EDAD } from '@/data/rangos-edad';
import type {
  FormularioFamilia,
  SituacionFamiliar,
  RangoEdad,
  AreaAyudaFamilia,
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

const initial: FormularioFamilia = {
  nombre_hijo: '',
  edad_rango: '3-5',
  discapacidades: [],
  discapacidad_otra: '',
  diagnostico_detalle: '',
  areas_ayuda: [],
  situacion_especifica: '',
  situacion_familiar: 'ambos_padres',
  tiene_terapias: false,
  terapias_detalle: '',
  contexto_adicional: '',
};

export function FamiliaWizard() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormularioFamilia>(initial);
  const [error, setError] = useState<string | null>(null);
  const [streamText, setStreamText] = useState('');
  const [consultaId, setConsultaId] = useState<string | null>(null);

  function update<K extends keyof FormularioFamilia>(key: K, value: FormularioFamilia[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function toggleArr<T extends string>(key: 'discapacidades' | 'areas_ayuda', id: T) {
    setForm((f) => {
      const arr = f[key] as string[];
      const next = arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id];
      return { ...f, [key]: next } as FormularioFamilia;
    });
  }

  function validar(n: Step): string | null {
    if (n === 1) {
      if (form.discapacidades.length === 0) return 'Elegí al menos una discapacidad';
    }
    if (n === 2) {
      if (form.areas_ayuda.length === 0) return 'Elegí al menos un área';
      if (form.situacion_especifica.trim().length < 10)
        return 'Contanos un poco más de la situación (mín. 10 caracteres)';
    }
    return null;
  }

  async function submit() {
    setError(null);
    const err = validar(1) || validar(2);
    if (err) return setError(err);

    setStep('generando');
    setStreamText('');
    setConsultaId(null);

    let acumulado = '';
    let streamError: string | null = null;
    try {
      const res = await fetch('/api/generar-guia-familia', {
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
        <h1 className="text-2xl text-primary sm:text-3xl">
          {streamText ? 'Tu guía para la familia' : 'Generando tu guía…'}
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
              <h2 className="font-serif text-2xl text-primary">Sobre tu hijo/a</h2>
              <p className="text-sm text-muted">Contanos brevemente a quién apuntamos la guía.</p>
            </header>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Nombre (opcional)">
                <Input
                  value={form.nombre_hijo ?? ''}
                  onChange={(e) => update('nombre_hijo', e.target.value)}
                  placeholder="Ej: Juan, Pilar…"
                />
              </Field>
              <Field label="Edad">
                <Select
                  value={form.edad_rango}
                  onChange={(e) => update('edad_rango', e.target.value as RangoEdad)}
                >
                  {RANGOS_EDAD.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.label} — {r.descripcion}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>

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
                placeholder='Ej: "TEA nivel 1 con apoyo" / "Síndrome de Down"'
              />
            </Field>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardContent className="flex flex-col gap-4 p-6">
            <header>
              <h2 className="font-serif text-2xl text-primary">¿En qué necesitás ayuda?</h2>
              <p className="text-sm text-muted">Elegí una o más áreas y contanos la situación.</p>
            </header>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {AREAS_FAMILIA.map((a) => {
                const selected = form.areas_ayuda.includes(a.id);
                return (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => toggleArr<AreaAyudaFamilia>('areas_ayuda', a.id)}
                    className={cn(
                      'flex flex-col items-center gap-1 rounded-[12px] border px-3 py-3 text-center text-xs font-medium transition',
                      selected
                        ? 'border-accent bg-accent-light text-accent'
                        : 'border-border bg-card text-primary hover:bg-primary-bg'
                    )}
                    aria-pressed={selected}
                  >
                    <span className="text-xl" aria-hidden>
                      {a.icon}
                    </span>
                    <span>{a.label}</span>
                  </button>
                );
              })}
            </div>

            <Field label="Situación específica">
              <textarea
                value={form.situacion_especifica}
                onChange={(e) => update('situacion_especifica', e.target.value)}
                rows={4}
                placeholder="Ej: No duerme antes de las 12, hace berrinches muy intensos cuando le cambiamos la rutina, tengo miedo de salir con él/ella al parque…"
                className="min-h-[108px] w-full rounded-[10px] border border-border bg-card p-3 text-sm"
              />
            </Field>
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <Card>
          <CardContent className="flex flex-col gap-4 p-6">
            <header>
              <h2 className="font-serif text-2xl text-primary">Contexto familiar</h2>
              <p className="text-sm text-muted">Opcional pero ayuda a personalizar la guía.</p>
            </header>

            <Field label="Situación familiar">
              <Select
                value={form.situacion_familiar}
                onChange={(e) => update('situacion_familiar', e.target.value as SituacionFamiliar)}
              >
                <option value="ambos_padres">Ambos padres presentes</option>
                <option value="monoparental">Familia monoparental</option>
                <option value="familia_ampliada">Familia ampliada (abuelos/tíos)</option>
                <option value="otro">Otra situación</option>
              </Select>
            </Field>

            <Field label="¿Hace terapias actualmente?">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.tiene_terapias}
                  onChange={(e) => update('tiene_terapias', e.target.checked)}
                />
                Sí
              </label>
            </Field>

            {form.tiene_terapias && (
              <Field label="Detalle de terapias">
                <Input
                  value={form.terapias_detalle ?? ''}
                  onChange={(e) => update('terapias_detalle', e.target.value)}
                  placeholder="Ej: Fono 2 veces/semana, TO 1 vez"
                />
              </Field>
            )}

            <Field label="Contexto adicional (opcional)">
              <textarea
                value={form.contexto_adicional ?? ''}
                onChange={(e) => update('contexto_adicional', e.target.value)}
                rows={3}
                placeholder="Cualquier info extra que nos ayude a personalizar la guía"
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
            🏠 Generar guía para la familia
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
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between text-xs text-muted">
        <span>Paso {n} de 3</span>
        <span>
          {n === 1 && 'Sobre tu hijo/a'}
          {n === 2 && '¿En qué necesitás ayuda?'}
          {n === 3 && 'Contexto familiar'}
        </span>
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

function Spinner() {
  return (
    <span
      aria-hidden
      className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-accent border-t-transparent"
    />
  );
}

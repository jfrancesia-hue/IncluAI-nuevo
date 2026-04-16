'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
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
import { GuideView } from '../guide/guide-view';
import { consumirSSE } from './sse';
import { cn } from '@/lib/utils';
import { PHOTOS } from '@/lib/photos';

const BANNERS: Record<1 | 2 | 3, { photo: string; title: string; subtitle: string; tip?: string }> = {
  1: {
    photo: PHOTOS.wizardFamilia1,
    title: 'Sobre tu hijo/a',
    subtitle: 'Contanos brevemente a quién apuntamos la guía.',
    tip: '💡 No hace falta un diagnóstico formal — contanos lo que observás en casa',
  },
  2: {
    photo: PHOTOS.wizardFamilia2,
    title: '¿En qué necesitás ayuda?',
    subtitle: 'Elegí una o más áreas y contanos la situación.',
    tip: '💡 Podés elegir varias áreas — la guía se adapta a cada una',
  },
  3: {
    photo: PHOTOS.wizardFamilia3,
    title: 'Contexto familiar',
    subtitle: 'Opcional pero ayuda a personalizar la guía.',
    tip: '⭐ Las familias que completan este paso reciben guías 40% más específicas',
  },
};

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
        <div className="flex items-center gap-3">
          {!streamText && <Spinner />}
          <h1 className="font-serif text-2xl font-bold text-[#1e3a5f] sm:text-3xl">
            {streamText ? 'Tu guía para la familia' : 'Generando tu guía...'}
          </h1>
        </div>
        {error && <Alert variant="error">{error}</Alert>}
        {streamText ? (
          <GuideView markdown={streamText} />
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center gap-3 p-10 text-center text-muted">
              <Spinner />
              <p>Generando tu guía...</p>
            </CardContent>
          </Card>
        )}
        {consultaId && (
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button variant="outline" onClick={() => router.push('/inicio')}>
              Ir al inicio
            </Button>
            <Button onClick={() => router.push(`/resultado?id=${consultaId}`)}>
              Ver guia completa →
            </Button>
          </div>
        )}
      </div>
    );
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
            <h2 className="font-serif text-2xl font-bold text-[#1e3a5f] sm:text-3xl">
              {currentBanner.title}
            </h2>
            <p className="mt-1 text-sm text-[#5c6b7f]">
              {currentBanner.subtitle}
            </p>
            {currentBanner.tip && (
              <div className="mt-3 inline-flex items-start gap-2 rounded-[10px] bg-[#fef3c7] px-3 py-2 text-xs text-[#1a2332]">
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
              <Field label="Nombre (opcional)">
                <Input
                  value={form.nombre_hijo ?? ''}
                  onChange={(e) => update('nombre_hijo', e.target.value)}
                  placeholder="Ej: Juan, Pilar..."
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
                placeholder='Ej: "TEA nivel 1 con apoyo" / "Sindrome de Down"'
              />
            </Field>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardContent className="flex flex-col gap-4 p-6">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {AREAS_FAMILIA.map((a) => {
                const selected = form.areas_ayuda.includes(a.id);
                return (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => toggleArr<AreaAyudaFamilia>('areas_ayuda', a.id)}
                    className={cn(
                      'flex flex-col items-center gap-1 rounded-[14px] border px-3 py-4 text-center text-xs font-medium transition',
                      selected
                        ? 'border-accent bg-accent-light text-accent'
                        : 'border-border bg-card text-primary hover:bg-primary-bg'
                    )}
                    aria-pressed={selected}
                  >
                    <span className="text-2xl" aria-hidden>
                      {a.icon}
                    </span>
                    <span>{a.label}</span>
                  </button>
                );
              })}
            </div>

            <Field label="Situacion especifica">
              <textarea
                value={form.situacion_especifica}
                onChange={(e) => update('situacion_especifica', e.target.value)}
                rows={4}
                placeholder="Ej: No duerme antes de las 12, hace berrinches muy intensos cuando le cambiamos la rutina, tengo miedo de salir con el/ella al parque..."
                className="min-h-[108px] w-full rounded-[10px] border border-border bg-card p-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              />
            </Field>
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <Card>
          <CardContent className="flex flex-col gap-4 p-6">
            <Field label="Situacion familiar">
              <Select
                value={form.situacion_familiar}
                onChange={(e) => update('situacion_familiar', e.target.value as SituacionFamiliar)}
              >
                <option value="ambos_padres">Ambos padres presentes</option>
                <option value="monoparental">Familia monoparental</option>
                <option value="familia_ampliada">Familia ampliada (abuelos/tios)</option>
                <option value="otro">Otra situacion</option>
              </Select>
            </Field>

            <Field label="¿Hace terapias actualmente?">
              <label className="flex items-center gap-3 rounded-[10px] border border-border bg-card px-4 py-3 text-sm cursor-pointer hover:bg-primary-bg transition">
                <input
                  type="checkbox"
                  checked={form.tiene_terapias}
                  onChange={(e) => update('tiene_terapias', e.target.checked)}
                  className="h-5 w-5 rounded accent-accent"
                />
                Si, hace terapias
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
                placeholder="Cualquier info extra que nos ayude a personalizar la guia"
                className="min-h-[80px] w-full rounded-[10px] border border-border bg-card p-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              />
            </Field>

            <div className="rounded-[14px] bg-primary-bg p-4 text-sm">
              <p className="mb-2 font-semibold text-primary">📋 Resumen</p>
              <ul className="flex flex-col gap-0.5 text-primary/80">
                <li>
                  <strong>Nombre:</strong> {form.nombre_hijo || '(no especificado)'}
                </li>
                <li>
                  <strong>Edad:</strong> {RANGOS_EDAD.find((r) => r.id === form.edad_rango)?.label || '—'}
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
                  <strong>Areas:</strong>{' '}
                  {form.areas_ayuda.length
                    ? form.areas_ayuda
                        .map((id) => AREAS_FAMILIA.find((a) => a.id === id)?.label)
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
          border: '3px solid #15803d',
          backgroundColor: '#f0fdf4',
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
              border: '2px solid #1e3a5f',
              borderRadius: '10px',
              backgroundColor: 'white',
              color: '#1e3a5f',
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
              backgroundColor: '#15803d',
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
              backgroundColor: '#15803d',
              color: 'white',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(22,163,74,0.35)',
            }}
          >
            🏠 Generar guia
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
  const labels = ['Tu hijo/a', 'Ayuda', 'Contexto'];
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
                  done && 'bg-[#15803d] text-white shadow-[0_2px_8px_rgba(22,163,74,0.3)]',
                  active && 'bg-[#15803d] text-white ring-4 ring-[#dcfce7]',
                  !done && !active && 'border-2 border-[#e2e8f0] bg-white text-[#5c6b7f]'
                )}
              >
                {done ? '✓' : i}
              </div>
              <span
                className={cn(
                  'text-[10px] font-semibold sm:text-xs',
                  active || done ? 'text-[#1e3a5f]' : 'text-[#5c6b7f]'
                )}
              >
                {labels[idx]}
              </span>
            </div>
            {i < 3 && (
              <div
                className={cn(
                  'mb-5 h-0.5 flex-1 rounded-full transition',
                  done ? 'bg-[#15803d]' : 'bg-[#e2e8f0]'
                )}
              />
            )}
          </div>
        );
      })}
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

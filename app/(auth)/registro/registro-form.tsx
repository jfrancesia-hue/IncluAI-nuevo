'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Alert } from '@/components/ui/alert';
import { PROVINCIAS_AR } from '@/data/provincias';
import { ESPECIALIDADES } from '@/data/especialidades';
import { registrarUsuario } from './actions';
import { cn } from '@/lib/utils';

type Tipo = 'docente' | 'familia' | 'profesional';

const TIPOS: { id: Tipo; icon: string; label: string; desc: string }[] = [
  { id: 'docente', icon: '📚', label: 'Soy docente', desc: 'Planificar clases inclusivas' },
  { id: 'familia', icon: '🏠', label: 'Soy familia', desc: 'Acompañar a mi hijo/a en casa' },
  { id: 'profesional', icon: '⚕️', label: 'Soy profesional', desc: 'Atención clínica adaptada' },
];

export function RegistroForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();
  const [tipo, setTipo] = useState<Tipo>('docente');

  return (
    <form
      action={(formData) => {
        setError(null);
        setFieldErrors({});
        startTransition(async () => {
          const result = await registrarUsuario(formData);
          if (!result.ok) {
            setError(result.error);
            if (result.fieldErrors) setFieldErrors(result.fieldErrors);
            return;
          }
          if (result.requiresEmailConfirm) {
            router.push('/verificar-email');
          } else {
            router.push('/inicio');
          }
        });
      }}
      className="flex flex-col gap-4"
    >
      {error && <Alert variant="error">{error}</Alert>}

      <input type="hidden" name="tipo_usuario" value={tipo} />

      <fieldset className="flex flex-col gap-2">
        <Label>¿Cómo vas a usar IncluIA?</Label>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {TIPOS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTipo(t.id)}
              aria-pressed={tipo === t.id}
              className={cn(
                'flex flex-col items-start gap-0.5 rounded-[12px] border px-3 py-3 text-left text-sm transition',
                tipo === t.id
                  ? 'border-accent bg-accent-light text-accent'
                  : 'border-border bg-card text-primary hover:bg-primary-bg'
              )}
            >
              <span className="text-xl" aria-hidden>{t.icon}</span>
              <span className="font-semibold">{t.label}</span>
              <span className="text-xs text-muted">{t.desc}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Nombre" error={fieldErrors.nombre}>
          <Input name="nombre" required autoComplete="given-name" />
        </Field>
        <Field label="Apellido" error={fieldErrors.apellido}>
          <Input name="apellido" required autoComplete="family-name" />
        </Field>
      </div>

      <Field label="Email" error={fieldErrors.email}>
        <Input name="email" type="email" required autoComplete="email" />
      </Field>

      <Field label="Contraseña" error={fieldErrors.password} hint="Mínimo 8 caracteres">
        <Input name="password" type="password" required minLength={8} autoComplete="new-password" />
      </Field>

      {tipo === 'docente' && (
        <Field label="Institución educativa (opcional)" error={fieldErrors.institucion}>
          <Input name="institucion" placeholder="Ej: Escuela N° 15 'Mariano Moreno'" />
        </Field>
      )}

      {tipo === 'profesional' && (
        <Field label="Especialidad" error={fieldErrors.especialidad}>
          <Select name="especialidad" defaultValue="">
            <option value="">Seleccionar…</option>
            {ESPECIALIDADES.map((e) => (
              <option key={e.id} value={e.id}>
                {e.icon} {e.label}
              </option>
            ))}
          </Select>
        </Field>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Localidad (opcional)" error={fieldErrors.localidad}>
          <Input name="localidad" placeholder="Ej: Rosario" />
        </Field>
        <Field label="Provincia (opcional)" error={fieldErrors.provincia}>
          <Select name="provincia" defaultValue="">
            <option value="">Seleccionar…</option>
            {PROVINCIAS_AR.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <Button type="submit" size="lg" disabled={isPending} className="mt-2">
        {isPending ? 'Creando cuenta…' : 'Crear mi cuenta'}
      </Button>

      <p className="text-center text-sm text-muted">
        ¿Ya tenés cuenta?{' '}
        <Link href="/login" className="font-medium text-accent hover:underline">
          Iniciá sesión
        </Link>
      </p>
    </form>
  );
}

function Field({
  label,
  children,
  hint,
  error,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
  error?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      {children}
      {hint && !error && <span className="text-xs text-muted">{hint}</span>}
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}

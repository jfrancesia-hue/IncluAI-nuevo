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
import { registrarUsuario } from './actions';

export function RegistroForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();

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

      <Field
        label="Contraseña"
        error={fieldErrors.password}
        hint="Mínimo 8 caracteres"
      >
        <Input
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
        />
      </Field>

      <Field label="Institución educativa (opcional)" error={fieldErrors.institucion}>
        <Input name="institucion" placeholder="Ej: Escuela N° 15 'Mariano Moreno'" />
      </Field>

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

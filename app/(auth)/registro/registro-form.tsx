'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Alert } from '@/components/ui/alert';
import { ESPECIALIDADES } from '@/data/especialidades';
import { registrarUsuario } from './actions';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

type Tipo = 'docente' | 'familia' | 'profesional';

const TIPOS: { id: Tipo; icon: string; label: string; desc: string }[] = [
  { id: 'docente', icon: '📚', label: 'Soy docente', desc: 'Planificar clases inclusivas' },
  { id: 'familia', icon: '🏠', label: 'Soy familia', desc: 'Acompañar a mi hijo/a en casa' },
  { id: 'profesional', icon: '⚕️', label: 'Soy profesional', desc: 'Atención clínica adaptada' },
];

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden className="inline">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.83z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.83C6.71 7.31 9.14 5.38 12 5.38z" />
    </svg>
  );
}

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
        <Label>¿Cómo vas a usar IncluAI?</Label>
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

      <p className="text-center text-xs text-muted">
        Localidad, provincia y más datos los podés completar después en tu perfil.
      </p>

      <Button
        type="button"
        variant="secondary"
        size="lg"
        disabled={isPending}
        onClick={async () => {
          const supabase = createClient();
          await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
              redirectTo: `${window.location.origin}/auth/callback?next=%2Finicio`,
            },
          });
        }}
      >
        <GoogleIcon /> Continuar con Google
      </Button>

      <Button type="submit" size="lg" variant="cta" disabled={isPending}>
        {isPending ? 'Creando cuenta…' : 'Crear cuenta'}
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

'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert } from '@/components/ui/alert';
import { loginWithPassword, sendMagicLink } from './actions';

export function LoginForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') ?? '/inicio';
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();

  return (
    <form
      action={(formData) => {
        setError(null);
        setInfo(null);
        startTransition(async () => {
          const result = await loginWithPassword(formData);
          if (result?.error) setError(result.error);
        });
      }}
      className="flex flex-col gap-4"
    >
      <input type="hidden" name="redirect" value={redirectTo} />

      {error && <Alert variant="error">{error}</Alert>}
      {info && <Alert variant="success">{info}</Alert>}

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="docente@escuela.edu.ar"
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Contraseña</Label>
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="text-xs text-muted hover:text-primary"
          >
            {showPassword ? 'Ocultar' : 'Mostrar'}
          </button>
        </div>
        <Input
          id="password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="current-password"
          required
        />
      </div>

      <Button type="submit" size="lg" disabled={isPending}>
        {isPending ? 'Ingresando…' : 'Ingresar'}
      </Button>

      <div className="flex items-center gap-3 py-2">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted">o</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <Button
        type="button"
        variant="secondary"
        size="lg"
        disabled={isPending}
        onClick={async (e) => {
          setError(null);
          setInfo(null);
          const form = e.currentTarget.closest('form');
          if (!form) return;
          const fd = new FormData(form);
          startTransition(async () => {
            const result = await sendMagicLink(fd);
            if (result?.error) setError(result.error);
            if (result?.success) setInfo(result.success);
          });
        }}
      >
        Ingresar con link mágico
      </Button>

      <p className="mt-2 text-center text-sm text-muted">
        ¿No tenés cuenta?{' '}
        <Link href="/registro" className="font-medium text-accent hover:underline">
          Registrate
        </Link>
      </p>
    </form>
  );
}

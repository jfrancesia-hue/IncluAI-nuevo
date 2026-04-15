'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert } from '@/components/ui/alert';
import { loginWithPassword, sendMagicLink } from './actions';
import { createClient } from '@/lib/supabase/client';

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
        onClick={async () => {
          setError(null);
          const supabase = createClient();
          const { error: oauthError } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
              redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
            },
          });
          if (oauthError) setError(oauthError.message);
        }}
      >
        <GoogleIcon /> Continuar con Google
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="sm"
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
        ✉️ Enviarme link mágico por email
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

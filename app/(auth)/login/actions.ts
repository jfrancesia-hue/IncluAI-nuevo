'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function loginWithPassword(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  const redirectTo = String(formData.get('redirect') ?? '/inicio');

  if (!email || !password) {
    return { error: 'Ingresá email y contraseña.' };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: mapAuthError(error.message) };
  }

  revalidatePath('/', 'layout');
  redirect(redirectTo);
}

export async function sendMagicLink(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim();

  if (!email) {
    return { error: 'Ingresá tu email.' };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL ?? ''}/auth/callback`,
    },
  });

  if (error) {
    return { error: mapAuthError(error.message) };
  }

  return { success: 'Te enviamos un link mágico. Revisá tu email.' };
}

function mapAuthError(msg: string): string {
  if (/invalid login credentials/i.test(msg)) {
    return 'Email o contraseña incorrectos.';
  }
  if (/email not confirmed/i.test(msg)) {
    return 'Tenés que verificar tu email antes de ingresar.';
  }
  return msg;
}

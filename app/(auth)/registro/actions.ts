'use server';

import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { PROVINCIAS_AR } from '@/data/provincias';
import { enviarBienvenida } from '@/lib/email';

const tipoUsuarioSchema = z.enum(['docente', 'familia', 'profesional']);

const registroSchema = z.object({
  nombre: z.string().trim().min(1, 'Ingresá tu nombre').max(80),
  apellido: z.string().trim().min(1, 'Ingresá tu apellido').max(80),
  email: z.string().trim().email('Email inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  tipo_usuario: tipoUsuarioSchema.default('docente'),
  especialidad: z.string().trim().max(60).optional().or(z.literal('')),
  institucion: z.string().trim().max(160).optional().or(z.literal('')),
  localidad: z.string().trim().max(120).optional().or(z.literal('')),
  provincia: z
    .string()
    .refine(
      (v) => (PROVINCIAS_AR as readonly string[]).includes(v) || v === '',
      'Elegí una provincia válida'
    )
    .optional(),
});

export type RegistroResult =
  | { ok: true; requiresEmailConfirm: boolean }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

export async function registrarUsuario(formData: FormData): Promise<RegistroResult> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = registroSchema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === 'string' && !fieldErrors[key]) {
        fieldErrors[key] = issue.message;
      }
    }
    return { ok: false, error: 'Revisá los datos del formulario.', fieldErrors };
  }

  const data = parsed.data;

  const supabase = await createClient();
  const { data: authData, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL ?? ''}/auth/callback`,
      data: {
        nombre: data.nombre,
        apellido: data.apellido,
        tipo_usuario: data.tipo_usuario,
        especialidad: data.especialidad || null,
        institucion: data.institucion || null,
        localidad: data.localidad || null,
        provincia: data.provincia || null,
      },
    },
  });

  if (error) {
    return { ok: false, error: mapAuthError(error.message) };
  }

  if (
    authData.user &&
    (data.institucion ||
      data.localidad ||
      data.provincia ||
      data.tipo_usuario !== 'docente' ||
      data.especialidad)
  ) {
    await supabase
      .from('perfiles')
      .update({
        tipo_usuario: data.tipo_usuario,
        especialidad: data.especialidad || null,
        institucion: data.institucion || null,
        localidad: data.localidad || null,
        provincia: data.provincia || 'No especificada',
      })
      .eq('id', authData.user.id);
  }

  const requiresEmailConfirm = !authData.session;

  // Email de bienvenida (independiente del email de confirmación de Supabase).
  // Falla silenciosamente si Resend no está configurado.
  enviarBienvenida({ to: data.email, nombre: data.nombre }).catch(() => null);

  return { ok: true, requiresEmailConfirm };
}

function mapAuthError(msg: string): string {
  if (/already registered/i.test(msg) || /user already/i.test(msg)) {
    return 'Ya existe una cuenta con ese email.';
  }
  if (/password/i.test(msg)) {
    return 'La contraseña no cumple los requisitos de seguridad.';
  }
  return msg;
}

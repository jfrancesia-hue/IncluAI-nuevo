'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { PROVINCIAS_AR } from '@/data/provincias';

const schema = z.object({
  nombre: z.string().trim().min(1).max(80),
  apellido: z.string().trim().min(1).max(80),
  institucion: z.string().trim().max(160).optional().or(z.literal('')),
  localidad: z.string().trim().max(120).optional().or(z.literal('')),
  provincia: z
    .string()
    .refine((v) => (PROVINCIAS_AR as readonly string[]).includes(v) || v === '')
    .optional(),
});

export type PerfilUpdateResult =
  | { ok: true }
  | { ok: false; error: string };

export async function actualizarPerfil(
  formData: FormData
): Promise<PerfilUpdateResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: 'No autorizado' };

  const parsed = schema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { ok: false, error: 'Revisá los datos del formulario.' };
  }

  const data = parsed.data;
  const { error } = await supabase
    .from('perfiles')
    .update({
      nombre: data.nombre,
      apellido: data.apellido,
      institucion: data.institucion || null,
      localidad: data.localidad || null,
      provincia: data.provincia || 'No especificada',
    })
    .eq('id', user.id);

  if (error) return { ok: false, error: error.message };

  revalidatePath('/perfil');
  revalidatePath('/', 'layout');
  return { ok: true };
}

import 'server-only';
import { cache } from 'react';
import { createClient } from '@/lib/supabase/server';
import type { Perfil } from '@/lib/types';

type PerfilRow = {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  nivel_educativo: string | null;
  institucion: string | null;
  localidad: string | null;
  provincia: string | null;
  rol: 'docente' | 'admin';
  plan: 'free' | 'pro' | 'institucional';
  plan_activo_hasta: string | null;
  consultas_mes: number;
  created_at: string;
};

export const getCurrentUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

export const getPerfil = cache(async (): Promise<Perfil | null> => {
  const user = await getCurrentUser();
  if (!user) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('perfiles')
    .select(
      'id, nombre, apellido, email, nivel_educativo, institucion, localidad, provincia, rol, plan, plan_activo_hasta, consultas_mes, created_at'
    )
    .eq('id', user.id)
    .single<PerfilRow>();

  if (error || !data) return null;

  return {
    id: data.id,
    nombre: data.nombre,
    apellido: data.apellido,
    email: data.email,
    nivel_educativo: data.nivel_educativo ?? undefined,
    institucion: data.institucion ?? undefined,
    localidad: data.localidad ?? undefined,
    provincia: data.provincia ?? undefined,
    rol: data.rol,
    plan: data.plan,
    plan_activo_hasta: data.plan_activo_hasta ?? undefined,
    consultas_mes: data.consultas_mes,
    created_at: data.created_at,
  };
});

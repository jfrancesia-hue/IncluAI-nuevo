import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

// Marca una consulta como guardada en favoritos (tabla guias_guardadas).
// La consulta ya fue persistida por /api/generar-guia al terminar el stream.

const bodySchema = z.object({
  consulta_id: z.string().uuid(),
  titulo: z.string().trim().min(1).max(160),
});

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const payload = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Payload inválido' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('guias_guardadas')
    .insert({
      consulta_id: parsed.data.consulta_id,
      user_id: user.id,
      titulo: parsed.data.titulo,
      es_favorita: true,
    })
    .select('id')
    .single<{ id: string }>();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, id: data.id });
}

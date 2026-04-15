import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

const feedbackSchema = z.object({
  consulta_id: z.string().uuid(),
  estrellas: z.number().int().min(1).max(5),
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
  const parsed = feedbackSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Payload inválido' }, { status: 400 });
  }

  const { error } = await supabase
    .from('consultas')
    .update({ feedback_estrellas: parsed.data.estrellas })
    .eq('id', parsed.data.consulta_id)
    .eq('user_id', user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}

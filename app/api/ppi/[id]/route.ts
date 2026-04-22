import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { PPIEstado } from '@/lib/types/ppi'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const ESTADOS_VALIDOS: PPIEstado[] = ['borrador', 'completo', 'presentado', 'archivado']

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  let body: { estado?: PPIEstado; seccion?: string; contenido?: unknown } = {}
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const updates: Record<string, unknown> = {}

  if (body.estado) {
    if (!ESTADOS_VALIDOS.includes(body.estado)) {
      return NextResponse.json({ error: 'Estado inválido' }, { status: 400 })
    }
    updates.estado = body.estado
    if (body.estado === 'presentado') updates.presentado_at = new Date().toISOString()
  }

  if (body.seccion && body.contenido) {
    const { data: current } = await supabase
      .from('ppi_documentos')
      .select('secciones')
      .eq('id', id)
      .eq('user_id', user.id)
      .single<{ secciones: Record<string, unknown> }>()
    if (!current) return NextResponse.json({ error: 'PPI no encontrado' }, { status: 404 })
    updates.secciones = { ...current.secciones, [body.seccion]: body.contenido }
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'Nada que actualizar' }, { status: 400 })
  }

  const { error } = await supabase
    .from('ppi_documentos')
    .update(updates)
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { error } = await supabase
    .from('ppi_documentos')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

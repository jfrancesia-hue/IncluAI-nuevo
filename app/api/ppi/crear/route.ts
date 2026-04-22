import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { checkRateLimit } from '@/lib/rate-limit'
import { checkPPILimit } from '@/lib/ppi/plan-limits'
import { generarPPICompleto } from '@/lib/ppi/generar'
import { ppiFormSchema, cicloLectivoActual } from '@/lib/types/ppi'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const rl = await checkRateLimit(`ppi:create:${user.id}`)
  if (!rl.success) {
    return NextResponse.json(
      { error: 'Demasiadas solicitudes. Esperá un minuto.' },
      { status: 429 }
    )
  }

  const limitCheck = await checkPPILimit()
  if (!limitCheck.permitido) {
    return NextResponse.json(
      {
        error:
          limitCheck.razon === 'plan_vencido'
            ? 'Tu plan venció. Renovalo para seguir creando PPIs.'
            : `Alcanzaste el límite de ${limitCheck.limite} PPI${limitCheck.limite === 1 ? '' : 's'} para el ciclo ${limitCheck.ciclo_lectivo}.`,
        limit: limitCheck,
      },
      { status: 402 }
    )
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const parsed = ppiFormSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Datos inválidos', issues: parsed.error.issues },
      { status: 400 }
    )
  }

  const input = parsed.data

  // Guías previas vinculadas (si el docente marcó algunas)
  let guiasPrevias: Array<{ materia?: string; contenido: string }> = []
  if (input.consultas_vinculadas && input.consultas_vinculadas.length > 0) {
    const { data: consultas } = await supabase
      .from('consultas')
      .select('materia, contenido')
      .eq('user_id', user.id)
      .in('id', input.consultas_vinculadas)
      .limit(10)
    guiasPrevias = (consultas ?? []).map((c) => ({
      materia: (c.materia as string) ?? undefined,
      contenido: (c.contenido as string) ?? '',
    }))
  }

  // Crear el documento en estado borrador primero (para tener ID y respetar el límite)
  const { data: nuevo, error: errInsert } = await supabase
    .from('ppi_documentos')
    .insert({
      user_id: user.id,
      alumno_identificador: input.alumno_identificador,
      alumno_edad: input.alumno_edad,
      alumno_nivel: input.alumno_nivel,
      alumno_anio_grado: input.alumno_anio_grado ?? null,
      alumno_discapacidades: input.alumno_discapacidades,
      alumno_diagnostico: input.alumno_diagnostico ?? null,
      institucion: input.institucion,
      ciclo_lectivo: input.ciclo_lectivo || cicloLectivoActual(),
      periodo: input.periodo,
      fortalezas_observadas: input.fortalezas_observadas,
      barreras_observadas: input.barreras_observadas,
      contexto_familiar: input.contexto_familiar ?? null,
      equipo_externo: input.equipo_externo ?? null,
      secciones: {},
      estado: 'borrador',
    })
    .select('id')
    .single()

  if (errInsert || !nuevo) {
    return NextResponse.json(
      { error: 'No se pudo crear el PPI', detail: errInsert?.message },
      { status: 500 }
    )
  }

  const ppiId = nuevo.id as string

  // Vincular consultas (si las hay)
  if (input.consultas_vinculadas && input.consultas_vinculadas.length > 0) {
    await supabase.from('ppi_consultas').insert(
      input.consultas_vinculadas.map((cid) => ({ ppi_id: ppiId, consulta_id: cid }))
    )
  }

  // Llamar a Claude para generar las secciones
  try {
    const secciones = await generarPPICompleto(input, guiasPrevias)
    await supabase
      .from('ppi_documentos')
      .update({
        secciones,
        estado: 'completo',
        generado_at: new Date().toISOString(),
      })
      .eq('id', ppiId)

    return NextResponse.json({ id: ppiId, secciones, estado: 'completo' })
  } catch (err) {
    // El documento queda en borrador — el docente puede reintentar
    const msg = err instanceof Error ? err.message : 'Error generando PPI'
    return NextResponse.json(
      { id: ppiId, estado: 'borrador', error: `Error generando: ${msg}` },
      { status: 502 }
    )
  }
}

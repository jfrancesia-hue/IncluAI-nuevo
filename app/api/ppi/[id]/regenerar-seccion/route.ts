import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { checkRateLimit } from '@/lib/rate-limit'
import { regenerarSeccion } from '@/lib/ppi/generar'
import { ppiRegenerarSeccionSchema } from '@/lib/types/ppi'
import type { PlanUsuario } from '@/lib/types'
import type {
  PPIDocumento,
  PPISecciones,
  PPIFormValues,
} from '@/lib/types/ppi'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 30

export async function POST(
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

  const rl = await checkRateLimit(`ppi:regen:${user.id}`)
  if (!rl.success) {
    return NextResponse.json({ error: 'Demasiadas solicitudes' }, { status: 429 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const parsed = ppiRegenerarSeccionSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Datos inválidos', issues: parsed.error.issues },
      { status: 400 }
    )
  }

  const { data: ppi, error } = await supabase
    .from('ppi_documentos')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single<PPIDocumento>()

  if (error || !ppi) {
    return NextResponse.json({ error: 'PPI no encontrado' }, { status: 404 })
  }

  // Resolver plan del usuario para elegir el modelo (Sonnet vs Opus).
  const { data: perfil } = await supabase
    .from('perfiles')
    .select('plan')
    .eq('id', user.id)
    .single<{ plan: PlanUsuario }>()
  const plan: PlanUsuario = perfil?.plan ?? 'free'

  // Reconstruir PPIFormValues desde la fila
  const formValues: PPIFormValues = {
    alumno_identificador: ppi.alumno_identificador,
    alumno_edad: ppi.alumno_edad,
    alumno_nivel: ppi.alumno_nivel,
    alumno_anio_grado: ppi.alumno_anio_grado,
    alumno_discapacidades: ppi.alumno_discapacidades,
    alumno_diagnostico: ppi.alumno_diagnostico,
    institucion: ppi.institucion,
    jurisdiccion: ppi.jurisdiccion ?? 'bsas',
    ciclo_lectivo: ppi.ciclo_lectivo,
    periodo: ppi.periodo,
    fortalezas_observadas: ppi.fortalezas_observadas ?? '',
    barreras_observadas: ppi.barreras_observadas ?? '',
    contexto_familiar: ppi.contexto_familiar,
    equipo_externo: ppi.equipo_externo,
    familia_responsable: ppi.familia_responsable,
    requiere_interprete_lsa: ppi.requiere_interprete_lsa ?? false,
    consultas_vinculadas: [],
  }

  try {
    const nuevaSeccion = await regenerarSeccion(
      formValues,
      plan,
      parsed.data.seccion,
      parsed.data.instruccion_adicional
    )
    const nuevasSecciones: PPISecciones = {
      ...ppi.secciones,
      [parsed.data.seccion]: nuevaSeccion,
    }
    await supabase
      .from('ppi_documentos')
      .update({ secciones: nuevasSecciones })
      .eq('id', id)

    return NextResponse.json({ seccion: parsed.data.seccion, contenido: nuevaSeccion })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error regenerando sección'
    return NextResponse.json({ error: msg }, { status: 502 })
  }
}

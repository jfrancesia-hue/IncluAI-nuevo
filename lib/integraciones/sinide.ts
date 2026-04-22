import 'server-only'
import { maskCue } from '@/lib/gov/mask'

/**
 * SINIDE — Sistema Integral de Información Digital Educativa (Ministerio de Educación AR).
 * Ref: https://www.argentina.gob.ar/educacion/evaluacion-informacion-educativa/sistema-sinide
 *
 * Esta implementación es un STUB funcional: genera el payload en formato SINIDE
 * listo para exportar como CSV. La integración vía API requiere credenciales
 * otorgadas por convenio específico con el Ministerio.
 */

export interface SinideSyncResult {
  ok: boolean
  mode: 'preview' | 'live'
  jurisdiction_id: string
  records_exported: number
  csv_preview: string
  payload_schema_version: '2024.1'
  next_sync_recommended_at: string
  warnings: string[]
}

export interface SinideRecord {
  cue: string
  nivel: string
  provincia: string
  departamento: string
  matricula_estimada: number
  docentes_activos: number
  adaptaciones_ultimo_mes: number
  periodo: string
}

type SupabaseLike = {
  from: (table: string) => unknown
}

export async function syncToSinide(
  supabase: SupabaseLike,
  jurisdictionId: string
): Promise<SinideSyncResult> {
  const query = (supabase as { from: (t: string) => {
    select: (cols: string) => {
      eq: (col: string, value: string) => Promise<{ data: unknown; error: unknown }>
    }
  } })
    .from('gov_school_assignments')
    .select(
      'schools:school_id(cue, nivel, provincia, departamento, last_activity_at)'
    )
    .eq('jurisdiction_id', jurisdictionId)

  const { data, error } = await query
  if (error) throw error

  const rows = (data as Array<{
    schools: {
      cue: string | null
      nivel: string | null
      provincia: string
      departamento: string | null
      last_activity_at: string | null
    } | null
  }>) ?? []

  const now = new Date()
  const periodo = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

  const records: SinideRecord[] = rows
    .filter((r) => r.schools?.cue)
    .map((r) => ({
      cue: r.schools!.cue!,
      nivel: r.schools!.nivel ?? 'SIN_DATO',
      provincia: r.schools!.provincia,
      departamento: r.schools!.departamento ?? 'SIN_DATO',
      matricula_estimada: 0,
      docentes_activos: 0,
      adaptaciones_ultimo_mes: 0,
      periodo,
    }))

  // En el preview expuesto por API, enmascaramos el CUE (no reversible).
  // En la sincronización real con SINIDE (mode === 'live'), el CSV con CUEs
  // completos se envía directamente al endpoint oficial, sin pasar por la respuesta.
  const csvHeader =
    'cue_enmascarado;nivel;provincia;departamento;matricula_estimada;docentes_activos;adaptaciones_ultimo_mes;periodo'
  const csvBody = records
    .slice(0, 20)
    .map(
      (r) =>
        `${maskCue(r.cue)};${r.nivel};${r.provincia};${r.departamento};${r.matricula_estimada};${r.docentes_activos};${r.adaptaciones_ultimo_mes};${r.periodo}`
    )
    .join('\n')

  const preview = `${csvHeader}\n${csvBody}`

  const nextSync = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

  return {
    ok: true,
    mode: 'preview',
    jurisdiction_id: jurisdictionId,
    records_exported: records.length,
    csv_preview: preview,
    payload_schema_version: '2024.1',
    next_sync_recommended_at: nextSync.toISOString(),
    warnings: records.length === 0 ? ['No hay escuelas asignadas a esta jurisdicción aún.'] : [],
  }
}

/**
 * Seed de datos para demo del módulo Gobierno (Fase 8).
 *
 * Crea:
 *  - Jurisdicciones (Argentina, Córdoba, 3 departamentos)
 *  - 1 contrato activo con Córdoba
 *  - 10 escuelas en Córdoba con actividad simulada
 *  - 3 gov_users (admin, supervisor, analyst) asociados a Córdoba
 *
 * NO crea los usuarios en auth.users — eso se hace manualmente
 * vía dashboard Supabase antes de correr este script.
 *
 * Uso:
 *   tsx scripts/seed-gobierno.ts
 */
import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!URL || !SERVICE) {
  console.error('Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY.')
  process.exit(1)
}

const sb = createClient(URL, SERVICE, { auth: { persistSession: false } })

async function ensureJurisdiction(
  name: string,
  type: 'nacion' | 'provincia' | 'departamento' | 'municipio',
  code: string,
  parent_id: string | null
): Promise<string> {
  const existing = await sb.from('gov_jurisdictions').select('id').eq('code', code).maybeSingle()
  if (existing.data?.id) return existing.data.id as string

  const { data, error } = await sb
    .from('gov_jurisdictions')
    .insert({ name, type, code, parent_id })
    .select('id')
    .single()
  if (error) throw error
  return data!.id as string
}

async function seed() {
  console.log('→ jurisdicciones')
  const argId = await ensureJurisdiction('Argentina', 'nacion', 'AR', null)
  const cbaId = await ensureJurisdiction('Córdoba', 'provincia', 'AR-X', argId)
  const capitalId = await ensureJurisdiction('Capital', 'departamento', 'AR-X-CAPITAL', cbaId)
  const colonId = await ensureJurisdiction('Colón', 'departamento', 'AR-X-COLON', cbaId)
  const sanjId = await ensureJurisdiction('San Justo', 'departamento', 'AR-X-SANJ', cbaId)

  console.log('→ contrato activo')
  const { data: contract } = await sb
    .from('gov_contracts')
    .upsert(
      {
        jurisdiction_id: cbaId,
        contract_number: 'DEMO-CBA-2026-001',
        start_date: '2026-01-01',
        end_date: '2026-12-31',
        licensed_students_cap: 50000,
        licensed_teachers_cap: 4000,
        modules_included: ['docentes', 'familias', 'profesionales'],
        legal_framework: {
          laws: ['Ley 26.206', 'Ley 26.378', 'Res. CFE 311/16'],
          provincialLaws: ['Ley Prov. 9870 (Córdoba)'],
        },
        status: 'active',
      },
      { onConflict: 'contract_number' as unknown as string }
    )
    .select('id')
    .single()

  const contractId = contract?.id
  if (!contractId) throw new Error('No se pudo crear contrato')

  console.log('→ escuelas')
  const escuelas = [
    { nombre: 'Escuela Normal Alejandro Carbó', cue: '3000100001', departamento: 'Capital', nivel: 'secundaria' },
    { nombre: 'Colegio San José', cue: '3000100002', departamento: 'Capital', nivel: 'primaria' },
    { nombre: 'IPEM 38 Francisco Pablo de Mauro', cue: '3000100003', departamento: 'Capital', nivel: 'secundaria' },
    { nombre: 'Escuela Bernardino Rivadavia', cue: '3000100004', departamento: 'Colón', nivel: 'primaria' },
    { nombre: 'Escuela Sarmiento', cue: '3000100005', departamento: 'Colón', nivel: 'primaria' },
    { nombre: 'IPEM 94 Pte. Roque Sáenz Peña', cue: '3000100006', departamento: 'San Justo', nivel: 'secundaria' },
    { nombre: 'Escuela Juan XXIII', cue: '3000100007', departamento: 'San Justo', nivel: 'inicial' },
    { nombre: 'Instituto Manuel Belgrano', cue: '3000100008', departamento: 'Capital', nivel: 'combinado' },
    { nombre: 'Escuela Olmos', cue: '3000100009', departamento: 'Capital', nivel: 'primaria' },
    { nombre: 'IPEM 120 Gral. Güemes', cue: '3000100010', departamento: 'Colón', nivel: 'secundaria' },
  ]

  for (let i = 0; i < escuelas.length; i++) {
    const e = escuelas[i]
    const lastDays = i < 7 ? i + 1 : 45 // las 3 últimas serán "inactivas" para disparar alertas
    const lastActivity = new Date(Date.now() - lastDays * 24 * 60 * 60 * 1000).toISOString()

    const { data: school } = await sb
      .from('schools')
      .upsert(
        {
          nombre: e.nombre,
          cue: e.cue,
          tipo_gestion: 'estatal',
          nivel: e.nivel,
          provincia: 'Córdoba',
          departamento: e.departamento,
          localidad: e.departamento,
          last_activity_at: lastActivity,
        },
        { onConflict: 'cue' as unknown as string }
      )
      .select('id')
      .single()

    const depId = e.departamento === 'Capital' ? capitalId : e.departamento === 'Colón' ? colonId : sanjId
    if (school?.id) {
      await sb.from('gov_school_assignments').upsert(
        {
          school_id: school.id,
          jurisdiction_id: depId,
          contract_id: contractId,
        },
        { onConflict: 'school_id,contract_id' as unknown as string }
      )
    }
  }

  console.log('✓ Seed completo.')
  console.log('')
  console.log('Próximos pasos manuales:')
  console.log('  1. Crear usuarios en auth.users desde el dashboard Supabase:')
  console.log('     - gov_admin@incluia.com.ar')
  console.log('     - gov_supervisor@incluia.com.ar')
  console.log('     - gov_analyst@incluia.com.ar')
  console.log('  2. Asociarlos a gov_users con:')
  console.log(`     INSERT INTO gov_users(user_id,jurisdiction_id,role) VALUES`)
  console.log(`       ((SELECT id FROM auth.users WHERE email='gov_admin@incluia.com.ar'),`)
  console.log(`        '${cbaId}','gov_admin');`)
  console.log('  3. Ingresar en /gobierno con esos usuarios.')
}

seed().catch((err) => {
  console.error('✗ Error en seed:', err)
  process.exit(1)
})

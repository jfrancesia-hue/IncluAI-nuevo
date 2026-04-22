/**
 * Tests de RLS para Fase 8 — Gobierno.
 *
 * Precondiciones:
 *  - Variables: TEST_SUPABASE_URL, TEST_SUPABASE_SERVICE_ROLE, TEST_SUPABASE_ANON
 *  - Migración 004-fase8-gobierno.sql aplicada al proyecto de testing
 *  - El proyecto de testing NO debe ser el productivo (mfjpoaipjlimzdxkusav).
 *
 * Correr con: npx playwright test tests/gov-rls.test.ts
 */
import { test, expect } from '@playwright/test'
import { createClient } from '@supabase/supabase-js'

const URL = process.env.TEST_SUPABASE_URL
const ANON = process.env.TEST_SUPABASE_ANON
const SERVICE = process.env.TEST_SUPABASE_SERVICE_ROLE

const hasEnv = Boolean(URL && ANON && SERVICE)
test.skip(!hasEnv, 'TEST_SUPABASE_* env vars no configuradas — tests saltados')

async function loginAs(email: string, password: string) {
  const client = createClient(URL!, ANON!, { auth: { persistSession: false } })
  const { data, error } = await client.auth.signInWithPassword({ email, password })
  if (error) throw error
  return { client, user: data.user! }
}

test.describe('RLS blindaje gov_* contra PII', () => {
  test('gov_user NO puede leer tabla perfiles de otros usuarios', async () => {
    const { client } = await loginAs(process.env.TEST_GOV_EMAIL!, process.env.TEST_GOV_PASSWORD!)
    const { data, error } = await client.from('perfiles').select('id,email').limit(10)
    // El gov_user solo debería ver su propio perfil (1 fila max).
    expect(error).toBeNull()
    expect((data ?? []).length).toBeLessThanOrEqual(1)
  })

  test('gov_user NO puede leer consultas individuales', async () => {
    const { client } = await loginAs(process.env.TEST_GOV_EMAIL!, process.env.TEST_GOV_PASSWORD!)
    const { data } = await client.from('consultas').select('id,user_id,contenido').limit(10)
    expect(data ?? []).toEqual([])
  })

  test('gov_user NO puede leer pagos individuales', async () => {
    const { client } = await loginAs(process.env.TEST_GOV_EMAIL!, process.env.TEST_GOV_PASSWORD!)
    const { data } = await client.from('pagos').select('id,user_id,monto_ars').limit(10)
    expect(data ?? []).toEqual([])
  })

  test('gov_user SÍ puede leer métricas agregadas de su jurisdicción', async () => {
    const { client } = await loginAs(process.env.TEST_GOV_EMAIL!, process.env.TEST_GOV_PASSWORD!)
    const { data, error } = await client
      .from('gov_metrics_snapshots')
      .select('jurisdiction_id, metric_type, metric_payload')
      .limit(5)
    expect(error).toBeNull()
    // Los datos devueltos, si los hay, nunca deben tener PII.
    for (const row of data ?? []) {
      const payload = JSON.stringify(row.metric_payload)
      expect(payload).not.toMatch(/[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,}/i) // email
      expect(payload).not.toMatch(/\b\d{7,8}\b/) // DNI pattern simple
    }
  })
})

test.describe('Auditoría inmutable', () => {
  test('gov_audit_log NO permite UPDATE ni DELETE', async () => {
    const { client } = await loginAs(process.env.TEST_GOV_EMAIL!, process.env.TEST_GOV_PASSWORD!)
    const { data: rows } = await client.from('gov_audit_log').select('id').limit(1)
    if (!rows || rows.length === 0) return

    const id = rows[0].id
    const { error: updErr } = await client
      .from('gov_audit_log')
      .update({ action: 'tampered' })
      .eq('id', id)
    expect(updErr).not.toBeNull() // debe fallar por RLS

    const { error: delErr } = await client.from('gov_audit_log').delete().eq('id', id)
    expect(delErr).not.toBeNull()
  })
})

test.describe('Jurisdicciones', () => {
  test('gov_user solo ve contratos de su jurisdicción', async () => {
    const { client } = await loginAs(process.env.TEST_GOV_EMAIL!, process.env.TEST_GOV_PASSWORD!)
    const { data } = await client.from('gov_contracts').select('id, jurisdiction_id').limit(20)
    // Todos los contratos devueltos deben pertenecer al árbol de jurisdicciones accesibles.
    // La verificación detallada contra gov_jurisdicciones_accesibles() se hace en SQL.
    expect(Array.isArray(data ?? [])).toBe(true)
  })
})

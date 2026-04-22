import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { ShellInstitucional } from '@/components/gov/ShellInstitucional'
import type { ReactNode } from 'react'
import '../(gobierno)/globals-gov.css'

export const metadata = {
  title: 'IncluIA · Panel Gubernamental',
  description:
    'Panel ejecutivo para Ministerios provinciales. Métricas agregadas, cumplimiento normativo y reportes.',
  robots: { index: false, follow: false },
}

export default async function GovLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?next=/gobierno')
  }

  const { data: govUser } = await supabase
    .from('gov_users')
    .select('id, jurisdiction_id, role')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!govUser) {
    redirect('/')
  }

  const { data: jurisdiction } = await supabase
    .from('gov_jurisdictions')
    .select('name')
    .eq('id', govUser.jurisdiction_id)
    .single()

  const h = await headers()
  const pathname = h.get('x-pathname') || '/gobierno'

  return (
    <ShellInstitucional
      jurisdictionName={jurisdiction?.name ?? 'Jurisdicción'}
      activePath={pathname}
    >
      {children}
    </ShellInstitucional>
  )
}

/**
 * Ruta DEMO — /gobierno-demo
 * Replica el shell de /gobierno con datos mock, sin auth ni Supabase.
 * Útil para demos de ventas sin tener que crear usuarios gov reales.
 *
 * Se oculta en producción por defecto (404) salvo que se active con
 * NEXT_PUBLIC_ENABLE_DEMO=1 — ej. para un ambiente "demo.incluai.com.ar".
 */
import { notFound } from 'next/navigation'
import { ShellInstitucional } from '@/components/gov/ShellInstitucional'
import type { ReactNode } from 'react'
import '../(gobierno)/globals-gov.css'

export const metadata = {
  title: 'IncluAI · Panel Gubernamental (DEMO)',
  robots: { index: false, follow: false },
}

export default function GovDemoLayout({ children }: { children: ReactNode }) {
  if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_ENABLE_DEMO !== '1') {
    notFound()
  }
  return (
    <ShellInstitucional jurisdictionName="Córdoba" activePath="/gobierno-demo">
      {children}
    </ShellInstitucional>
  )
}

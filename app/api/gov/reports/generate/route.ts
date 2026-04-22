import { NextRequest, NextResponse } from 'next/server'
import { guardGovApi } from '@/lib/gov/guard'
import { generateReport } from '@/lib/gov/reports'
import type { ReportGenerateRequest, GovAuditAction } from '@/lib/types/gobierno'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const AUDIT_MAP: Record<ReportGenerateRequest['kind'], GovAuditAction> = {
  pdf_ejecutivo: 'generate_report_pdf_exec',
  pdf_tecnico: 'generate_report_pdf_tecnico',
  xlsx_dataset: 'generate_report_xlsx',
  png_infografia: 'generate_infographic_png',
}

const VALID_KINDS = Object.keys(AUDIT_MAP) as ReportGenerateRequest['kind'][]

export async function POST(req: NextRequest) {
  const guard = await guardGovApi(req)
  if (!guard.ok) return guard.response

  const { supabase, gov, audit } = guard

  let body: ReportGenerateRequest
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  if (!body.kind || !body.jurisdiction_id || !body.period_from || !body.period_to) {
    return NextResponse.json(
      { error: 'Campos requeridos: kind, jurisdiction_id, period_from, period_to' },
      { status: 400 }
    )
  }

  if (!VALID_KINDS.includes(body.kind)) {
    return NextResponse.json(
      { error: `kind inválido. Valores permitidos: ${VALID_KINDS.join(', ')}` },
      { status: 400 }
    )
  }

  if (body.jurisdiction_id !== gov.jurisdiction_id) {
    return NextResponse.json(
      { error: 'No podés generar reportes de otra jurisdicción.' },
      { status: 403 }
    )
  }

  const report = await generateReport(supabase as never, body)
  const action = AUDIT_MAP[body.kind]

  await audit(action, {
    type: 'report',
    id: gov.jurisdiction_id,
    payload: { kind: body.kind, size: report.size_bytes },
  })

  return NextResponse.json(report)
}

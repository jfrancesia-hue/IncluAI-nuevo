import 'server-only'
import type {
  ReportGenerateRequest,
  ReportGenerateResponse,
} from '@/lib/types/gobierno'
import {
  getCoverageMetrics,
  getImpactMetrics,
  getComplianceMetrics,
} from '@/lib/gov/metrics'

type SupabaseLike = { from: (t: string) => unknown }

/**
 * Genera un reporte para la jurisdicción solicitada.
 * Para MVP: devuelve data: URI con contenido generado on-the-fly.
 * En producción se mueve a storage Supabase con URL firmada.
 */
export async function generateReport(
  supabase: SupabaseLike,
  req: ReportGenerateRequest
): Promise<ReportGenerateResponse> {
  const [coverage, impact, compliance] = await Promise.all([
    getCoverageMetrics(supabase as never, req.jurisdiction_id),
    getImpactMetrics(supabase as never, req.jurisdiction_id),
    getComplianceMetrics(supabase as never, req.jurisdiction_id),
  ])

  let content = ''
  let mime = 'text/plain'

  if (req.kind === 'pdf_ejecutivo' || req.kind === 'pdf_tecnico') {
    const isExec = req.kind === 'pdf_ejecutivo'
    const title = isExec ? 'Reporte Ejecutivo' : 'Reporte Técnico'
    content = buildPdfLikeMarkdown(title, { coverage, impact, compliance, period: req })
    mime = 'text/markdown'
  } else if (req.kind === 'xlsx_dataset') {
    content = buildCsvDataset({ coverage, impact, compliance })
    mime = 'text/csv'
  } else if (req.kind === 'png_infografia') {
    content = buildSvgInfographic({ coverage, impact, compliance })
    mime = 'image/svg+xml'
  }

  const dataUri = `data:${mime};base64,${Buffer.from(content, 'utf-8').toString('base64')}`
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000)

  return {
    kind: req.kind,
    url: dataUri,
    size_bytes: Buffer.byteLength(content, 'utf-8'),
    expires_at: expires.toISOString(),
    audit_log_id: 'inline',
  }
}

type ReportBundle = {
  coverage: Awaited<ReturnType<typeof getCoverageMetrics>>
  impact: Awaited<ReturnType<typeof getImpactMetrics>>
  compliance: Awaited<ReturnType<typeof getComplianceMetrics>>
  period?: ReportGenerateRequest
}

function buildPdfLikeMarkdown(title: string, b: ReportBundle): string {
  return `# ${title} — IncluIA
Período: ${b.period?.period_from ?? '-'} a ${b.period?.period_to ?? '-'}

## Cobertura
- Escuelas activas: ${b.coverage.schoolsActive}/${b.coverage.schoolsTotal} (${b.coverage.coveragePercent}%)
- Docentes activos últimos 7 días: ${b.coverage.teachersActive}
- Estudiantes alcanzados (estimado): ${b.coverage.studentsAssisted}

## Impacto pedagógico
- Adaptaciones generadas (30d): ${b.impact.adaptationsGenerated}
- Módulo Docentes: ${b.impact.adaptationsDocentes}
- Módulo Familias: ${b.impact.orientationsFamilias}
- Módulo Profesionales: ${b.impact.derivationsProfesionales}
- Horas docentes ahorradas: ${b.impact.teacherHoursSaved}
- Feedback promedio: ${b.impact.avgFeedbackStars ?? '—'} / 5

## Cumplimiento normativo
- CFE 311/16: ${b.compliance.cfe_311_16_score}%
- WCAG 2.1 AA: ${b.compliance.wcag_21_aa_score}%
- Ley 25.326 (protección datos): ${b.compliance.ley_25326_score}%
- Ley 26.653 (accesibilidad): ${b.compliance.ley_26653_score}%
- ISO 27001 readiness: ${b.compliance.iso_27001_readiness}%

---
Generado automáticamente por IncluIA. Datos agregados — no contiene PII individual.
Fuente: Nativos Consultora Digital.
`
}

function buildCsvDataset(b: ReportBundle): string {
  return [
    'metric_group,metric_name,value',
    `coverage,schools_active,${b.coverage.schoolsActive}`,
    `coverage,schools_total,${b.coverage.schoolsTotal}`,
    `coverage,teachers_active_7d,${b.coverage.teachersActive}`,
    `coverage,coverage_percent,${b.coverage.coveragePercent}`,
    `impact,adaptations_total,${b.impact.adaptationsGenerated}`,
    `impact,adaptations_docentes,${b.impact.adaptationsDocentes}`,
    `impact,orientations_familias,${b.impact.orientationsFamilias}`,
    `impact,derivations_profesionales,${b.impact.derivationsProfesionales}`,
    `impact,teacher_hours_saved,${b.impact.teacherHoursSaved}`,
    `compliance,cfe_311_16,${b.compliance.cfe_311_16_score}`,
    `compliance,wcag_21_aa,${b.compliance.wcag_21_aa_score}`,
    `compliance,ley_25326,${b.compliance.ley_25326_score}`,
    `compliance,ley_26653,${b.compliance.ley_26653_score}`,
  ].join('\n')
}

function buildSvgInfographic(b: ReportBundle): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <rect width="100%" height="100%" fill="#0B3D91"/>
  <text x="60" y="100" font-family="Inter, system-ui" font-size="48" fill="#ffffff" font-weight="700">IncluIA</text>
  <text x="60" y="150" font-family="Inter" font-size="22" fill="#B8D0FF">Resultados del mes</text>
  <text x="60" y="260" font-family="Inter" font-size="72" fill="#ffffff" font-weight="800">${b.coverage.schoolsActive}</text>
  <text x="60" y="300" font-family="Inter" font-size="20" fill="#B8D0FF">escuelas activas</text>
  <text x="440" y="260" font-family="Inter" font-size="72" fill="#ffffff" font-weight="800">${b.impact.adaptationsGenerated}</text>
  <text x="440" y="300" font-family="Inter" font-size="20" fill="#B8D0FF">adaptaciones generadas</text>
  <text x="860" y="260" font-family="Inter" font-size="72" fill="#ffffff" font-weight="800">${b.impact.teacherHoursSaved}</text>
  <text x="860" y="300" font-family="Inter" font-size="20" fill="#B8D0FF">horas ahorradas a docentes</text>
  <text x="60" y="570" font-family="Inter" font-size="16" fill="#B8D0FF">Nativos Consultora Digital · incluia.com.ar</text>
</svg>`
}

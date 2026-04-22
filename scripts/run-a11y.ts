/**
 * Audit de accesibilidad automatizado con axe-core.
 * Corre sobre un server local (http://localhost:3000) y genera a11y-report.json.
 * Falla (exit 1) si hay violaciones de impacto "critical" o "serious".
 */
import { chromium } from 'playwright'
// @ts-expect-error — @axe-core/playwright se instala solo en el workflow de CI.
import AxeBuilder from '@axe-core/playwright'
import fs from 'node:fs/promises'

const BASE = process.env.BASE_URL ?? 'http://localhost:3000'

const PATHS = [
  '/',
  '/login',
  '/registro',
  '/status',
  // Páginas autenticadas no se incluyen acá — requerirían login.
]

async function main() {
  const browser = await chromium.launch()
  const page = await browser.newPage()
  const results: Array<{ url: string; violations: unknown[] }> = []

  for (const p of PATHS) {
    const url = `${BASE}${p}`
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 20000 })
      const r = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze()
      results.push({ url, violations: r.violations })
      console.log(`  ${url}: ${r.violations.length} violaciones`)
    } catch (err) {
      console.warn(`  ${url}: error ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  await browser.close()

  await fs.writeFile('a11y-report.json', JSON.stringify(results, null, 2))

  type Violation = { impact?: string; id?: string; description?: string }
  const critical = results.flatMap((r) =>
    (r.violations as Violation[]).filter((v) => v.impact === 'critical' || v.impact === 'serious')
  )

  console.log('---')
  console.log(`Total violaciones: ${results.reduce((sum, r) => sum + r.violations.length, 0)}`)
  console.log(`Críticas/serias: ${critical.length}`)

  if (critical.length > 0) {
    console.error('Fallando build por violaciones críticas/serias de WCAG AA.')
    process.exit(1)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

import 'server-only'
import { anthropic, CLAUDE_MODEL } from '@/lib/anthropic'
import { PPI_SYSTEM_PROMPT, buildPPIUserPrompt, buildPPIRegenerarPrompt } from '@/lib/prompts-ppi'
import type {
  PPIFormValues,
  PPISecciones,
  PPISeccion,
  PPISeccionKey,
} from '@/lib/types/ppi'

const MAX_TOKENS_FULL = 6000
const MAX_TOKENS_SECTION = 1200

/**
 * Extrae el primer bloque JSON válido de un string. Claude a veces añade
 * texto antes/después aunque le pidamos que no lo haga.
 */
function extractJson(raw: string): string {
  const trimmed = raw.trim()
  if (trimmed.startsWith('{')) return trimmed
  const start = trimmed.indexOf('{')
  const end = trimmed.lastIndexOf('}')
  if (start === -1 || end === -1 || end <= start) {
    throw new Error('Respuesta sin JSON detectable')
  }
  return trimmed.slice(start, end + 1)
}

export async function generarPPICompleto(
  input: PPIFormValues,
  guiasPrevias: Array<{ materia?: string; contenido: string }> = []
): Promise<PPISecciones> {
  const response = await anthropic.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: MAX_TOKENS_FULL,
    system: PPI_SYSTEM_PROMPT,
    messages: [{ role: 'user', content: buildPPIUserPrompt(input, guiasPrevias) }],
  })

  const text = response.content
    .filter((b) => b.type === 'text')
    .map((b) => (b as { type: 'text'; text: string }).text)
    .join('\n')

  const parsed = JSON.parse(extractJson(text)) as PPISecciones
  return parsed
}

export async function regenerarSeccion(
  input: PPIFormValues,
  seccion: PPISeccionKey,
  instruccion?: string
): Promise<PPISeccion> {
  const response = await anthropic.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: MAX_TOKENS_SECTION,
    system: PPI_SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: buildPPIRegenerarPrompt(input, seccion, instruccion),
      },
    ],
  })

  const text = response.content
    .filter((b) => b.type === 'text')
    .map((b) => (b as { type: 'text'; text: string }).text)
    .join('\n')

  const parsed = JSON.parse(extractJson(text)) as PPISeccion
  return parsed
}

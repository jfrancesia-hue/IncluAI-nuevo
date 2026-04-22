import crypto from 'node:crypto'

/**
 * Enmascarado no reversible para CUE (Código Único de Establecimiento).
 * Los CUEs son públicos y enumerables, por lo que un masking parcial
 * (ej: "3000****12") reidentifica en segundos cruzando data pública.
 *
 * Usamos SHA-256 truncado con una sal interna. El resultado no se puede
 * correlacionar con el CUE original sin conocer la sal + tener el CUE en claro.
 */
const SALT = process.env.GOV_CUE_MASK_SALT ?? 'incluia-gov-mask-v1'

export function maskCue(cue: string | null | undefined): string {
  if (!cue) return 'ESC-UNKNOWN'
  const hash = crypto.createHash('sha256').update(`${SALT}:${cue}`).digest('hex')
  return `ESC-${hash.slice(0, 8).toUpperCase()}`
}

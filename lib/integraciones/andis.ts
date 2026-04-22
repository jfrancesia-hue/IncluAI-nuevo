import 'server-only'

/**
 * ANDIS — Agencia Nacional de Discapacidad.
 * Validación voluntaria de Certificado Único de Discapacidad (CUD).
 * Ref: https://www.argentina.gob.ar/andis
 *
 * STUB: la consulta real requiere consentimiento explícito del titular y
 * convenio de interoperabilidad. Esta función genera un resultado simulado
 * para permitir testing del flujo de UX.
 */

export interface CudValidationRequest {
  cuil: string
  consent_given: boolean
  consent_timestamp: string
}

export interface CudValidationResult {
  valid: boolean
  mode: 'stub' | 'live'
  cuil_masked: string
  emitido_en?: string
  vence_el?: string
  tipo_discapacidad?: string[]
  requires_review: boolean
  message: string
}

function maskCuil(cuil: string): string {
  const digits = cuil.replace(/\D/g, '')
  if (digits.length !== 11) return '**-********-*'
  return `${digits.slice(0, 2)}-********-${digits.slice(-1)}`
}

export async function validateCud(req: CudValidationRequest): Promise<CudValidationResult> {
  if (!req.consent_given) {
    return {
      valid: false,
      mode: 'stub',
      cuil_masked: maskCuil(req.cuil),
      requires_review: true,
      message:
        'Consentimiento no otorgado. La validación de CUD requiere consentimiento explícito del titular o representante legal.',
    }
  }

  return {
    valid: true,
    mode: 'stub',
    cuil_masked: maskCuil(req.cuil),
    emitido_en: '2023-05-10',
    vence_el: '2028-05-10',
    tipo_discapacidad: ['visceral'],
    requires_review: false,
    message:
      'STUB: la validación real contra ANDIS se habilita al firmar convenio de interoperabilidad.',
  }
}

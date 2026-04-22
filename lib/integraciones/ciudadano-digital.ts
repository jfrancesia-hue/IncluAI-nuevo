import 'server-only'

/**
 * Ciudadano Digital Córdoba — SSO OAuth para funcionarios provinciales.
 * Ref: https://cidi.cba.gov.ar/
 *
 * STUB: en producción se requiere registro como aplicación certificada ante la
 * Secretaría de Innovación Pública de Córdoba. El flujo real es OAuth 2.0
 * con nivel de seguridad 2 o 3.
 */

export interface CidiOAuthConfig {
  authorization_url: string
  token_url: string
  userinfo_url: string
  scopes: string[]
  nivel_seguridad: 1 | 2 | 3
}

export const CIDI_CONFIG: CidiOAuthConfig = {
  authorization_url: 'https://cidi.cba.gov.ar/oauth2/authorize',
  token_url: 'https://cidi.cba.gov.ar/oauth2/token',
  userinfo_url: 'https://cidi.cba.gov.ar/oauth2/userinfo',
  scopes: ['openid', 'profile', 'email', 'cuil'],
  nivel_seguridad: 2,
}

export interface CidiUserInfo {
  cuil: string
  apellido: string
  nombre: string
  email: string
  nivel_verificacion: 1 | 2 | 3
}

export function buildAuthorizationUrl(params: {
  clientId: string
  redirectUri: string
  state: string
}): string {
  const qs = new URLSearchParams({
    response_type: 'code',
    client_id: params.clientId,
    redirect_uri: params.redirectUri,
    scope: CIDI_CONFIG.scopes.join(' '),
    state: params.state,
  })
  return `${CIDI_CONFIG.authorization_url}?${qs.toString()}`
}

/**
 * Stub: en implementación real, hace POST a CIDI_CONFIG.token_url y GET a userinfo_url.
 * Por ahora devuelve un error explícito para forzar login por Supabase email/password
 * hasta que se obtenga el client_id productivo.
 */
export async function exchangeCodeForUserInfo(_code: string): Promise<CidiUserInfo> {
  throw new Error(
    'Ciudadano Digital Córdoba — integración pendiente de convenio. Usar login email/password por ahora.'
  )
}

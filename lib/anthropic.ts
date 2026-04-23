import Anthropic from '@anthropic-ai/sdk';

const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
if (!apiKey) {
  throw new Error('ANTHROPIC_API_KEY no está definida');
}

export const anthropic = new Anthropic({ apiKey });

export const CLAUDE_MODEL = 'claude-sonnet-4-6' as const;

// v2.1 con Haiku 4.5: el schema JSON pesa ~4k tokens solo el esquema y la
// guia generada ~3.5k. Sonnet tomaba 45-55s y timeouteaba el 60s de Vercel
// Hobby. Haiku 4.5 es 3-5x mas rapido con adherencia al schema aceptable
// para este tipo estructurado.  Si la calidad baja mucho, upgrade a Vercel
// Pro (maxDuration 300s) y volver a Sonnet/Opus.
export const CLAUDE_MODEL_V2 = 'claude-haiku-4-5-20251001' as const;

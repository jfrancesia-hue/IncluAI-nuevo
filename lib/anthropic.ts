import Anthropic from '@anthropic-ai/sdk';

const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
if (!apiKey) {
  throw new Error('ANTHROPIC_API_KEY no está definida');
}

export const anthropic = new Anthropic({ apiKey });

export const CLAUDE_MODEL = 'claude-sonnet-4-6' as const;

// v2.1 con Sonnet 4.6 + tool-use: el prompt ya no embebe el schema (~4k
// tokens menos), asi que Sonnet entra comodo en el maxDuration 60s de
// Vercel Hobby. Haiku era mas rapido pero ignoraba maxLength del schema
// y omitia campos requeridos; Sonnet respeta el schema estricto.
export const CLAUDE_MODEL_V2 = 'claude-sonnet-4-6' as const;

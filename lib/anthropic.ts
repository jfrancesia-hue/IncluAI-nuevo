import Anthropic from '@anthropic-ai/sdk';

const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
if (!apiKey) {
  throw new Error('ANTHROPIC_API_KEY no está definida');
}

export const anthropic = new Anthropic({ apiKey });

export const CLAUDE_MODEL = 'claude-sonnet-4-6' as const;

// v2.1 con Sonnet 4.6: suficiente para el JSON estructurado y ~3x más rápido
// que Opus dentro del maxDuration de 60s de Vercel Hobby. Si hiciera falta
// mayor adherencia, volver a Opus requiere Vercel Pro (maxDuration 300s).
export const CLAUDE_MODEL_V2 = 'claude-sonnet-4-6' as const;

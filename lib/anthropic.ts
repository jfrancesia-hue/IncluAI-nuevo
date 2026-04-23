import Anthropic from '@anthropic-ai/sdk';

const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
if (!apiKey) {
  throw new Error('ANTHROPIC_API_KEY no está definida');
}

export const anthropic = new Anthropic({ apiKey });

export const CLAUDE_MODEL = 'claude-sonnet-4-6' as const;

// v2.1 con Opus 4.7 + tool-use: maxima calidad de JSON estructurado y
// adherencia estricta al schema. Con Vercel Pro (maxDuration 300s) Opus
// tiene margen de sobra para generar 8000 tokens + enriquecer imagenes.
export const CLAUDE_MODEL_V2 = 'claude-opus-4-7' as const;

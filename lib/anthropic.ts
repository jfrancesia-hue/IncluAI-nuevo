import Anthropic from '@anthropic-ai/sdk';

const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
if (!apiKey) {
  throw new Error('ANTHROPIC_API_KEY no está definida');
}

export const anthropic = new Anthropic({ apiKey });

export const CLAUDE_MODEL = 'claude-sonnet-4-6' as const;

// v2.1 usa Opus para el JSON estructurado con multimedia — más preciso en
// adherencia al schema Zod y en queries de Unsplash en inglés.
export const CLAUDE_MODEL_V2 = 'claude-opus-4-7' as const;

import Anthropic from '@anthropic-ai/sdk';
import { LIMITES_PLAN, type PlanUsuario } from './types';

const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
if (!apiKey) {
  throw new Error('ANTHROPIC_API_KEY no está definida');
}

export const anthropic = new Anthropic({ apiKey });

/**
 * Resuelve el modelo de Claude según el plan del usuario.
 * Sonnet 4.6 para Free/Básico/Profesional; Opus 4.7 solo para Premium.
 * Fallback a modelo Free si el plan es desconocido.
 */
export function getModelForPlan(plan: PlanUsuario): string {
  return LIMITES_PLAN[plan]?.modelo ?? LIMITES_PLAN.free.modelo;
}

/**
 * Modelo fijo para trabajos operativos/internos (enrichment, reformateo,
 * housekeeping) que NO son el output principal al usuario. Siempre Sonnet
 * porque estas tareas son reformatear texto ya generado — Opus sería un
 * desperdicio aun para usuarios Premium.
 */
export const MODELO_OPERATIVO = 'claude-sonnet-4-6' as const;

import 'server-only';
import { track } from '@vercel/analytics/server';
import { logError } from './errors';

// Eventos de conversión del funnel IncluAI.
//
// El tipo es cerrado: si querés agregar un evento nuevo, ampliálo acá. Así
// ninguna parte del código dispara strings sueltos que después no sabemos
// qué significan en el dashboard.

export type ConversionEvent =
  | 'sign_up'
  | 'first_consulta_completed'
  | 'plan_upgraded'
  | 'pdf_downloaded';

export type EventProps = Record<string, string | number | boolean | null>;

/**
 * Trackea un evento custom de Vercel Analytics desde código server (server
 * actions, route handlers, server components). Fail-safe: si Analytics no
 * está disponible o falla, solo loguea, nunca tira.
 */
export async function trackServerEvent(
  event: ConversionEvent,
  props?: EventProps
): Promise<void> {
  try {
    await track(event, props ?? {});
  } catch (err) {
    // No queremos que un fallo de analytics rompa un flujo de negocio.
    logError(err, {
      source: 'analytics/trackServerEvent',
      metadata: { event, props: props ?? null },
    });
  }
}

// Helper tipado para Meta Pixel (fbq).
//
// Carga del script: `components/analytics/MetaPixel.tsx` lo inyecta una sola vez
// en el layout raíz. Acá vivien solo helpers para disparar eventos desde
// componentes client.
//
// fail-safe: si el Pixel no cargó (ad blocker, sin NEXT_PUBLIC_META_PIXEL_ID
// configurado, SSR), las funciones no tiran — se hacen no-op.

export const META_PIXEL_ID =
  process.env.NEXT_PUBLIC_META_PIXEL_ID ?? '1526646735698124';

// Eventos estándar que usamos en el funnel. Mantener cerrado para que el
// dashboard de Eventos en Meta no se ensucie con strings sueltos.
export type StandardEvent =
  | 'PageView'
  | 'ViewContent'
  | 'Lead'
  | 'CompleteRegistration'
  | 'Subscribe';

// Custom events de la app autenticada. Aparecen en Meta como "Custom".
export type CustomEvent = 'ActividadCreada' | 'TutorialComplete';

export type EventParams = Record<
  string,
  string | number | boolean | null | undefined
>;

type Fbq = {
  (cmd: 'init', pixelId: string): void;
  (cmd: 'track', event: StandardEvent, params?: EventParams): void;
  (cmd: 'trackCustom', event: CustomEvent, params?: EventParams): void;
  queue?: unknown[];
  loaded?: boolean;
  version?: string;
};

declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: Fbq;
  }
}

function getFbq(): Fbq | null {
  if (typeof window === 'undefined') return null;
  return window.fbq ?? null;
}

export function trackPixel(event: StandardEvent, params?: EventParams): void {
  const fbq = getFbq();
  if (!fbq) return;
  fbq('track', event, params);
}

export function trackPixelCustom(
  event: CustomEvent,
  params?: EventParams
): void {
  const fbq = getFbq();
  if (!fbq) return;
  fbq('trackCustom', event, params);
}

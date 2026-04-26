'use client';

import { useEffect } from 'react';
import { trackPixel } from '@/lib/pixel';

type Props = {
  value: number;
  currency?: string;
  plan: string;
  paymentId?: string;
};

// Dispara fbq('track','Subscribe', { value, currency }) una sola vez
// al montar la página de éxito de pago. El paymentId se usa como key
// de deduplicación local (sessionStorage) para evitar dobles disparos
// si el usuario refresca la pestaña.
export function TrackSubscribe({
  value,
  currency = 'ARS',
  plan,
  paymentId,
}: Props) {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const key = paymentId
      ? `meta_pixel_subscribe_${paymentId}`
      : `meta_pixel_subscribe_${plan}_${Math.floor(Date.now() / 60000)}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, '1');
    trackPixel('Subscribe', {
      value,
      currency,
      plan,
    });
  }, [value, currency, plan, paymentId]);
  return null;
}

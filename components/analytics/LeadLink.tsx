'use client';

import Link from 'next/link';
import type { ComponentProps } from 'react';
import { trackPixel } from '@/lib/pixel';

type Props = ComponentProps<typeof Link> & {
  leadSource?: string;
};

// Link que dispara fbq('track','Lead', {...}) en el momento del click,
// antes de que el browser navegue. Para los CTAs "gratuitos" del funnel
// (registro sin tarjeta, primera guía gratis, etc.).
export function LeadLink({ leadSource, onClick, children, ...props }: Props) {
  return (
    <Link
      {...props}
      onClick={(e) => {
        trackPixel('Lead', {
          source: leadSource ?? 'cta',
          content_name: 'crear_guia_gratis',
        });
        onClick?.(e);
      }}
    >
      {children}
    </Link>
  );
}

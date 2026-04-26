'use client';

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import { META_PIXEL_ID, trackPixel } from '@/lib/pixel';

// Inyecta el snippet base del Meta Pixel en <head> y dispara PageView en cada
// navegación del App Router (SPA-style — el <Script> base solo dispara
// PageView en el primer render, hace falta replicarlo manualmente después).
//
// El render de <noscript> con el tracking pixel queda fuera del Suspense
// boundary porque no depende de searchParams.

function PageViewOnNavigation() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Skip primer PageView del Pixel base (lo hace fbevents.js init).
    // Identificamos el primer render con un flag en window.
    if (typeof window === 'undefined') return;
    const w = window as Window & { __metaPixelFirstView?: boolean };
    if (!w.__metaPixelFirstView) {
      w.__metaPixelFirstView = true;
      return;
    }
    trackPixel('PageView');
    // pathname y searchParams como deps — cualquier cambio dispara navegación.
  }, [pathname, searchParams]);

  return null;
}

export function MetaPixel() {
  if (!META_PIXEL_ID) return null;

  return (
    <>
      <Script
        id="meta-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${META_PIXEL_ID}');
            fbq('track', 'PageView');
          `,
        }}
      />
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
      <Suspense fallback={null}>
        <PageViewOnNavigation />
      </Suspense>
    </>
  );
}

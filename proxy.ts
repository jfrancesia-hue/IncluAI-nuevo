import { updateSession } from '@/lib/supabase/middleware';
import type { NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static, _next/image, favicon.ico
     * - images (svg/png/jpg/jpeg/gif/webp)
     * - manifest.webmanifest, robots.txt, sitemap.xml
     * - api/mercadopago/webhook (público, MP lo llama)
     */
    '/((?!_next/static|_next/image|favicon.ico|api/mercadopago/webhook|.*\\.(?:svg|png|jpg|jpeg|gif|webp|webmanifest|txt|xml|ico)$).*)',
  ],
};

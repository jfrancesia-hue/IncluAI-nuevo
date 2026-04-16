import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const rawNext = searchParams.get('next') ?? '/inicio';
  // Evitar open-redirect: solo rutas internas absolutas (no '//' ni '/\\' ni URLs)
  const next =
    rawNext.startsWith('/') &&
    !rawNext.startsWith('//') &&
    !rawNext.startsWith('/\\')
      ? rawNext
      : '/inicio';
  const error = searchParams.get('error_description');

  if (error) {
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(error)}`
    );
  }

  if (code) {
    const supabase = await createClient();
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    if (!exchangeError) {
      return NextResponse.redirect(`${origin}${next}`);
    }
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(exchangeError.message)}`
    );
  }

  return NextResponse.redirect(`${origin}/login`);
}

import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export const metadata = { title: '¡Pago exitoso! · IncluIA' };

type SearchParams = Promise<{
  payment_id?: string;
  status?: string;
  external_reference?: string;
}>;

export default async function ExitoPagoPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let vence: string | null = null;
  if (user) {
    const { data } = await supabase
      .from('perfiles')
      .select('plan_activo_hasta')
      .eq('id', user.id)
      .single<{ plan_activo_hasta: string | null }>();
    vence = data?.plan_activo_hasta ?? null;
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-xl flex-col items-center justify-center gap-6 px-4 py-16 text-center">
      <div
        aria-hidden
        className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-light text-4xl"
      >
        ✓
      </div>

      <h1 className="font-serif text-3xl text-primary sm:text-4xl">
        ¡Bienvenida al Plan Pro! 🎉
      </h1>

      <p className="text-muted">
        Tu suscripción está activa. Ahora podés generar hasta{' '}
        <strong className="text-primary">40 guías por mes</strong>, acceder al
        historial y exportar tus guías en PDF.
      </p>

      {vence && (
        <Card className="w-full">
          <CardContent className="p-5 text-sm text-muted">
            Tu plan se renueva el{' '}
            <strong className="text-primary">
              {new Date(vence).toLocaleDateString('es-AR')}
            </strong>
            {sp.status === 'pending' && (
              <p className="mt-2 text-xs">
                El pago figura como pendiente. Una vez acreditado, se activa
                automáticamente.
              </p>
            )}
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button asChild variant="outline">
          <Link href="/inicio">Ir al inicio</Link>
        </Button>
        <Button asChild size="lg">
          <Link href="/nueva-consulta">Crear mi primera guía Pro →</Link>
        </Button>
      </div>

      {sp.payment_id && (
        <p className="text-xs text-muted">
          ID de pago: <code>{sp.payment_id}</code>
        </p>
      )}
    </div>
  );
}

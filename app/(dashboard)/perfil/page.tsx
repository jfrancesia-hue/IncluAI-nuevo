import Link from 'next/link';
import { getPerfil } from '@/lib/auth';
import { LIMITES_PLAN } from '@/lib/types';
import { signOutAction } from '@/app/(dashboard)/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PerfilForm } from './perfil-form';

export const metadata = { title: 'Mi perfil · IncluIA' };

export default async function PerfilPage() {
  const perfil = await getPerfil();
  if (!perfil) return null;

  const esPro = perfil.plan === 'pro' || perfil.plan === 'institucional';
  const limite = LIMITES_PLAN[perfil.plan].guias_por_mes;
  const restantes = Math.max(0, limite - perfil.consultas_mes);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl text-primary">Mi perfil</h1>

      <Card>
        <CardHeader>
          <CardTitle>Datos personales</CardTitle>
        </CardHeader>
        <CardContent>
          <PerfilForm perfil={perfil} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Mi plan</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span
              className={
                'rounded-full px-3 py-1 text-sm font-semibold ' +
                (esPro ? 'bg-accent-light text-accent' : 'bg-primary-bg text-primary')
              }
            >
              {perfil.plan === 'free'
                ? 'Gratuito'
                : perfil.plan === 'pro'
                  ? 'Pro'
                  : 'Institucional'}
            </span>
            {esPro && perfil.plan_activo_hasta && (
              <span className="text-sm text-muted">
                Vence el{' '}
                <strong className="text-primary">
                  {new Date(perfil.plan_activo_hasta).toLocaleDateString('es-AR')}
                </strong>
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Stat label="Guías este mes" value={String(perfil.consultas_mes)} />
            <Stat label="Restantes" value={`${restantes} / ${limite}`} />
            <Stat label="Miembro desde" value={new Date(perfil.created_at).toLocaleDateString('es-AR')} />
          </div>

          <Button asChild variant="outline" className="self-start">
            <Link href="/planes">Cambiar plan →</Link>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sesión</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={signOutAction}>
            <Button type="submit" variant="danger">
              Cerrar sesión
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[10px] border border-border bg-background p-3">
      <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-1 font-serif text-lg font-bold text-primary">{value}</p>
    </div>
  );
}

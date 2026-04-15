import Link from 'next/link';
import { getPerfil } from '@/lib/auth';
import { LIMITES_PLAN } from '@/lib/types';
import { createClient } from '@/lib/supabase/server';
import { DISCAPACIDADES } from '@/data/discapacidades';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ModuleSelector } from '@/components/module/module-selector';
import { Onboarding } from '@/components/module/onboarding';
import { getTipDelDia } from '@/data/tips';

export const metadata = { title: 'Inicio · IncluIA' };

type RecentRow = {
  id: string;
  modulo: 'docentes' | 'familias' | 'profesionales';
  materia: string | null;
  contenido: string;
  discapacidades: string[];
  created_at: string;
};

const MODULO_ICON: Record<RecentRow['modulo'], string> = {
  docentes: '📚',
  familias: '🏠',
  profesionales: '⚕️',
};

export default async function InicioPage() {
  const perfil = await getPerfil();
  if (!perfil) return null;

  const limite = LIMITES_PLAN[perfil.plan].guias_por_mes;
  const restantes = Math.max(0, limite - perfil.consultas_mes);

  const supabase = await createClient();
  const { data: recientes } = await supabase
    .from('consultas')
    .select('id, modulo, materia, contenido, discapacidades, created_at')
    .eq('user_id', perfil.id)
    .order('created_at', { ascending: false })
    .limit(3)
    .returns<RecentRow[]>();

  return (
    <div className="flex flex-col gap-8">
      <Onboarding />
      <section>
        <h1 className="text-3xl text-primary sm:text-4xl">
          ¡Hola, {perfil.nombre}!
        </h1>
        <p className="mt-1 text-muted">¿Qué vas a enseñar hoy?</p>
      </section>

      <ModuleSelector tipoUsuario={perfil.tipo_usuario} />

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Stat label="Guías restantes" value={`${restantes} / ${limite}`} />
        <Stat label="Guías este mes" value={String(perfil.consultas_mes)} />
        <Stat
          label="Tu plan"
          value={
            perfil.plan === 'free'
              ? 'Gratuito'
              : perfil.plan === 'pro'
                ? 'Pro'
                : 'Institucional'
          }
          hint={
            <Link href="/planes" className="text-accent hover:underline">
              Ver planes
            </Link>
          }
        />
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-serif text-xl text-primary">Tus últimas consultas</h3>
          {recientes && recientes.length > 0 && (
            <Link href="/historial" className="text-sm text-accent hover:underline">
              Ver todo →
            </Link>
          )}
        </div>

        {recientes && recientes.length > 0 ? (
          <div className="grid grid-cols-1 gap-3">
            {recientes.map((c) => (
              <RecentCard key={c.id} row={c} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex min-h-[140px] flex-col items-center justify-center gap-2 p-8 text-center text-muted">
              <span aria-hidden className="text-3xl">📋</span>
              <p className="text-sm">Todavía no generaste ninguna guía.</p>
              <Button asChild variant="outline" size="sm" className="mt-2">
                <Link href="/nueva-consulta">Crear mi primera guía</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </section>

      {(() => {
        const tip = getTipDelDia();
        return (
          <aside className="rounded-[14px] border border-border bg-primary-bg p-5 text-sm text-primary">
            <p>
              💡 <strong>Tip del día.</strong> {tip.texto}{' '}
              <span className="text-muted">— {tip.fuente}</span>
            </p>
          </aside>
        );
      })()}
    </div>
  );
}

function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
        <p className="mt-1 font-serif text-2xl font-bold text-primary">{value}</p>
        {hint && <div className="mt-1 text-xs">{hint}</div>}
      </CardContent>
    </Card>
  );
}

function RecentCard({ row }: { row: RecentRow }) {
  const tags = row.discapacidades
    .map((id) => DISCAPACIDADES.find((d) => d.id === id))
    .filter((x): x is (typeof DISCAPACIDADES)[number] => Boolean(x));
  return (
    <Link href={`/resultado?id=${row.id}`}>
      <Card className="transition-colors hover:border-accent">
        <CardContent className="flex flex-col gap-1 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-primary">
              <span aria-hidden className="mr-1">
                {MODULO_ICON[row.modulo]}
              </span>
              {row.materia ?? row.modulo}
            </p>
            <span className="text-xs text-muted">
              {new Date(row.created_at).toLocaleDateString('es-AR')}
            </span>
          </div>
          <p className="truncate text-sm text-foreground">{row.contenido}</p>
          {tags.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-1">
              {tags.slice(0, 3).map((t) => (
                <span
                  key={t.id}
                  className="rounded-full bg-accent-light px-2 py-0.5 text-[11px] font-medium text-accent"
                >
                  {t.icon} {t.label}
                </span>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

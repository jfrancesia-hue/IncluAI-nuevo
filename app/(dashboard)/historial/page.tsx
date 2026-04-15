import Link from 'next/link';
import { getPerfil } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { DISCAPACIDADES } from '@/data/discapacidades';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import type { ModuloIncluIA } from '@/lib/types';
import { Input } from '@/components/ui/input';

export const metadata = { title: 'Historial · IncluIA' };

type Row = {
  id: string;
  modulo: ModuloIncluIA;
  nivel: string | null;
  materia: string | null;
  contenido: string;
  discapacidades: string[];
  created_at: string;
  feedback_estrellas: number | null;
};

type SP = Promise<{ modulo?: string; discapacidad?: string; q?: string }>;

const MODULO_META: Record<ModuloIncluIA | 'todos', { icon: string; label: string }> = {
  todos: { icon: '📋', label: 'Todas' },
  docentes: { icon: '📚', label: 'Docente' },
  familias: { icon: '🏠', label: 'Familia' },
  profesionales: { icon: '⚕️', label: 'Profesional' },
};

export default async function HistorialPage({ searchParams }: { searchParams: SP }) {
  const [perfil, sp] = await Promise.all([getPerfil(), searchParams]);
  if (!perfil) return null;

  const esPro = perfil.plan === 'pro' || perfil.plan === 'institucional';
  const filtroModulo = (['docentes', 'familias', 'profesionales'] as const).includes(
    sp.modulo as ModuloIncluIA
  )
    ? (sp.modulo as ModuloIncluIA)
    : null;

  const supabase = await createClient();
  let query = supabase
    .from('consultas')
    .select('id, modulo, nivel, materia, contenido, discapacidades, created_at, feedback_estrellas')
    .eq('user_id', perfil.id)
    .order('created_at', { ascending: false })
    .limit(50);

  if (filtroModulo) query = query.eq('modulo', filtroModulo);
  if (sp.discapacidad) query = query.contains('discapacidades', [sp.discapacidad]);
  if (sp.q && sp.q.trim()) {
    const term = sp.q.trim().replace(/%/g, '');
    query = query.or(
      `contenido.ilike.%${term}%,materia.ilike.%${term}%,respuesta_ia.ilike.%${term}%`
    );
  }

  const { data: consultas } = await query.returns<Row[]>();

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-primary">Historial</h1>
          <p className="text-sm text-muted">Todas tus guías generadas en los 3 módulos.</p>
        </div>
      </header>

      {!esPro && (
        <Alert variant="info">
          <span className="font-medium">Estás en el plan Gratuito.</span> Las
          guías se guardan pero el historial completo es una feature del plan
          Pro.{' '}
          <Link href="/planes" className="font-medium underline">
            Ver planes
          </Link>
        </Alert>
      )}

      <form method="get" className="flex flex-col gap-3 sm:flex-row">
        <Input
          name="q"
          defaultValue={sp.q ?? ''}
          placeholder="🔎 Buscar en tus guías…"
          className="flex-1"
        />
        {filtroModulo && <input type="hidden" name="modulo" value={filtroModulo} />}
        {sp.discapacidad && <input type="hidden" name="discapacidad" value={sp.discapacidad} />}
        <Button type="submit" variant="outline">Buscar</Button>
      </form>

      <div className="flex flex-wrap gap-2">
        <Tab href="/historial" active={!filtroModulo} label="Todas" icon="📋" />
        <Tab href="/historial?modulo=docentes" active={filtroModulo === 'docentes'} label="Docente" icon="📚" />
        <Tab href="/historial?modulo=familias" active={filtroModulo === 'familias'} label="Familia" icon="🏠" />
        <Tab href="/historial?modulo=profesionales" active={filtroModulo === 'profesionales'} label="Profesional" icon="⚕️" />
      </div>

      {!consultas || consultas.length === 0 ? (
        <Card>
          <CardContent className="flex min-h-[160px] flex-col items-center justify-center gap-2 p-10 text-center text-muted">
            <span aria-hidden className="text-3xl">📚</span>
            <p className="text-sm">
              {filtroModulo || sp.discapacidad
                ? 'No hay guías con esos filtros.'
                : 'Todavía no generaste ninguna guía.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <ul className="flex flex-col gap-3">
          {consultas.map((c) => (
            <li key={c.id}>
              <ConsultaItem row={c} locked={!esPro} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Tab({ href, active, label, icon }: { href: string; active: boolean; label: string; icon: string }) {
  return (
    <Link
      href={href}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors',
        active
          ? 'border-accent bg-accent-light text-accent'
          : 'border-border bg-card text-primary hover:bg-primary-bg'
      )}
    >
      <span aria-hidden>{icon}</span>
      <span>{label}</span>
    </Link>
  );
}

function ConsultaItem({ row, locked }: { row: Row; locked: boolean }) {
  const tags = row.discapacidades
    .map((id) => DISCAPACIDADES.find((d) => d.id === id))
    .filter((x): x is (typeof DISCAPACIDADES)[number] => Boolean(x));

  const fecha = new Date(row.created_at).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const moduloLabel = MODULO_META[row.modulo]?.label ?? row.modulo;
  const moduloIcon = MODULO_META[row.modulo]?.icon ?? '📋';
  const titulo = row.materia ?? row.contenido.slice(0, 60);

  const inner = (
    <Card className="transition-colors hover:border-accent">
      <CardContent className="flex flex-col gap-2 p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="font-serif text-lg font-bold text-primary">
            <span aria-hidden className="mr-1">{moduloIcon}</span>
            {titulo}
          </p>
          <span className="text-xs text-muted">{fecha}</span>
        </div>
        <p className="line-clamp-2 text-sm text-foreground">{row.contenido}</p>
        <div className="flex flex-wrap gap-1">
          <span className="rounded-full bg-primary-bg px-2 py-0.5 text-[11px] font-medium text-primary">
            {moduloLabel}
          </span>
          {tags.map((t) => (
            <span
              key={t.id}
              className="rounded-full bg-accent-light px-2 py-0.5 text-[11px] font-medium text-accent"
            >
              {t.icon} {t.label}
            </span>
          ))}
        </div>
        {row.feedback_estrellas && (
          <p className="text-xs text-cta">
            {'★'.repeat(row.feedback_estrellas)}
            <span className="text-muted">{'★'.repeat(5 - row.feedback_estrellas)}</span>
          </p>
        )}
      </CardContent>
    </Card>
  );

  if (locked) {
    return (
      <div className="relative">
        <div className="opacity-60">{inner}</div>
        <div className="absolute inset-0 flex items-center justify-center rounded-[14px] bg-background/40">
          <Button asChild size="sm" variant="cta">
            <Link href="/planes">🔒 Upgrade a Pro para ver</Link>
          </Button>
        </div>
      </div>
    );
  }

  return <Link href={`/resultado?id=${row.id}`}>{inner}</Link>;
}

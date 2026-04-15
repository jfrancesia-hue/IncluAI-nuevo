import Link from 'next/link';
import { getPerfil } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { DISCAPACIDADES } from '@/data/discapacidades';
import { NIVELES } from '@/data/niveles';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Alert } from '@/components/ui/alert';

export const metadata = { title: 'Historial · IncluIA' };

type Row = {
  id: string;
  nivel: string;
  materia: string;
  contenido: string;
  discapacidades: string[];
  created_at: string;
  feedback_estrellas: number | null;
};

type SP = Promise<{ nivel?: string; discapacidad?: string; materia?: string }>;

export default async function HistorialPage({
  searchParams,
}: {
  searchParams: SP;
}) {
  const [perfil, sp] = await Promise.all([getPerfil(), searchParams]);
  if (!perfil) return null;

  const esPro = perfil.plan === 'pro' || perfil.plan === 'institucional';

  const supabase = await createClient();
  let query = supabase
    .from('consultas')
    .select('id, nivel, materia, contenido, discapacidades, created_at, feedback_estrellas')
    .eq('user_id', perfil.id)
    .order('created_at', { ascending: false })
    .limit(50);

  if (sp.nivel) query = query.eq('nivel', sp.nivel);
  if (sp.materia) query = query.ilike('materia', sp.materia);
  if (sp.discapacidad) query = query.contains('discapacidades', [sp.discapacidad]);

  const { data: consultas } = await query.returns<Row[]>();

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-primary">Historial</h1>
          <p className="text-sm text-muted">Todas tus guías generadas.</p>
        </div>
        <Button asChild>
          <Link href="/nueva-consulta">+ Nueva guía</Link>
        </Button>
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

      <form
        method="get"
        className="flex flex-col gap-3 rounded-[14px] border border-border bg-card p-4 sm:flex-row sm:items-end"
      >
        <div className="flex-1">
          <label className="text-xs text-muted" htmlFor="f-nivel">Nivel</label>
          <Select id="f-nivel" name="nivel" defaultValue={sp.nivel ?? ''}>
            <option value="">Todos</option>
            {NIVELES.map((n) => (
              <option key={n.id} value={n.id}>
                {n.label}
              </option>
            ))}
          </Select>
        </div>
        <div className="flex-1">
          <label className="text-xs text-muted" htmlFor="f-disc">Discapacidad</label>
          <Select id="f-disc" name="discapacidad" defaultValue={sp.discapacidad ?? ''}>
            <option value="">Todas</option>
            {DISCAPACIDADES.map((d) => (
              <option key={d.id} value={d.id}>
                {d.icon} {d.label}
              </option>
            ))}
          </Select>
        </div>
        <div className="flex gap-2">
          <Button type="submit" size="sm">Filtrar</Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/historial">Limpiar</Link>
          </Button>
        </div>
      </form>

      {!consultas || consultas.length === 0 ? (
        <Card>
          <CardContent className="flex min-h-[160px] flex-col items-center justify-center gap-2 p-10 text-center text-muted">
            <span aria-hidden className="text-3xl">📚</span>
            <p className="text-sm">
              {sp.nivel || sp.discapacidad
                ? 'No hay guías con esos filtros.'
                : 'Todavía no generaste ninguna guía.'}
            </p>
            <Button asChild variant="outline" size="sm" className="mt-2">
              <Link href="/nueva-consulta">Crear una guía</Link>
            </Button>
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

function ConsultaItem({ row, locked }: { row: Row; locked: boolean }) {
  const tags = row.discapacidades
    .map((id) => DISCAPACIDADES.find((d) => d.id === id))
    .filter((x): x is (typeof DISCAPACIDADES)[number] => Boolean(x));

  const fecha = new Date(row.created_at).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const inner = (
    <Card className="transition-colors hover:border-accent">
      <CardContent className="flex flex-col gap-2 p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="font-serif text-lg font-bold text-primary">{row.materia}</p>
          <span className="text-xs text-muted">{fecha}</span>
        </div>
        <p className="line-clamp-2 text-sm text-foreground">{row.contenido}</p>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.map((t) => (
              <span
                key={t.id}
                className="rounded-full bg-accent-light px-2 py-0.5 text-[11px] font-medium text-accent"
              >
                {t.icon} {t.label}
              </span>
            ))}
          </div>
        )}
        {row.feedback_estrellas && (
          <p className="text-xs text-cta">
            {'★'.repeat(row.feedback_estrellas)}
            <span className="text-muted">
              {'★'.repeat(5 - row.feedback_estrellas)}
            </span>
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

import Link from 'next/link';
import { signOutAction } from '@/app/(dashboard)/actions';
import type { Perfil } from '@/lib/types';

const TIPO_META: Record<'docente' | 'familia' | 'profesional', { icon: string; label: string }> = {
  docente: { icon: '📚', label: 'Docente' },
  familia: { icon: '🏠', label: 'Familia' },
  profesional: { icon: '⚕️', label: 'Profesional' },
};

export function Navbar({ perfil }: { perfil: Perfil }) {
  const iniciales = `${perfil.nombre[0] ?? ''}${perfil.apellido[0] ?? ''}`.toUpperCase();
  const esPro = perfil.plan === 'pro' || perfil.plan === 'institucional';
  const tipo = TIPO_META[perfil.tipo_usuario] ?? TIPO_META.docente;

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card/90 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/inicio" className="font-serif text-lg font-bold text-primary">
          🧩 IncluIA
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-muted md:flex">
          <Link href="/inicio" className="hover:text-primary">Inicio</Link>
          <Link href="/nueva-consulta" className="hover:text-primary">Nueva guía</Link>
          <Link href="/historial" className="hover:text-primary">Historial</Link>
          <Link href="/planes" className="hover:text-primary">Planes</Link>
        </nav>

        <div className="flex items-center gap-3">
          <span className="hidden rounded-full bg-primary-bg px-2.5 py-0.5 text-xs font-medium text-primary sm:inline-flex">
            {tipo.icon} {tipo.label}
          </span>
          <span
            className={
              'hidden rounded-full px-2.5 py-0.5 text-xs font-medium sm:inline-flex ' +
              (esPro
                ? 'bg-accent-light text-accent'
                : 'bg-primary-bg text-primary')
            }
          >
            {esPro ? 'Pro ✓' : 'Gratuito'}
          </span>
          <Link
            href="/perfil"
            className="flex items-center gap-2 rounded-full border border-border bg-card px-2 py-1 text-sm hover:bg-primary-bg"
          >
            <span
              aria-hidden
              className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white"
            >
              {iniciales || '·'}
            </span>
            <span className="hidden max-w-[100px] truncate font-medium text-primary md:inline">
              {perfil.nombre}
            </span>
          </Link>
          <form action={signOutAction}>
            <button
              type="submit"
              className="text-xs text-muted hover:text-primary"
            >
              Salir
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-1 flex-col items-center justify-center gap-4 px-4 text-center">
      <p aria-hidden className="text-6xl">🧩</p>
      <h1 className="font-serif text-4xl font-bold text-primary">
        Página no encontrada
      </h1>
      <p className="max-w-md text-muted">
        La página que buscás no existe o fue movida. Volvé al inicio para
        seguir generando guías.
      </p>
      <Button asChild size="lg">
        <Link href="/">Volver al inicio</Link>
      </Button>
    </div>
  );
}

import { redirect } from 'next/navigation';
import { getPerfil } from '@/lib/auth';
import { Navbar } from '@/components/dashboard/navbar';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const perfil = await getPerfil();
  if (!perfil) {
    redirect('/login');
  }

  return (
    <div className="relative min-h-screen">
      {/* Fondo principal: gradient horizontal cream → naranja claro → peach.
          Misma dirección que la navbar pero mucho más suave para no competir
          visualmente. La navbar queda como una banda más saturada arriba. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-20"
        style={{
          background:
            'linear-gradient(90deg, #fef9e0 0%, #fef3c7 30%, #fde68a 55%, #fed7aa 80%, #fef3c7 100%)',
        }}
      />
      {/* Patrón de puntos sutil para textura */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 opacity-[0.35]"
        style={{
          backgroundImage:
            'radial-gradient(rgba(146, 64, 14, 0.1) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
      {/* Glow cálido arriba-izq */}
      <div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 -z-10 h-[500px] w-[600px]"
        style={{
          background:
            'radial-gradient(circle at 10% 0%, rgba(251, 146, 60, 0.18), transparent 65%)',
        }}
      />
      {/* Glow cálido abajo-der */}
      <div
        aria-hidden
        className="pointer-events-none fixed bottom-0 right-0 -z-10 h-[500px] w-[600px]"
        style={{
          background:
            'radial-gradient(circle at 100% 100%, rgba(230, 126, 34, 0.12), transparent 65%)',
        }}
      />

      <Navbar perfil={perfil} />
      <main className="relative mx-auto w-full max-w-6xl px-4 pb-32 pt-8 sm:px-6 sm:pb-24">
        {children}
      </main>
    </div>
  );
}

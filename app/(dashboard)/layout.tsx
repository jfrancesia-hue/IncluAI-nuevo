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
      {/* Fondo principal: gradient horizontal usando CSS vars para que
          el dark mode los reemplace automáticamente. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-20"
        style={{
          background:
            'linear-gradient(90deg, var(--dashboard-bg-1) 0%, var(--dashboard-bg-2) 30%, var(--dashboard-bg-3) 55%, var(--dashboard-bg-4) 80%, var(--dashboard-bg-5) 100%)',
        }}
      />
      {/* Patrón de puntos sutil para textura */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 opacity-[0.35]"
        style={{
          backgroundImage:
            'radial-gradient(var(--dashboard-dots) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
      {/* Glow sutil arriba-izq */}
      <div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 -z-10 h-[500px] w-[600px]"
        style={{
          background:
            'radial-gradient(circle at 10% 0%, var(--dashboard-glow-1), transparent 65%)',
        }}
      />
      {/* Glow sutil abajo-der */}
      <div
        aria-hidden
        className="pointer-events-none fixed bottom-0 right-0 -z-10 h-[500px] w-[600px]"
        style={{
          background:
            'radial-gradient(circle at 100% 100%, var(--dashboard-glow-2), transparent 65%)',
        }}
      />

      <Navbar perfil={perfil} />
      <main className="relative mx-auto w-full max-w-6xl px-4 pb-32 pt-8 sm:px-6 sm:pb-24">
        {children}
      </main>
    </div>
  );
}

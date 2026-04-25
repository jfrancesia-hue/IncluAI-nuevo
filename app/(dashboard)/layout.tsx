import { redirect } from 'next/navigation';
import { getPerfil } from '@/lib/auth';
import { Navbar } from '@/components/dashboard/navbar';
import { Footer } from '@/components/landing/Footer';

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
    <div className="relative flex min-h-screen flex-col">
      {/* Fondo principal: gradient horizontal usando CSS vars */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-20"
        style={{
          background:
            'linear-gradient(90deg, var(--dashboard-bg-1) 0%, var(--dashboard-bg-2) 30%, var(--dashboard-bg-3) 55%, var(--dashboard-bg-4) 80%, var(--dashboard-bg-5) 100%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 opacity-[0.35]"
        style={{
          backgroundImage:
            'radial-gradient(var(--dashboard-dots) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 -z-10 h-[500px] w-[600px]"
        style={{
          background:
            'radial-gradient(circle at 10% 0%, var(--dashboard-glow-1), transparent 65%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed bottom-0 right-0 -z-10 h-[500px] w-[600px]"
        style={{
          background:
            'radial-gradient(circle at 100% 100%, var(--dashboard-glow-2), transparent 65%)',
        }}
      />

      <Navbar perfil={perfil} />
      <main className="relative mx-auto w-full max-w-6xl flex-1 px-4 pb-12 pt-8 sm:px-6">
        {children}
      </main>
      <Footer variant="compact" />
    </div>
  );
}

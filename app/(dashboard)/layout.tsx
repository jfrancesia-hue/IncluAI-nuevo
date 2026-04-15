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
    <div className="flex min-h-screen flex-1 flex-col bg-background">
      <Navbar perfil={perfil} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        {children}
      </main>
    </div>
  );
}

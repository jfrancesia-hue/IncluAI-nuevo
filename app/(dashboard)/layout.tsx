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
    <div className="bg-background">
      <Navbar perfil={perfil} />
      <main className="mx-auto w-full max-w-6xl px-4 pb-32 pt-8 sm:px-6 sm:pb-24">
        {children}
      </main>
    </div>
  );
}

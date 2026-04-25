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
      {/* Background con tinte sutil — no blanco puro, da carácter sin
          robar protagonismo al contenido. Patrón de puntos decorativo
          a baja opacidad. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-20"
        style={{
          background:
            'linear-gradient(180deg, #FBF8F2 0%, #F4EFE3 50%, #FBF8F2 100%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 opacity-[0.4]"
        style={{
          backgroundImage:
            'radial-gradient(rgba(31, 46, 61, 0.06) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
      {/* Glow sutil arriba-izq (azul) */}
      <div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 -z-10 h-[400px] w-[500px]"
        style={{
          background:
            'radial-gradient(circle at 0% 0%, rgba(46, 134, 193, 0.08), transparent 60%)',
        }}
      />
      {/* Glow sutil abajo-der (verde) */}
      <div
        aria-hidden
        className="pointer-events-none fixed bottom-0 right-0 -z-10 h-[400px] w-[500px]"
        style={{
          background:
            'radial-gradient(circle at 100% 100%, rgba(39, 174, 96, 0.06), transparent 60%)',
        }}
      />

      <Navbar perfil={perfil} />
      <main className="relative mx-auto w-full max-w-6xl px-4 pb-32 pt-8 sm:px-6 sm:pb-24">
        {children}
      </main>
    </div>
  );
}

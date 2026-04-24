import Image from 'next/image';
import { PHOTOS } from '@/lib/photos';
import { RegistroForm } from './registro-form';

export const metadata = {
  title: 'Unite a la comunidad · IncluAI',
};

export default function RegistroPage() {
  return (
    <div className="overflow-hidden rounded-[20px] bg-white shadow-[0_10px_40px_rgba(15,34,64,0.1)]">
      <div className="relative h-36 w-full overflow-hidden sm:h-44">
        <Image
          src={PHOTOS.registro}
          alt="Niños en un aula inclusiva con manos alzadas"
          width={900}
          height={400}
          priority
          className="h-full w-full object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-transparent"
        />
      </div>
      <div className="px-6 pb-7 pt-5 sm:px-8">
        <h1 className="font-serif text-2xl font-bold text-[#2E86C1] sm:text-3xl">
          Unite a la comunidad docente inclusiva
        </h1>
        <p className="mt-1 text-sm text-[#4A5968]">
          Creá tu cuenta gratuita — 2 guías por mes, sin costo.
        </p>
        <div className="mt-6">
          <RegistroForm />
        </div>
      </div>
    </div>
  );
}

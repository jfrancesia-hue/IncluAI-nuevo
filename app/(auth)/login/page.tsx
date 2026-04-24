import Image from 'next/image';
import { Suspense } from 'react';
import { PHOTOS } from '@/lib/photos';
import { LoginForm } from './login-form';

export const metadata = {
  title: 'Iniciá sesión · IncluAI',
};

export default function LoginPage() {
  return (
    <div className="overflow-hidden rounded-[20px] bg-white shadow-[0_10px_40px_rgba(15,34,64,0.1)]">
      <div className="relative h-32 w-full overflow-hidden sm:h-40">
        <Image
          src={PHOTOS.login}
          alt="Docente con tablet frente a su aula"
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
          ¡Qué bueno verte de nuevo!
        </h1>
        <p className="mt-1 text-sm text-[#4A5968]">
          Ingresá para seguir planificando clases inclusivas.
        </p>
        <div className="mt-6">
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

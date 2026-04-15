'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

const KEY = 'inclua-onboarding-seen-v1';

const SLIDES = [
  {
    icon: '👋',
    title: 'Bienvenido/a a IncluIA',
    body: 'Una plataforma para docentes, familias y profesionales de salud que trabajan con personas con discapacidad en Argentina.',
  },
  {
    icon: '🧩',
    title: 'Elegí tu rol',
    body: 'Hay 3 módulos. Podés cambiar cuando quieras desde el inicio. Las guías se ajustan al idioma y realidad de cada uno.',
  },
  {
    icon: '⚡',
    title: 'Arrancá con plantillas',
    body: 'Si es tu primera vez, probá una plantilla pre-cargada. 2 guías gratuitas por mes para explorar.',
  },
];

export function Onboarding() {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setVisible(true);
    } catch {
      // SSR / storage bloqueado
    }
  }, []);

  if (!visible) return null;

  function cerrar() {
    try {
      localStorage.setItem(KEY, String(Date.now()));
    } catch {}
    setVisible(false);
  }

  const slide = SLIDES[step];
  const last = step === SLIDES.length - 1;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ob-title"
    >
      <div className="w-full max-w-md rounded-[14px] bg-card p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-xs text-muted">
            Paso {step + 1} de {SLIDES.length}
          </span>
          <button
            type="button"
            onClick={cerrar}
            className="text-xs text-muted hover:text-primary"
            aria-label="Saltar onboarding"
          >
            Saltar
          </button>
        </div>
        <div className="flex flex-col gap-3 text-center">
          <span aria-hidden className="text-5xl">{slide.icon}</span>
          <h2 id="ob-title" className="font-serif text-2xl text-primary">
            {slide.title}
          </h2>
          <p className="text-sm text-muted">{slide.body}</p>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3">
          <div className="flex gap-1.5">
            {SLIDES.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 w-6 rounded-full ${i <= step ? 'bg-accent' : 'bg-border'}`}
              />
            ))}
          </div>
          <Button
            onClick={() => (last ? cerrar() : setStep(step + 1))}
            size="sm"
          >
            {last ? '¡Empezar!' : 'Siguiente →'}
          </Button>
        </div>
      </div>
    </div>
  );
}

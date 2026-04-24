'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import { Button } from '@/components/ui/button';

const KEY = 'inclua-onboarding-seen-v1';

const SLIDES = [
  {
    icon: '👋',
    title: 'Bienvenido/a a IncluAI',
    body: 'Tu nueva herramienta educativa para potenciar la inclusión en el aula. Descubrí cómo IncluAI puede ayudarte a crear experiencias de aprendizaje adaptativas y significativas para todos tus estudiantes. ¡Comencemos!',
  },
  {
    icon: '🧩',
    title: 'Elegí tu rol',
    body: 'Seleccioná tu perfil para personalizar tu experiencia. Nuestros módulos están diseñados para apoyar a Docentes, Familias y Profesionales en la creación de entornos educativos inclusivos, ofreciendo recursos y herramientas adaptadas a cada necesidad.',
  },
  {
    icon: '⚡',
    title: 'Arrancá con plantillas',
    body: '¡Comenzá de inmediato! Utilizá plantillas precargadas y accedé a 2 guías gratuitas cada mes para optimizar tus clases inclusivas con IA generativa.',
  },
];

function subscribeOnboarding(cb: () => void): () => void {
  // Nadie dispara este store externamente; se resuelve en el primer paint.
  const t = setTimeout(cb, 0);
  return () => clearTimeout(t);
}
function getInitialVisibility(): boolean {
  try {
    return !localStorage.getItem(KEY);
  } catch {
    return false;
  }
}
function getServerVisibility(): boolean {
  return false;
}

export function Onboarding() {
  // useSyncExternalStore evita el patrón setState-dentro-de-useEffect
  // que el linter de React marca (cascading renders).
  const shouldShow = useSyncExternalStore(
    subscribeOnboarding,
    getInitialVisibility,
    getServerVisibility
  );
  const [dismissed, setDismissed] = useState(false);
  const [step, setStep] = useState(0);
  const visible = shouldShow && !dismissed;

  useEffect(() => {
    if (!visible) return;
    function onKey(e: KeyboardEvent) {
      if (e.key !== 'Escape') return;
      try {
        localStorage.setItem(KEY, String(Date.now()));
      } catch {}
      setDismissed(true);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [visible]);

  if (!visible) return null;

  function cerrar() {
    try {
      localStorage.setItem(KEY, String(Date.now()));
    } catch {}
    setDismissed(true);
  }

  const slide = SLIDES[step];
  const last = step === SLIDES.length - 1;
  const first = step === 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ob-title"
    >
      <div className="relative w-full max-w-sm rounded-[20px] bg-card p-6 shadow-xl">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs text-muted">
            Paso {step + 1} de {SLIDES.length}
          </span>
          {first ? (
            <button
              type="button"
              onClick={cerrar}
              className="text-xs font-medium text-muted hover:text-primary"
              aria-label="Saltar onboarding"
            >
              Saltar
            </button>
          ) : (
            <button
              type="button"
              onClick={cerrar}
              className="flex h-7 w-7 items-center justify-center rounded-full text-muted hover:bg-primary-bg hover:text-primary"
              aria-label="Cerrar"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex flex-col items-center gap-3 text-center py-4">
          <span aria-hidden className="text-6xl">
            {slide.icon}
          </span>
          <h2 id="ob-title" className="font-serif text-2xl font-bold text-primary">
            {slide.title}
          </h2>
          <p className="text-sm leading-relaxed text-muted px-2">{slide.body}</p>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="flex gap-1.5">
            {SLIDES.map((_, i) => (
              <span
                key={i}
                aria-hidden
                className={`h-2 w-2 rounded-full ${
                  i === step ? 'bg-accent' : 'bg-border'
                }`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            {!first && (
              <Button variant="ghost" size="sm" onClick={() => setStep(step - 1)}>
                Atrás
              </Button>
            )}
            <Button
              size="sm"
              onClick={() => (last ? cerrar() : setStep(step + 1))}
            >
              {last ? '¡Empezar!' : 'Siguiente'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useCallback, useSyncExternalStore } from 'react';

type Tamano = 'normal' | 'large' | 'xlarge';

const KEY_TAMANO = 'incluia-tamano';
const KEY_CONTRASTE = 'incluia-contraste';

// Snapshot helpers — corren en cliente (SSR fallback al default).
function getTamano(): Tamano {
  if (typeof window === 'undefined') return 'normal';
  const v = localStorage.getItem(KEY_TAMANO) as Tamano | null;
  return v ?? 'normal';
}
function getContraste(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(KEY_CONTRASTE) === 'true';
}
function getServerTamano(): Tamano {
  return 'normal';
}
function getServerContraste(): boolean {
  return false;
}

// Subscribe a 'storage' (entre tabs) + a un evento custom dentro del mismo tab.
const STORAGE_EVENT = 'incluia-accesibilidad';
function subscribe(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('storage', callback);
  window.addEventListener(STORAGE_EVENT, callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener(STORAGE_EVENT, callback);
  };
}

function notifyChange() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(STORAGE_EVENT));
  }
}

/**
 * Lee/escribe preferencias de accesibilidad desde localStorage.
 * Usa useSyncExternalStore (React 18+) — sincroniza correctamente
 * entre SSR/cliente y entre múltiples instancias del hook sin causar
 * el warning de set-state-in-effect.
 */
export function useAccesibilidad() {
  const tamano = useSyncExternalStore(subscribe, getTamano, getServerTamano);
  const altoContraste = useSyncExternalStore(
    subscribe,
    getContraste,
    getServerContraste
  );

  // Aplicar clases al body como side-effect del cambio. Esto NO usa
  // setState — solo manipula DOM, es seguro en effect.
  if (typeof window !== 'undefined') {
    // Sincroniza body classes en cada render (idempotente, sin cost).
    const body = document.body;
    body.classList.toggle('text-large', tamano === 'large');
    body.classList.toggle('text-xlarge', tamano === 'xlarge');
    body.classList.toggle('high-contrast', altoContraste);
  }

  const setTamano = useCallback((value: Tamano) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(KEY_TAMANO, value);
    notifyChange();
  }, []);

  const setAltoContraste = useCallback((value: boolean) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(KEY_CONTRASTE, String(value));
    notifyChange();
  }, []);

  return { tamano, setTamano, altoContraste, setAltoContraste };
}

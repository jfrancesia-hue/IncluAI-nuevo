'use client';

import { useCallback, useSyncExternalStore } from 'react';

/**
 * Persiste los checks de la grilla de evaluación en localStorage, por guiaId.
 * Key: incluia-progreso-{guiaId} → { [criterioIdx]: nivel }
 *
 * Usa useSyncExternalStore para evitar set-state-in-effect y para que
 * múltiples instancias del hook (mismo guiaId) se sincronicen.
 */

type Progreso = Record<number, string>;

const STORAGE_EVENT = 'incluia-grilla-progreso';

function notifyChange() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(STORAGE_EVENT));
  }
}

function subscribe(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('storage', callback);
  window.addEventListener(STORAGE_EVENT, callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener(STORAGE_EVENT, callback);
  };
}

// Cache para mantener identidad referencial estable entre renders cuando
// el JSON no cambió. Si no se hace, useSyncExternalStore detecta cambio
// en cada render por la nueva referencia del object.
const cache = new Map<string, { json: string; value: Progreso }>();

function getProgreso(storageKey: string): Progreso {
  if (typeof window === 'undefined') return {};
  const json = localStorage.getItem(storageKey) ?? '{}';
  const cached = cache.get(storageKey);
  if (cached && cached.json === json) return cached.value;
  try {
    const parsed = JSON.parse(json) as Progreso;
    cache.set(storageKey, { json, value: parsed });
    return parsed;
  } catch {
    return {};
  }
}

function getServerProgreso(): Progreso {
  return {};
}

export function useGrillaProgreso(guiaId: string) {
  const storageKey = `incluia-progreso-${guiaId}`;

  const progreso = useSyncExternalStore(
    subscribe,
    () => getProgreso(storageKey),
    getServerProgreso
  );

  const marcar = useCallback(
    (criterioIdx: number, nivel: string) => {
      if (typeof window === 'undefined') return;
      const actual = getProgreso(storageKey);
      const siguiente: Progreso = { ...actual };
      // Toggle: si ya estaba marcado ese nivel, lo desmarca.
      if (siguiente[criterioIdx] === nivel) {
        delete siguiente[criterioIdx];
      } else {
        siguiente[criterioIdx] = nivel;
      }
      try {
        localStorage.setItem(storageKey, JSON.stringify(siguiente));
        notifyChange();
      } catch (err) {
        console.warn('[useGrillaProgreso] no se pudo guardar:', err);
      }
    },
    [storageKey]
  );

  return { progreso, marcar };
}

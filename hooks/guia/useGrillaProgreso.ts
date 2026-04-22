'use client';

import { useEffect, useState } from 'react';

/**
 * Persiste los checks de la grilla de evaluación en localStorage, por guiaId.
 * Key: incluia-progreso-{guiaId} → { [criterioIdx]: nivel }
 */
export function useGrillaProgreso(guiaId: string) {
  const storageKey = `incluia-progreso-${guiaId}`;
  const [progreso, setProgreso] = useState<Record<number, string>>({});

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) setProgreso(JSON.parse(stored) as Record<number, string>);
    } catch (err) {
      console.warn('[useGrillaProgreso] lectura inválida:', err);
    }
  }, [storageKey]);

  const marcar = (criterioIdx: number, nivel: string) => {
    const siguiente: Record<number, string> = { ...progreso };
    // Toggle: si ya estaba marcado ese nivel, lo desmarca.
    if (siguiente[criterioIdx] === nivel) {
      delete siguiente[criterioIdx];
    } else {
      siguiente[criterioIdx] = nivel;
    }
    setProgreso(siguiente);
    try {
      localStorage.setItem(storageKey, JSON.stringify(siguiente));
    } catch (err) {
      console.warn('[useGrillaProgreso] no se pudo guardar:', err);
    }
  };

  return { progreso, marcar };
}

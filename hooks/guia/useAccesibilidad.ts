'use client';

import { useEffect, useState } from 'react';

type Tamano = 'normal' | 'large' | 'xlarge';

const KEY_TAMANO = 'incluia-tamano';
const KEY_CONTRASTE = 'incluia-contraste';

export function useAccesibilidad() {
  const [tamano, setTamano] = useState<Tamano>('normal');
  const [altoContraste, setAltoContraste] = useState(false);

  useEffect(() => {
    const t = localStorage.getItem(KEY_TAMANO) as Tamano | null;
    const c = localStorage.getItem(KEY_CONTRASTE) === 'true';
    if (t) setTamano(t);
    if (c) setAltoContraste(c);
  }, []);

  useEffect(() => {
    document.body.classList.remove('text-large', 'text-xlarge');
    if (tamano === 'large') document.body.classList.add('text-large');
    if (tamano === 'xlarge') document.body.classList.add('text-xlarge');
    localStorage.setItem(KEY_TAMANO, tamano);
  }, [tamano]);

  useEffect(() => {
    document.body.classList.toggle('high-contrast', altoContraste);
    localStorage.setItem(KEY_CONTRASTE, String(altoContraste));
  }, [altoContraste]);

  return { tamano, setTamano, altoContraste, setAltoContraste };
}

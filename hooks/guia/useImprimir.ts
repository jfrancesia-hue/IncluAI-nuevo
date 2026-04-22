'use client';

/**
 * Helper mínimo para disparar el print del browser con los estilos @media print
 * ya configurados en globals.css. No retorna state — es una función pura.
 */
export function useImprimir() {
  return () => {
    if (typeof window !== 'undefined') window.print();
  };
}

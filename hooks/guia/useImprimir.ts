'use client';

/**
 * Helper para disparar el print del browser con los estilos @media print
 * ya configurados en globals.css.
 *
 * Antes del window.print() fuerza la carga de TODAS las imágenes del DOM
 * (convirtiendo lazy → eager y esperando su evento load). Sin esto, las
 * imágenes fuera del viewport inicial (estrategias, materiales, etc.)
 * aparecen blancas en el PDF porque Chrome abre el diálogo antes de que
 * terminen de bajar.
 *
 * Timeout de seguridad 5s: si alguna imagen no responde, imprime igual
 * en vez de dejar al usuario esperando indefinidamente.
 */
export function useImprimir() {
  return async () => {
    if (typeof window === 'undefined') return;

    const imgs = Array.from(
      document.querySelectorAll<HTMLImageElement>('img')
    );

    // Cambiar lazy → eager para que el navegador empiece a descargarlas
    imgs.forEach((img) => {
      if (img.loading === 'lazy') img.loading = 'eager';
    });

    // Esperar a que cada img complete (onload) o falle (onerror).
    // Con timeout global para no bloquear si un CDN tarda.
    const cargadas = Promise.all(
      imgs.map((img) => {
        // Ya cargada (tiene dimensiones naturales > 0)
        if (img.complete && img.naturalWidth > 0) return Promise.resolve();
        // Ya cargada con error (complete sin dimensiones): no vale la pena esperar
        if (img.complete && img.naturalWidth === 0) return Promise.resolve();
        return new Promise<void>((resolve) => {
          const done = () => {
            img.removeEventListener('load', done);
            img.removeEventListener('error', done);
            resolve();
          };
          img.addEventListener('load', done);
          img.addEventListener('error', done);
        });
      })
    );

    const timeout = new Promise<void>((resolve) => setTimeout(resolve, 5000));
    await Promise.race([cargadas, timeout]);

    window.print();
  };
}

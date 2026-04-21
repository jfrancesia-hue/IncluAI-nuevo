import type { SVGProps } from 'react';

type P = SVGProps<SVGSVGElement>;
const base: P = {
  fill: 'none',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  strokeWidth: 2,
};

/** Barras creciendo — stats "guías este mes" */
export function IconBars(props: P) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M4 20h16" />
      <rect x="6" y="12" width="3" height="8" rx="1" />
      <rect x="11" y="8" width="3" height="12" rx="1" />
      <rect x="16" y="4" width="3" height="16" rx="1" />
    </svg>
  );
}

/** Libro abierto — stats "restantes" / módulo docentes */
export function IconBook(props: P) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M12 6C8 3 4 4 3 5v14c1-1 5-2 9 1" />
      <path d="M12 6c4-3 8-2 9-1v14c-1-1-5-2-9 1" />
      <path d="M12 6v16" />
    </svg>
  );
}

/** Estrella rellena — stats "tu plan" */
export function IconStar(props: P) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M12 3l2.7 5.8 6.3.7-4.7 4.3 1.3 6.2L12 17l-5.6 3 1.3-6.2L3 9.5l6.3-.7L12 3z" />
    </svg>
  );
}

/** Casa — módulo familias */
export function IconHouse(props: P) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M4 11l8-7 8 7v9a1 1 0 0 1-1 1h-4v-6h-6v6H5a1 1 0 0 1-1-1v-9z" />
    </svg>
  );
}

/** Cruz médica — módulo profesionales */
export function IconMedkit(props: P) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
      <path d="M12 11v5M9.5 13.5h5" />
    </svg>
  );
}

/** Bombita — tip del día */
export function IconLightbulb(props: P) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M9 18h6" />
      <path d="M10 21h4" />
      <path d="M12 3a6 6 0 0 0-4 10.5c1 1 1.5 2 1.5 3V15h5v-1.5c0-1 .5-2 1.5-3A6 6 0 0 0 12 3z" />
    </svg>
  );
}

/** Saludo — hero del dashboard */
export function IconWave(props: P) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M3 12c2-1 3-3 4-5 1-2 3-4 6-4s5 2 6 5-1 5-3 6l-6 2-4 3-2-4-1-3z" />
    </svg>
  );
}

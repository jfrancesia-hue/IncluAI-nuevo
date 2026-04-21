import type { SVGProps } from 'react';

type P = SVGProps<SVGSVGElement>;

const base: P = {
  fill: 'none',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  strokeWidth: 2,
};

export function IconCheck(props: P) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}

export function IconDownload(props: P) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14" />
    </svg>
  );
}

export function IconCopy(props: P) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <rect x="8" y="3" width="12" height="15" rx="2" />
      <rect x="4" y="7" width="12" height="14" rx="2" />
    </svg>
  );
}

export function IconSparkle(props: P) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M12 3l1.8 4.8L18 9l-4 3.1 1.3 5L12 14.8 8.7 17l1.3-5L6 9l4.2-1.2L12 3z" />
    </svg>
  );
}

export function IconBookmark(props: P) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M19 14V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v14l7-4 7 4z" />
    </svg>
  );
}

export function IconShare(props: P) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="6" r="3" />
      <circle cx="18" cy="18" r="3" />
      <path d="M8.5 10.5L15.5 7.5M8.5 13.5L15.5 16.5" />
    </svg>
  );
}

export function IconAlertTriangle(props: P) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M12 3l10 17H2L12 3z" />
      <path d="M12 9v5" />
      <path d="M12 17h.01" />
    </svg>
  );
}

export function IconClock(props: P) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

export function IconInfo(props: P) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v4M12 16h.01" />
    </svg>
  );
}

export function IconPrinter(props: P) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <rect x="6" y="3" width="12" height="5" rx="1" />
      <rect x="4" y="8" width="16" height="10" rx="2" />
      <rect x="7" y="14" width="10" height="7" rx="1" />
    </svg>
  );
}

export function IconCloud(props: P) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M7 18h11a4 4 0 0 0 .5-7.97A6 6 0 0 0 6.5 9.5 4.5 4.5 0 0 0 7 18Z" />
    </svg>
  );
}

export function IconHome(props: P) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M3 12l9-8 9 8v8a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-8z" />
    </svg>
  );
}

export function IconArrowRight(props: P) {
  return (
    <svg viewBox="0 0 24 24" {...base} {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

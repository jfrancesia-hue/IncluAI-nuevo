import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'IncluAI — Educación inclusiva con IA',
    short_name: 'IncluAI',
    description:
      'Guías pedagógicas y clínicas con IA para docentes, familias y profesionales de salud en Argentina.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FBF8F2',
    theme_color: '#2E86C1',
    orientation: 'portrait',
    lang: 'es-AR',
    categories: ['education', 'health', 'productivity'],
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/apple-icon.png',
        sizes: '180x180',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}

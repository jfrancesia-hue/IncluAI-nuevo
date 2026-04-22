import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: {
    position: 'bottom-right',
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'images.pexels.com' },
    ],
  },
  // Paquetes opcionales de observabilidad/flags: marcados como externals del
  // server bundle. Si no están instalados, los imports dinámicos fallan en
  // runtime (capturado en try/catch) sin warnings estáticos del bundler.
  serverExternalPackages: ['@sentry/nextjs', 'posthog-node'],
};

export default nextConfig;

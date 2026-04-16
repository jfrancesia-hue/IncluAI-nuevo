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
};

export default nextConfig;

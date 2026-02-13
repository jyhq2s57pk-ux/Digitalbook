import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
  },

  // Turbopack root (silences lockfile warning)
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;

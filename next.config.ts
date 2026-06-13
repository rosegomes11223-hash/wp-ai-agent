import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Server Actions (Next.js 14 compatible)
  experimental: {
    serverActions: {
      allowedOrigins: [
        'localhost:3000',
        'your-app.vercel.app', // deploy করার সময় replace করবে
      ],
    },
  },

  // TypeScript strict mode behavior
  typescript: {
    ignoreBuildErrors: false,
  },

  // ESLint during build (safe for production)
  eslint: {
    ignoreDuringBuilds: false,
  },

  // External images support (WordPress, CDN, etc.)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;

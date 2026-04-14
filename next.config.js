/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http',  hostname: '**' },
    ],
    formats: ['image/avif', 'image/webp'],
    dangerouslyAllowSVG: true,
  },
  // Next.js 16+ - moved back to top level
  serverExternalPackages: ['@prisma/client', 'bcryptjs'],
  
  // Turbopack config (replaces webpack for Next.js 16)
  turbopack: {
    resolveAlias: {
      fs: false,
      path: false,
      os: false,
      crypto: false,
    },
  },
};

module.exports = nextConfig;
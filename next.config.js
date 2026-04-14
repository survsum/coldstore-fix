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
  serverExternalPackages: ['@prisma/client', 'bcryptjs'],
  // Turbopack is default in Next.js 16, no need for webpack config
  turbopack: {},
};

module.exports = nextConfig;
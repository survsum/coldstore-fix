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
  // Moved from experimental in Next.js 14.x
  serverExternalPackages: ['@prisma/client', 'bcryptjs'],
  experimental: {
    // Required for Prisma on Vercel
    serverComponentsExternalPackages: ['@prisma/client', 'bcryptjs'],
  },
  // Prevent fs/path from being bundled into client
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
        crypto: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;

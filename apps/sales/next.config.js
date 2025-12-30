/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@keepath/shared-ui', '@keepath/database', '@keepath/types', '@keepath/config'],
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },
};

module.exports = nextConfig;

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'd2rj6r6bdihsme.cloudfront.net',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;

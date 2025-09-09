import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    domains: ['localhost', 'gateway.pinata.cloud', 'ipfs.io'],
  },
  // Remove output: 'export' for Vercel deployment (use server-side rendering)
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
};

export default nextConfig;

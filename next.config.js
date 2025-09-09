/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'gateway.pinata.cloud', 'ipfs.io'],
    unoptimized: true
  },
}

module.exports = nextConfig

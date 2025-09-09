/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'gateway.pinata.cloud', 'ipfs.io'],
    unoptimized: true
  },
  // For Netlify deployment
  output: 'export',
  trailingSlash: true,
  basePath: '',
}

module.exports = nextConfig

const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Ensure file tracing uses project root without relying on __dirname (works in ESM/edge contexts)
  outputFileTracingRoot: path.join(process.cwd()),
  // Note: Webpack config removed for Turbopack compatibility
  // Turbopack reads path aliases from jsconfig.json automatically
  // If using webpack (via dev:webpack), path aliases are also handled by jsconfig.json
  // Configure proxy for backend API
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://zyndrx-backend-blgx.onrender.com/api/:path*',
      },
    ];
  },
  // Configure image domains if needed
  images: {
    domains: ['zyndrx-backend-blgx.onrender.com'],
  },
  // Disable x-powered-by header
  poweredByHeader: false,
  // Configure headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ];
  },
}

module.exports = nextConfig;

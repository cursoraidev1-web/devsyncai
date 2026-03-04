/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  // 1. Backend API Rewrites
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://zyndrx-backend-blgx.onrender.com/api/:path*',
      },
    ];
  },

  // 2. Updated Image Config for Next.js 15
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'zyndrx-backend-blgx.onrender.com',
      },
    ],
  },

  // 3. Security Headers (Safe to include once vercel.json is gone)
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
        ],
      },
    ];
  },
};

export default nextConfig;

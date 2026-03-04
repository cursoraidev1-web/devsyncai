/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://zyndrx-backend-blgx.onrender.com/api/:path*',
      },
    ];
  },

  images: {
    domains: ['zyndrx-backend-blgx.onrender.com'],
  },

  poweredByHeader: false,
  // Custom headers() removed: Vercel builder turns it into route index 6 without src/source → deploy fails.
  // Add security headers in Vercel Dashboard: Project → Settings → Headers (or vercel.json when fixed).
};

export default nextConfig;

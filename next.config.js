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
  // Headers moved to vercel.json to avoid Vercel "Route at index 6 must define src/source" error
};

export default nextConfig; // ← changed from module.exports

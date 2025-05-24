/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.API_BASE_URL 
          ? `${process.env.API_BASE_URL}/:path*` 
          : '/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig; 
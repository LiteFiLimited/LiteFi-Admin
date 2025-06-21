/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_API_URL: 'https://litefi-backend.onrender.com',
    BACKEND_URL: 'https://litefi-backend.onrender.com',
    NEXT_PUBLIC_BACKEND_URL: 'https://litefi-backend.onrender.com',
    NEXTAUTH_SECRET: 'your-super-secret-jwt-key-change-this-in-production',
  },
};

module.exports = nextConfig;

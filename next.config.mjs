/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['192.168.1.*'],
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', '192.168.1.*:3000'],
      bodySizeLimit: '50mb', // ajuste selon la taille max attendue de tes images
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'ton-api.onrender.com',
        pathname: '/uploads/**',
      },
    ],

    dangerouslyAllowLocalIP: process.env.NODE_ENV === 'development',
  },
};

export default nextConfig;

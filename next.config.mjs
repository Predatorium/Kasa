/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['192.168.1.*'],
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', '192.168.1.*:3000'],
      bodySizeLimit: '10mb', // ajuste selon la taille max attendue de tes images
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;

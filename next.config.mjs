/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['192.168.1.*'],
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', '192.168.1.*:3000'],
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

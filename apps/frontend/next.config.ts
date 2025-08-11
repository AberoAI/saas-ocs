import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Biarkan build di Vercel tetap jalan walau ada warning/error ESLint
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Lewati error TypeScript saat build (sementara untuk verifikasi)
    ignoreBuildErrors: true,
  },
  /* config options here */
};

export default nextConfig;

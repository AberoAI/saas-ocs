// apps/frontend/next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Fail build kalau ada error/warning ESLint penting
    ignoreDuringBuilds: false,
  },
  typescript: {
    // Fail build kalau ada error TypeScript
    ignoreBuildErrors: false,
  },

  // ✅ Tetap perlu agar Next men-transpile source dari @repo/backend
  transpilePackages: ["@repo/backend"],

  /* config options here */
};

export default nextConfig;

// apps/frontend/next.config.ts
import type { NextConfig } from "next";

// Ambil origin backend dari NEXT_PUBLIC_TRPC_URL (fallback ke onrender)
const TRPC_URL = process.env.NEXT_PUBLIC_TRPC_URL ?? "https://saas-ocs-backend.onrender.com/trpc";

let BACKEND_HTTP = "https://saas-ocs-backend.onrender.com";
let BACKEND_WS = "wss://saas-ocs-backend.onrender.com";

try {
  const u = new URL(TRPC_URL);
  // gunakan host yang sama untuk http(s) & wss
  BACKEND_HTTP = `${u.protocol.startsWith("http") ? "https" : "https"}://${u.host}`;
  BACKEND_WS = `wss://${u.host}`;
} catch {
  // abaikan — gunakan fallback default di atas
}

const CSP = [
  `default-src 'self'`,
  // izinkan fetch & websocket ke backend Render
  `connect-src 'self' ${BACKEND_HTTP} ${BACKEND_WS}`,
  // allowances umum; sesuaikan jika perlu
  `img-src 'self' data: blob:`,
  `script-src 'self' 'unsafe-inline' 'unsafe-eval'`,
  `style-src 'self' 'unsafe-inline'`,
  `font-src 'self' data:`,
  `frame-ancestors 'self'`,
].join("; ");

const nextConfig = {
  eslint: { ignoreDuringBuilds: false },
  typescript: { ignoreBuildErrors: false },

  // tetap perlu agar Next men-transpile source dari @repo/backend
  transpilePackages: ["@repo/backend"],

  // ⬇️ tambahkan header CSP agar fetch dari FE ke onrender tidak diblokir
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [{ key: "Content-Security-Policy", value: CSP }],
      },
    ];
  },
} satisfies NextConfig;

export default nextConfig;

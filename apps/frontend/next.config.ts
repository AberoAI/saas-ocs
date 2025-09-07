// apps/frontend/next.config.ts
import type { NextConfig } from "next";

// Ambil origin backend dari NEXT_PUBLIC_TRPC_URL (fallback ke onrender)
const TRPC_URL =
  process.env.NEXT_PUBLIC_TRPC_URL ??
  "https://saas-ocs-backend.onrender.com/trpc";

// Sanitasi trailing slash agar tidak jadi //:path*
const TRPC_BASE = TRPC_URL.replace(/\/$/, "");

let BACKEND_HTTP = "https://saas-ocs-backend.onrender.com";
let BACKEND_WS = "wss://saas-ocs-backend.onrender.com";

try {
  const u = new URL(TRPC_BASE);
  const isHttps = u.protocol === "https:";
  // ✅ gunakan protokol yang sesuai (http↔ws, https↔wss)
  BACKEND_HTTP = `${isHttps ? "https" : "http"}://${u.host}`;
  BACKEND_WS = `${isHttps ? "wss" : "ws"}://${u.host}`;
} catch {
  // abaikan — gunakan fallback default di atas
}

const isDev = process.env.NODE_ENV !== "production";

// Kumpulkan target koneksi yang diizinkan untuk fetch & websocket
const CONNECT_TARGETS = [
  `'self'`,
  BACKEND_HTTP,
  BACKEND_WS,
  // ✅ izinkan koneksi lokal saat dev (agar WS http://127.0.0.1:4000 tidak diblokir CSP)
  ...(isDev
    ? [
        "http://127.0.0.1:4000",
        "ws://127.0.0.1:4000",
        "http://localhost:4000",
        "ws://localhost:4000",
      ]
    : []),
].join(" ");

const CSP = [
  `default-src 'self'`,
  `connect-src ${CONNECT_TARGETS}`,
  `img-src 'self' data: blob:`,
  `script-src 'self' 'unsafe-inline' 'unsafe-eval'`,
  `style-src 'self' 'unsafe-inline'`,
  `font-src 'self' data:`,
  `frame-ancestors 'self'`,
].join("; ");

const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: false },
  typescript: { ignoreBuildErrors: false },

  // tetap perlu agar Next men-transpile source dari @repo/backend
  transpilePackages: ["@repo/backend"],

  // ⬇️ proxy HTTP tRPC ke backend → FE cukup akses /_trpc (same-origin, anti CORS)
  async rewrites() {
    return [
      {
        source: "/_trpc/:path*",
        destination: `${TRPC_BASE}/:path*`, // contoh: http://127.0.0.1:4000/trpc/:path*
      },
      {
        source: "/_healthz",
        destination: BACKEND_HTTP + "/healthz",
      },
    ];
  },

  // ⬇️ tambahkan header CSP agar fetch/WS dari FE tidak diblokir
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [{ key: "Content-Security-Policy", value: CSP }],
      },
    ];
  },
};

export default nextConfig;

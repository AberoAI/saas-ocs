// apps/frontend/next.config.ts
import type { NextConfig } from "next";

// ── Sumber kebenaran untuk origin backend tRPC (ABSOLUT)
const ORIGIN_FROM_ENV =
  process.env.TRPC_ORIGIN || // ✅ utama: variabel khusus rewrites
  // fallback: kalau NEXT_PUBLIC_TRPC_URL kebetulan absolut, pakai itu
  (/^https?:\/\//.test(process.env.NEXT_PUBLIC_TRPC_URL ?? "")
    ? new URL(process.env.NEXT_PUBLIC_TRPC_URL as string).origin
    : "") ||
  "https://saas-ocs-backend.onrender.com"; // fallback terakhir (prod)

// Bentuk pasangan http↔ws
const u = new URL(ORIGIN_FROM_ENV);
const isHttps = u.protocol === "https:";
const BACKEND_HTTP = `${isHttps ? "https" : "http"}://${u.host}`;
const BACKEND_WS = `${isHttps ? "wss" : "ws"}://${u.host}`;

const isDev = process.env.NODE_ENV !== "production";

// ── CSP
const CONNECT_TARGETS = [
  `'self'`,
  BACKEND_HTTP,
  BACKEND_WS,
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
  transpilePackages: ["@repo/backend"],

  // ✅ FE → /_trpc/:path*  →  http(s)://<ORIGIN>/trpc/:path*
  async rewrites() {
    return [
      {
        source: "/_trpc/:path*",
        destination: `${BACKEND_HTTP}/trpc/:path*`,
      },
      {
        source: "/_healthz",
        destination: `${BACKEND_HTTP}/healthz`,
      },
    ];
  },

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

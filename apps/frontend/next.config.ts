// apps/frontend/next.config.ts
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// ✅ Tanpa argumen: plugin aktif tapi TIDAK mencari ./i18n/request.ts
const withNextIntl = createNextIntlPlugin();

/**
 * URL backend ABSOLUTE untuk rewrite (harus mengarah ke endpoint /trpc).
 * Contoh: https://api.aberoai.com/trpc
 *
 * Prioritas:
 * 1) TRPC_BACKEND_URL (disarankan)
 * 2) TRPC_ORIGIN + "/trpc" (fallback)
 * 3) onrender fallback (terakhir)
 */
const TRPC_BACKEND: string =
  (process.env.TRPC_BACKEND_URL
    ? process.env.TRPC_BACKEND_URL.replace(/\/$/, "")
    : process.env.TRPC_ORIGIN
      ? `${process.env.TRPC_ORIGIN.replace(/\/$/, "")}/trpc`
      : "https://saas-ocs-backend.onrender.com/trpc");

/** Ekstrak origin http(s) & ws(s) dari TRPC_BACKEND untuk CSP & /_healthz */
let BACKEND_HTTP = "https://saas-ocs-backend.onrender.com";
let BACKEND_WS = "wss://saas-ocs-backend.onrender.com";
try {
  const u = new URL(TRPC_BACKEND); // harus absolute
  const isHttps = u.protocol === "https:";
  BACKEND_HTTP = `${isHttps ? "https" : "http"}://${u.host}`;
  BACKEND_WS = `${isHttps ? "wss" : "ws"}://${u.host}`;
} catch {
  // biarkan fallback default
}

const isDev = process.env.NODE_ENV !== "production";

/** CSP: izinkan koneksi ke origin backend & (opsional) origin lokal saat dev */
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

  // ➜ redirects untuk kanonik TR & dukung diakritik
  async redirects() {
    return [
      { source: "/about", destination: "/en/about", permanent: true },
      { source: "/tr/about", destination: "/tr/hakkinda", permanent: true },
      { source: "/tr/hakkında", destination: "/tr/hakkinda", permanent: true },
    ];
  },

  // FE memanggil /_trpc/:path* → proxy ke TRPC_BACKEND/:path*
  async rewrites() {
    return [
      {
        source: "/_trpc/:path*",
        destination: `${TRPC_BACKEND.replace(/\/$/, "")}/:path*`,
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

export default withNextIntl(nextConfig);

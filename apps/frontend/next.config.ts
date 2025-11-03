import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// ✅ Minimal config, no request.ts lookup
const withNextIntl = createNextIntlPlugin();

/**
 * URL backend ABSOLUTE untuk rewrite (harus mengarah ke endpoint /trpc).
 */
const TRPC_BACKEND: string =
  (process.env.TRPC_BACKEND_URL
    ? process.env.TRPC_BACKEND_URL.replace(/\/$/, "")
    : process.env.TRPC_ORIGIN
      ? `${process.env.TRPC_ORIGIN.replace(/\/$/, "")}/trpc`
      : "https://saas-ocs-backend.onrender.com/trpc");

let BACKEND_HTTP = "https://saas-ocs-backend.onrender.com";
let BACKEND_WS = "wss://saas-ocs-backend.onrender.com";
try {
  const u = new URL(TRPC_BACKEND);
  const isHttps = u.protocol === "https:";
  BACKEND_HTTP = `${isHttps ? "https" : "http"}://${u.host}`;
  BACKEND_WS = `${isHttps ? "wss" : "ws"}://${u.host}`;
} catch {}

const isDev = process.env.NODE_ENV !== "production";

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

/** ✅ FIX: tambahkan blob: agar JS Next.js tidak diblokir CSP */
const CSP = [
  `default-src 'self'`,
  `connect-src ${CONNECT_TARGETS}`,
  `img-src 'self' data: blob:`,
  `script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:`,
  `worker-src 'self' blob:`,
  `style-src 'self' 'unsafe-inline'`,
  `font-src 'self' data:`,
  `frame-ancestors 'self'`,
].join("; ");

const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: false },
  typescript: { ignoreBuildErrors: false },
  transpilePackages: ["@repo/backend"],

  async redirects() {
    return [
      { source: "/", destination: "/en", permanent: false },
      { source: "/about", destination: "/en/about", permanent: false },
      { source: "/contact", destination: "/en/contact", permanent: false },
      { source: "/pricing", destination: "/en/pricing", permanent: false },
      { source: "/features", destination: "/en/features", permanent: false },
      { source: "/solutions", destination: "/en/solutions", permanent: false },
      { source: "/login", destination: "/en/login", permanent: false },
      { source: "/product", destination: "/en/product", permanent: false },
      { source: "/demo", destination: "/en/demo", permanent: false },
      { source: "/privacy", destination: "/en/privacy", permanent: false },
      { source: "/terms", destination: "/en/terms", permanent: false },
      { source: "/faq", destination: "/en/faq", permanent: false },
      { source: "/privacy-policy", destination: "/en/privacy", permanent: false },
      { source: "/terms-of-service", destination: "/en/terms", permanent: false },
      { source: "/verify", destination: "/en/verify", permanent: false },
      { source: "/tr/about", destination: "/tr/hakkinda", permanent: true },
      { source: "/tr/hakkında", destination: "/tr/hakkinda", permanent: true },
    ];
  },

  async rewrites() {
    return [
      { source: "/_trpc/:path*", destination: `${TRPC_BACKEND.replace(/\/$/, "")}/:path*` },
      { source: "/_healthz", destination: `${BACKEND_HTTP}/healthz` },
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

// saas-ocs/apps/frontend/next.config.ts
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/**
 * URL backend ABSOLUTE untuk rewrite (harus mengarah ke endpoint /trpc).
 */
const TRPC_BACKEND: string = process.env.TRPC_BACKEND_URL
  ? process.env.TRPC_BACKEND_URL.replace(/\/$/, "")
  : process.env.TRPC_ORIGIN
    ? `${process.env.TRPC_ORIGIN.replace(/\/$/, "")}/trpc`
    : "https://saas-ocs-backend.onrender.com/trpc";

let BACKEND_HTTP = "https://saas-ocs-backend.onrender.com";
let BACKEND_WS = "wss://saas-ocs-backend.onrender.com";
try {
  const u = new URL(TRPC_BACKEND);
  const isHttps = u.protocol === "https:";
  BACKEND_HTTP = `${isHttps ? "https" : "http"}://${u.host}`;
  BACKEND_WS = `${isHttps ? "wss" : "ws"}://${u.host}`;
} catch {}

const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: false },
  typescript: { ignoreBuildErrors: false },

  async redirects() {
    return [
      { source: "/about", destination: "/foundation", permanent: false },

      { source: "/en/about", destination: "/en/foundation", permanent: false },
      { source: "/tr/about", destination: "/tr/foundation", permanent: false },
      {
        source: "/tr/hakkinda",
        destination: "/tr/foundation",
        permanent: false,
      },
      {
        source: "/tr/hakkında",
        destination: "/tr/foundation",
        permanent: false,
      },

      {
        source: "/tr/cozumler",
        destination: "/tr/solutions",
        permanent: false,
      },
      { source: "/tr/urun", destination: "/tr/product", permanent: false },
      { source: "/tr/fiyatlar", destination: "/tr/pricing", permanent: false },
      { source: "/tr/gizlilik", destination: "/tr/privacy", permanent: false },
      { source: "/tr/kosullar", destination: "/tr/terms", permanent: false },
      { source: "/tr/giris", destination: "/tr/login", permanent: false },

      { source: "/cozumler", destination: "/solutions", permanent: false },
      { source: "/urun", destination: "/product", permanent: false },
      { source: "/fiyatlar", destination: "/pricing", permanent: false },
      { source: "/gizlilik", destination: "/privacy", permanent: false },
      { source: "/kosullar", destination: "/terms", permanent: false },
      { source: "/giris", destination: "/login", permanent: false },
    ];
  },

  async rewrites() {
    return [
      {
        source: "/_trpc/:path*",
        destination: `${TRPC_BACKEND.replace(/\/$/, "")}/:path*`,
      },
      { source: "/_healthz", destination: `${BACKEND_HTTP}/healthz` },
    ];
  },
};

export default withNextIntl(nextConfig);

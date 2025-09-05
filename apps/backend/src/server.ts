// apps/backend/src/server.ts
// muat .env lebih awal
import "dotenv/config";
import http from "http";
import { createHTTPHandler } from "@trpc/server/adapters/standalone";
import { appRouter } from "./server/routers";
import { createContext } from "./trpc/context";

const PORT = Number(process.env.PORT ?? 4000);

// --- CORS setup (long-term, dinamis dari allowlist) ---
/**
 * Gunakan ALLOW_ORIGINS sebagai sumber kebenaran:
 * contoh: "https://aberoai.com,https://aberoai.vercel.app,https://*.vercel.app"
 * (fallback ke CORS_ORIGIN tunggal jika ALLOW_ORIGINS tidak di-set)
 */
const RAW_ALLOW = (process.env.ALLOW_ORIGINS ?? process.env.CORS_ORIGIN ?? "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const ALLOW_LIST = RAW_ALLOW.length ? RAW_ALLOW : ["http://localhost:3000"]; // default lokal dev

function isAllowed(origin: string): boolean {
  if (!origin) return false;
  return ALLOW_LIST.some((allowed) => {
    if (allowed === origin) return true;
    // dukung pola wildcard sederhana: https://*.vercel.app
    if (allowed.startsWith("https://*.")) {
      const suffix = allowed.slice("https://*".length); // ".vercel.app"
      return origin.endsWith(suffix);
    }
    return false;
  });
}

/** Set header CORS global; balas preflight jika OPTIONS. */
function applyCors(req: http.IncomingMessage, res: http.ServerResponse): boolean {
  const origin = (req.headers.origin as string) ?? "";

  // logging bantu diagnosa di Render Logs
  if (origin) {
    const allowed = isAllowed(origin);
    if (!allowed) {
      console.warn("[CORS] BLOCKED origin:", origin, "allowlist:", ALLOW_LIST);
    } else {
      console.log("[CORS] ALLOW origin:", origin);
    }
  } else {
    console.log("[CORS] no Origin header");
  }

  if (isAllowed(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "content-type, authorization, x-tenant-id, x-user-id"
    );
  }

  // tanggapi preflight di level atas biar cepat
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return true;
  }
  return false;
}
// ------------------------------------------------------

const WA_VERIFY_TOKEN = process.env.WA_VERIFY_TOKEN ?? ""; // dari Meta App

const trpcHandler = createHTTPHandler({
  router: appRouter,
  // teruskan opts Node (req/res) ke createContext milikmu
  createContext: (opts) => createContext(opts),
  // onError({ error, path }) { console.error("tRPC error:", path, error); },
});

const server = http.createServer((req, res) => {
  // --- CORS (selalu paling awal) ---
  if (applyCors(req, res)) return;
  // -------------------------------

  const url = req.url ?? "/";

  // tRPC endpoint
  if (url.startsWith("/trpc")) {
    // penting: potong prefix "/trpc" agar handler menerima path prosedur yang benar,
    // mis. "/trpc/healthcheck" -> "/healthcheck"
    (req as any).url = url.replace(/^\/trpc/, "") || "/";
    trpcHandler(req, res);
    return;
  }

  // healthcheck → kembalikan JSON; izinkan CORS untuk observability lintas origin
  if (url === "/healthz") {
    // khusus healthz, bebas CORS agar mudah di-fetch dari FE/debug
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.writeHead(200, { "content-type": "application/json; charset=utf-8" });
    res.end('{"ok":true}');
    return;
  }

  // WhatsApp webhook (verify + receive)
  if (url.startsWith("/webhooks/whatsapp")) {
    if (req.method === "GET") {
      // Verifikasi webhook dari Meta
      const u = new URL(url, `http://${req.headers.host || "localhost"}`);
      const mode = u.searchParams.get("hub.mode");
      const token = u.searchParams.get("hub.verify_token");
      const challenge = u.searchParams.get("hub.challenge");

      if (mode === "subscribe" && token === WA_VERIFY_TOKEN) {
        res.writeHead(200, { "content-type": "text/plain" });
        res.end(challenge ?? "");
      } else {
        res.writeHead(403).end("Forbidden");
      }
      return;
    }

    if (req.method === "POST") {
      // Raw body (jangan parse JSON dulu — penting untuk verifikasi signature)
      let raw = "";
      req.on("data", (c) => (raw += c));
      req.on("end", async () => {
        // TODO: verifikasi X-Hub-Signature-256 di sini (pakai APP_SECRET)
        // TODO: enqueue ke BullMQ untuk diproses worker
        console.log(
          "WA inbound:",
          raw.slice(0, 200) + (raw.length > 200 ? "…" : "")
        );
        res.writeHead(200, { "content-type": "application/json" });
        res.end(JSON.stringify({ ok: true }));
      });
      return;
    }
  }

  // default 404
  res.writeHead(404).end("Not found");
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend listening on http://0.0.0.0:${PORT}`);
  console.log(`- tRPC:     http://0.0.0.0:${PORT}/trpc`);
  console.log(`- Healthz:  http://0.0.0.0:${PORT}/healthz`);
  console.log(`- WhatsApp: http://0.0.0.0:${PORT}/webhooks/whatsapp`);
  console.log(`- CORS allowlist:`, ALLOW_LIST.join(", ") || "(empty)");
});

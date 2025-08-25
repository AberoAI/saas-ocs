// apps/backend/src/server.ts
import "dotenv/config"; // muat .env lebih awal
import http from "http";
import { createHTTPHandler } from "@trpc/server/adapters/standalone";
import { appRouter } from "./server/routers";
import { createContext } from "./trpc/context";

const PORT = Number(process.env.PORT ?? 4000);
const CORS_ORIGIN = process.env.CORS_ORIGIN ?? "http://localhost:3000";
const WA_VERIFY_TOKEN = process.env.WA_VERIFY_TOKEN ?? ""; // dari Meta App

const trpcHandler = createHTTPHandler({
  router: appRouter,
  // teruskan opts Node (req/res) ke createContext milikmu
  createContext: (opts) => createContext(opts),
  // onError({ error, path }) { console.error("tRPC error:", path, error); },
});

const server = http.createServer((req, res) => {
  // --- CORS ---
  res.setHeader("Access-Control-Allow-Origin", CORS_ORIGIN);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "content-type, authorization, x-tenant-id, x-user-id"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }
  // -------------

  const url = req.url ?? "/";

  // tRPC endpoint
  if (url.startsWith("/trpc")) {
    // penting: potong prefix "/trpc" agar handler menerima path prosedur yang benar,
    // mis. "/trpc/healthcheck" -> "/healthcheck"
    (req as any).url = url.replace(/^\/trpc/, "") || "/";
    trpcHandler(req, res);
    return;
  }

  // healthcheck
  if (url === "/healthz") {
    res.writeHead(200, { "content-type": "text/plain" });
    res.end("ok");
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

server.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
  console.log(`- tRPC:     http://localhost:${PORT}/trpc`);
  console.log(`- Healthz:  http://localhost:${PORT}/healthz`);
  console.log(`- WhatsApp: http://localhost:${PORT}/webhooks/whatsapp`);
});

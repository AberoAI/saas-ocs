// CORS util untuk Node http / tRPC standalone
import type { IncomingMessage, ServerResponse } from "http";

const allowList = (process.env.ALLOW_ORIGINS ?? "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

function isAllowed(origin: string): boolean {
  if (!origin) return false;
  return allowList.some((allowed) =>
    allowed === origin ||
    (allowed.startsWith("https://*.") &&
      origin.endsWith(allowed.slice("https://*".length)))
  );
}

/**
 * Set header CORS. Jika preflight (OPTIONS), balas 204 dan return true.
 * Pakai di awal request handler utama.
 */
export function handleCors(req: IncomingMessage, res: ServerResponse): boolean {
  const origin = (req.headers.origin as string) ?? "";

  if (isAllowed(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "content-type, authorization");
  }

  // Preflight
  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return true;
  }
  return false;
}

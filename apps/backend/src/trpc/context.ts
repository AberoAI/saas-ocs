// apps/backend/src/trpc/context.ts
import type { IncomingMessage, ServerResponse } from "http";
import { PrismaClient } from "@prisma/client";
import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { CreateWSSContextFnOptions } from "@trpc/server/adapters/ws";

/**
 * Prisma singleton (hindari koneksi berlebih saat dev)
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/**
 * Bentuk context yang dipakai di seluruh resolver
 */
export type Context = {
  prisma: PrismaClient;
  tenantId?: string | null;
  userId?: string | null;
};

/**
 * Helper: normalisasi headers Node menjadi Record<string, string>
 */
function normalizeHeaders(
  h: IncomingMessage["headers"] | Record<string, string> | undefined,
) {
  const out: Record<string, string> = {};
  if (!h) return out;
  const entries = Array.isArray(h)
    ? (h as unknown as [string, string][])
    : Object.entries(h as any);
  for (const [k, v] of entries) {
    if (Array.isArray(v)) out[k.toLowerCase()] = v.join(", ");
    else if (typeof v === "string") out[k.toLowerCase()] = v;
    else if (typeof v === "number") out[k.toLowerCase()] = String(v);
    else out[k.toLowerCase()] = "";
  }
  return out;
}

/**
 * Ekstrak auth-like info dari headers
 */
function authFrom(
  headers: Record<string, string>,
): Pick<Context, "tenantId" | "userId"> {
  const tenantId = headers["x-tenant-id"] || headers["x-tenantid"] || null;
  const userId = headers["x-user-id"] || headers["x-userid"] || null;
  return { tenantId, userId };
}

/**
 * ✅ createContext generik (kerangka kamu)
 * - Bisa dipanggil dengan { req, res } atau { headers }
 */
export async function createContext(
  opts?:
    | { req: IncomingMessage; res: ServerResponse }
    | { headers?: Record<string, string> },
): Promise<Context> {
  // Ambil headers dari salah satu bentuk opts
  let headers: Record<string, string> = {};
  if (opts && "req" in opts) headers = normalizeHeaders(opts.req.headers);
  else if (opts && "headers" in opts) headers = normalizeHeaders(opts.headers);

  const { tenantId, userId } = authFrom(headers);

  return {
    prisma,
    tenantId,
    userId,
  };
}

/**
 * 🔹 Wrapper untuk adapter Express (HTTP)
 *   – Dipakai oleh createExpressMiddleware
 */
export function createHTTPContext(_opts: CreateExpressContextOptions) {
  // _opts: { req, res }
  return createContext({ req: _opts.req, res: _opts.res });
}

/**
 * 🔹 Wrapper untuk adapter WS
 *   – Dipakai oleh applyWSSHandler
 */
export function createWSSContext(_opts: CreateWSSContextFnOptions) {
  // _opts: { req, ... }
  return createContext({
    req: _opts.req as unknown as IncomingMessage,
    res: undefined as any,
  });
}

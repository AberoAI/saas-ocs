import { PrismaClient } from "@prisma/client";
/**
 * Prisma singleton (hindari koneksi berlebih saat dev)
 */
const globalForPrisma = globalThis;
export const prisma = globalForPrisma.prisma ??
    new PrismaClient({
        log: process.env.NODE_ENV === "development"
            ? ["query", "error", "warn"]
            : ["error"],
    });
if (process.env.NODE_ENV !== "production")
    globalForPrisma.prisma = prisma;
/**
 * Helper: normalisasi headers Node menjadi Record<string, string>
 */
function normalizeHeaders(h) {
    const out = {};
    if (!h)
        return out;
    const entries = Array.isArray(h)
        ? h
        : Object.entries(h);
    for (const [k, v] of entries) {
        if (Array.isArray(v))
            out[k.toLowerCase()] = v.join(", ");
        else if (typeof v === "string")
            out[k.toLowerCase()] = v;
        else if (typeof v === "number")
            out[k.toLowerCase()] = String(v);
        else
            out[k.toLowerCase()] = "";
    }
    return out;
}
/**
 * Ekstrak auth-like info dari headers
 */
function authFrom(headers) {
    const tenantId = headers["x-tenant-id"] || headers["x-tenantid"] || null;
    const userId = headers["x-user-id"] || headers["x-userid"] || null;
    return { tenantId, userId };
}
/**
 * ✅ createContext generik (kerangka kamu)
 * - Bisa dipanggil dengan { req, res } atau { headers }
 */
export async function createContext(opts) {
    // Ambil headers dari salah satu bentuk opts
    let headers = {};
    if (opts && "req" in opts)
        headers = normalizeHeaders(opts.req.headers);
    else if (opts && "headers" in opts)
        headers = normalizeHeaders(opts.headers);
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
export function createHTTPContext(_opts) {
    // _opts: { req, res }
    return createContext({ req: _opts.req, res: _opts.res });
}
/**
 * 🔹 Wrapper untuk adapter WS
 *   – Dipakai oleh applyWSSHandler
 */
export function createWSSContext(_opts) {
    // _opts: { req, ... }
    return createContext({
        req: _opts.req,
        res: undefined,
    });
}
//# sourceMappingURL=context.js.map
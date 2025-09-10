import type { IncomingMessage, ServerResponse } from "http";
import { PrismaClient } from "@prisma/client";
import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { CreateWSSContextFnOptions } from "@trpc/server/adapters/ws";
export declare const prisma: PrismaClient<import("@prisma/client").Prisma.PrismaClientOptions, never, import("@prisma/client/runtime/library").DefaultArgs>;
/**
 * Bentuk context yang dipakai di seluruh resolver
 */
export type Context = {
    prisma: PrismaClient;
    tenantId?: string | null;
    userId?: string | null;
};
/**
 * ✅ createContext generik (kerangka kamu)
 * - Bisa dipanggil dengan { req, res } atau { headers }
 */
export declare function createContext(opts?: {
    req: IncomingMessage;
    res: ServerResponse;
} | {
    headers?: Record<string, string>;
}): Promise<Context>;
/**
 * 🔹 Wrapper untuk adapter Express (HTTP)
 *   – Dipakai oleh createExpressMiddleware
 */
export declare function createHTTPContext(_opts: CreateExpressContextOptions): Promise<Context>;
/**
 * 🔹 Wrapper untuk adapter WS
 *   – Dipakai oleh applyWSSHandler
 */
export declare function createWSSContext(_opts: CreateWSSContextFnOptions): Promise<Context>;

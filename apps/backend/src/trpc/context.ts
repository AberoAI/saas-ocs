import type { inferAsyncReturnType } from "@trpc/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/** Context untuk tRPC backend. */
export async function createContext(opts: { headers?: Record<string, string> } = {}) {
  const h = opts.headers ?? {};
  const tenantId = h["x-tenant-id"] ?? h["X-Tenant-Id"];
  const userId = h["x-user-id"] ?? h["X-User-Id"];
  return { prisma, tenantId: tenantId || undefined, userId: userId || undefined };
}
export type Context = inferAsyncReturnType<typeof createContext>;

// apps/backend/src/server/trpc.ts
import { initTRPC } from "@trpc/server";
import type { Context } from "./context";

// Inisialisasi tRPC dengan Context backend (tanpa Next)
const t = initTRPC.context<Context>().create();

export const router = t.router;
export const procedure = t.procedure;
export const middleware = t.middleware;

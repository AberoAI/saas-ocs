// apps/backend/src/trpc/index.ts
import { initTRPC } from "@trpc/server";
import type { Context } from "./context";

const t = initTRPC.context<Context>().create();

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
export const middleware = t.middleware;

// Re-export agar import "./trpc" tetap bisa dipakai
export { createContext } from "./context";
export type { Context } from "./context";

// apps/backend/src/trpc/trpc.ts
import { initTRPC } from "@trpc/server";
import type { Context } from "./context";

// Bootstrap tRPC dengan konteks backend kamu
const t = initTRPC.context<Context>().create();

// Ekspor API yang kamu pakai di /router/*
export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

// 🔁 Alias kompatibilitas untuk import lama di beberapa file
export const router = createTRPCRouter;
export const procedure = publicProcedure;

// (Opsional) ke depan:
// export const middleware = t.middleware;
// export const mergeRouters = t.mergeRouters;
// export const protectedProcedure = t.procedure.use(isAuthedMiddleware);

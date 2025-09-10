// apps/backend/src/trpc/index.ts
import { initTRPC } from "@trpc/server";
const t = initTRPC.context().create();
export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
export const middleware = t.middleware;
// Re-export agar import "./trpc" tetap bisa dipakai
export { createContext } from "./context";
//# sourceMappingURL=index.js.map
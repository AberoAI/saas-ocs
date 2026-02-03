//apps/backend/src/index.d.ts
export { appRouter } from "./server/routers";
export type AppRouter = typeof import("./server/routers").appRouter;
export { createContext } from "./trpc";
export type { RouterInputs, RouterOutputs } from "./server/routers";

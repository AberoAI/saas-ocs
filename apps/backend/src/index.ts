// apps/backend/src/index.ts

// Ekspor router utama
export { appRouter } from "./server/routers";
// Ekspor tipe router untuk konsumen (FE/shared)
export type AppRouter = typeof import("./server/routers").appRouter;

// Ekspor context runtime (jika diperlukan oleh server lain)
export { createContext } from "./trpc/context";

// (opsional) re-export helper types jika sudah didefinisikan di routers
export type { RouterInputs, RouterOutputs } from "./server/routers";

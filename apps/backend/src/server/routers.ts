// apps/backend/src/server/routers.ts
// Wrapper agar import di apps/backend/src/index.ts tetap valid
// dan mengekspor type AppRouter dari instance router yang sudah ada.

import { appRouter } from "./router";

export { appRouter };
export type AppRouter = typeof appRouter;

// apps/backend/src/trpc/router.ts
// Barrel ringan untuk tRPC primitives (JANGAN export appRouter di sini)
export { router, procedure } from "./trpc";
// (opsional) type-only re-export:
// export type { AppRouter } from "../server/routers";

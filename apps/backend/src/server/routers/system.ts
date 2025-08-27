// apps/backend/src/server/routers/system.ts
import { router, procedure } from "../../trpc/trpc";

/**
 * Namespace "system" untuk hal-hal teknis seperti healthcheck.
 * Dulu healthcheck ada di root, sekarang dipindah ke namespace agar root bersih.
 */
export const systemRouter = router({
  healthcheck: procedure.query(() => "ok"),
});

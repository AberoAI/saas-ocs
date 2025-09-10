// apps/backend/src/server/routers/provider.ts
import { router, procedure } from "../../trpc/trpc";
/**
 * Namespace "provider".
 * ⚠ Hindari nama reserved tRPC di level mana pun.
 */
export const providerRouter = router({
    // ⬇️ WAS: Provider
    info: procedure.query(() => {
        return { ok: true, info: "provider info" };
    }),
});
//# sourceMappingURL=provider.js.map
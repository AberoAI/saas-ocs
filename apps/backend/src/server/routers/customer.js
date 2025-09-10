// apps/backend/src/server/routers/customer.ts
import { router, procedure } from "../../trpc/trpc";
import { z } from "zod";
/**
 * Namespace "customer".
 * ⚠ Hindari nama reserved tRPC: Provider, useContext, useUtils, createClient, dll.
 */
export const customerRouter = router({
    // ⬇️ WAS: createClient
    createCustomer: procedure
        .input(z.object({ name: z.string().min(1) }).optional())
        .mutation(async ({ input, ctx }) => {
        // TODO: implementasi asli kamu di sini
        return { ok: true, created: !!input?.name };
    }),
});
//# sourceMappingURL=customer.js.map
// apps/backend/src/server/routers/index.ts
/**
 * ROOT ROUTER HANYA NAMESPACE.
 * ⚠️ Dilarang menaruh prosedur langsung di root untuk menghindari tabrakan
 *    dengan helper React tRPC (Provider/useContext/useUtils/createClient).
 *
 * Catatan:
 * - Setiap domain/fitur harus berada di router terpisah (system, chat, dll).
 * - File ini hanya menggabungkan (compose) seluruh namespace router.
 */
import { router } from "../../trpc/trpc";
import { systemRouter } from "./system";
import { chatRouter } from "./chat";
import { customerRouter } from "./customer";
import { providerRouter } from "./provider";
import { billingRouter } from "./billing";
import { adminRouter } from "./admin";
import { webhookRouter } from "./webhook";
import { eventsRouter } from "./events"; // ✅ ditambahkan
// ────────────────────────────────────────────────────────────────────────────────
export const appRouter = router({
    system: systemRouter,
    chat: chatRouter,
    customer: customerRouter,
    provider: providerRouter,
    billing: billingRouter,
    admin: adminRouter,
    webhook: webhookRouter,
    events: eventsRouter, // ✅ didaftarkan
});
//# sourceMappingURL=index.js.map
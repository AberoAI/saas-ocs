// apps/backend/src/http-app.ts
import express from "express";
import cors from "cors";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "./server/routers"; // ✅ perbaiki path
import { createHTTPContext } from "./trpc/context";
// Anotasi eksplisit: hindari TS2742 pada app
export const app = express();
// CORS: ALLOW_ORIGINS = https://aberoai.com,https://*.aberoai.com
const allow = (process.env.ALLOW_ORIGINS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
app.use(cors({
    origin: allow.length ? allow : undefined,
    credentials: true,
}));
app.get("/healthz", (_req, res) => res.json({ ok: true }));
app.use("/trpc", createExpressMiddleware({
    router: appRouter,
    createContext: createHTTPContext,
}));
//# sourceMappingURL=http-app.js.map
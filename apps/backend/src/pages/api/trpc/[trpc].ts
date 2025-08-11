// apps/backend/src/pages/api/trpc/[trpc].ts
// ✅ Entry point untuk tRPC API route (Next.js API handler)

import * as trpcNext from "@trpc/server/adapters/next";
import { appRouter } from "../../../server/routers";
import { createContext } from "../../../server/context";

// ✅ API handler yang dipakai Next.js untuk menerima request dari frontend
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext,
});

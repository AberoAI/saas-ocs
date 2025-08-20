// apps/frontend/src/app/api/trpc/route.ts
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter, createContext } from "@repo/backend";

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: async () => {
      const headers = Object.fromEntries(req.headers);
      return createContext({ headers });
    },
  });

export { handler as GET, handler as POST };

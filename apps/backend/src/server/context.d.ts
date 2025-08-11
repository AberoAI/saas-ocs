import type { inferAsyncReturnType } from "@trpc/server";
import type { NextApiRequest } from "next";
export declare function createContext({ req }: {
    req: NextApiRequest;
}): Promise<{
    userId: string;
    tenantId: string;
    prisma: any;
}>;
export type Context = inferAsyncReturnType<typeof createContext>;
//# sourceMappingURL=context.d.ts.map
export declare const appRouter: import("@trpc/server").TRPCBuiltRouter<{
    ctx: {
        userId: string;
        tenantId: string;
        prisma: any;
    };
    meta: object;
    errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    transformer: false;
}, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
    healthcheck: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: string;
        meta: object;
    }>;
    chat: import("@trpc/server").TRPCBuiltRouter<{
        ctx: {
            userId: string;
            tenantId: string;
            prisma: any;
        };
        meta: object;
        errorShape: import("@trpc/server").TRPCDefaultErrorShape;
        transformer: false;
    }, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
        sendMessage: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                content: string;
            };
            output: any;
            meta: object;
        }>;
        getMessages: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: any;
            meta: object;
        }>;
    }>>;
}>>;
export type AppRouter = typeof appRouter;
//# sourceMappingURL=index.d.ts.map
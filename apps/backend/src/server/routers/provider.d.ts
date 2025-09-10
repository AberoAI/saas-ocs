/**
 * Namespace "provider".
 * ⚠ Hindari nama reserved tRPC di level mana pun.
 */
export declare const providerRouter: import("@trpc/server").TRPCBuiltRouter<{
    ctx: import("../../trpc").Context;
    meta: object;
    errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    transformer: false;
}, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
    info: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: {
            ok: boolean;
            info: string;
        };
        meta: object;
    }>;
}>>;

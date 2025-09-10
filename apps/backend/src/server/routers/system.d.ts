/**
 * Namespace "system" untuk hal-hal teknis seperti healthcheck.
 * Dulu healthcheck ada di root, sekarang dipindah ke namespace agar root bersih.
 */
export declare const systemRouter: import("@trpc/server").TRPCBuiltRouter<{
    ctx: import("../../trpc").Context;
    meta: object;
    errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    transformer: false;
}, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
    healthcheck: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: string;
        meta: object;
    }>;
}>>;

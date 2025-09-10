/**
 * Namespace "customer".
 * ⚠ Hindari nama reserved tRPC: Provider, useContext, useUtils, createClient, dll.
 */
export declare const customerRouter: import("@trpc/server").TRPCBuiltRouter<{
    ctx: import("../../trpc").Context;
    meta: object;
    errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    transformer: false;
}, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
    createCustomer: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            name: string;
        } | undefined;
        output: {
            ok: boolean;
            created: boolean;
        };
        meta: object;
    }>;
}>>;

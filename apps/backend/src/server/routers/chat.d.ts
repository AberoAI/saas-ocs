export declare const chatRouter: import("@trpc/server").TRPCBuiltRouter<{
    ctx: import("../../trpc").Context;
    meta: object;
    errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    transformer: false;
}, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
    sendMessage: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            content: string;
        };
        output: {
            id: string;
            createdAt: Date;
            tenantId: string;
            direction: string;
            content: string;
            contactId: string | null;
            fromNumber: string | null;
            status: string | null;
            toNumber: string | null;
            waMessageId: string | null;
        };
        meta: object;
    }>;
    getMessages: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: {
            id: string;
            createdAt: Date;
            tenantId: string;
            direction: string;
            content: string;
            contactId: string | null;
            fromNumber: string | null;
            status: string | null;
            toNumber: string | null;
            waMessageId: string | null;
        }[];
        meta: object;
    }>;
}>>;

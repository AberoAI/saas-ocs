export declare const t: import("@trpc/server").TRPCRootObject<{
    userId: string;
    tenantId: string;
    prisma: any;
}, object, import("@trpc/server").TRPCRuntimeConfigOptions<{
    userId: string;
    tenantId: string;
    prisma: any;
}, object>, {
    ctx: {
        userId: string;
        tenantId: string;
        prisma: any;
    };
    meta: object;
    errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    transformer: false;
}>;
export declare const router: import("@trpc/server").TRPCRouterBuilder<{
    ctx: {
        userId: string;
        tenantId: string;
        prisma: any;
    };
    meta: object;
    errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    transformer: false;
}>;
export declare const procedure: import("@trpc/server").TRPCProcedureBuilder<{
    userId: string;
    tenantId: string;
    prisma: any;
}, object, object, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, false>;
//# sourceMappingURL=trpc.d.ts.map
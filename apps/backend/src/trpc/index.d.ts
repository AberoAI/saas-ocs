import type { Context } from "./context";
export declare const createTRPCRouter: import("@trpc/server").TRPCRouterBuilder<{
    ctx: Context;
    meta: object;
    errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    transformer: false;
}>;
export declare const publicProcedure: import("@trpc/server").TRPCProcedureBuilder<Context, object, object, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, false>;
export declare const middleware: <$ContextOverrides>(fn: import("@trpc/server").TRPCMiddlewareFunction<Context, object, object, $ContextOverrides, unknown>) => import("@trpc/server").TRPCMiddlewareBuilder<Context, object, $ContextOverrides, unknown>;
export { createContext } from "./context";
export type { Context } from "./context";

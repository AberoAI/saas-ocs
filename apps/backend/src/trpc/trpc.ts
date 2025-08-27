import { initTRPC } from "@trpc/server";
import type { Context } from "./context";

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const procedure = t.procedure;
// Hindari key bentrok seperti: useContext, useUtils, Provider, client, createClient, QueryClient, dll.

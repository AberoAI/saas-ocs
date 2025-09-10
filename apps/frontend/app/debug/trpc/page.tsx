// apps/frontend/app/debug/trpc/page.tsx
export const dynamic = "force-dynamic";
export const revalidate = 0;

import DebugTRPCClient from "./DebugTRPCClient";

export default function Page() {
  return <DebugTRPCClient />;
}

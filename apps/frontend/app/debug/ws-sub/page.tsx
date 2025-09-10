// apps/frontend/app/debug/ws-sub/page.tsx
export const dynamic = "force-dynamic";
export const revalidate = 0;

import WsSubClient from "./WsSubClient";

export default function Page() {
  return <WsSubClient />;
}

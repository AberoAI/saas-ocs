// apps/frontend/src/app/dashboard/page.tsx

// Hindari prerender/SSG untuk halaman dashboard
export const dynamic = "force-dynamic";
export const revalidate = 0;

import NextDynamic from "next/dynamic"; // ⬅️ rename alias agar tidak bentrok dengan ekspor "dynamic"

// Render murni di client untuk menghindari eksekusi hook di server build
const DashboardClient = NextDynamic(() => import("./DashboardClient"), { ssr: false });

export default function Page() {
  return <DashboardClient />;
}

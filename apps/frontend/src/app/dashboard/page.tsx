// apps/frontend/src/app/dashboard/page.tsx

// Hindari prerender/SSG untuk halaman dashboard
export const dynamic = "force-dynamic";
export const revalidate = 0;

// Import Client Component secara langsung
// Next.js akan otomatis membuat boundary Server→Client.
import DashboardClient from "./DashboardClient";

export default function Page() {
  return <DashboardClient />;
}

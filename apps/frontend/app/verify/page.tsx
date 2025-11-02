// apps/frontend/app/verify/page.tsx
import { redirect } from "next/navigation";

// Static-safe: tidak pakai next-intl / headers / cookies
export const dynamic = "force-static";

export default function Page() {
  redirect("/en/verify");
}

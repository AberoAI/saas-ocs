// apps/frontend/app/(dev)/lab/hero/page.tsx
import { notFound } from "next/navigation";
// ⬇️ UBAH: relative path ke components/lab
import LabShell from "../../../../../components/lab/LabShell";
import HeroVariantExample from "../../../../../components/lab/hero/HeroVariantExample";

export default function LabHeroPage() {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  return (
    <LabShell
      title="Hero Variant Experiment"
      subtitle="Versi eksperimen hero AberoAI untuk menguji copy, layout, dan motion sebelum ke landing utama."
    >
      <div className="mt-6">
        <HeroVariantExample />
      </div>
    </LabShell>
  );
}

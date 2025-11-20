// apps/frontend/app/(dev)/lab/scroll/page.tsx
import { notFound } from "next/navigation";
// ⬇️ UBAH: relative path ke components/lab
import LabShell from "../../../../../components/lab/LabShell";
import ScrollExperimentExample from "../../../../../components/lab/scroll/ScrollExperimentExample";

export default function LabScrollPage() {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  return (
    <LabShell
      title="Scroll Interaction Experiment"
      subtitle="Demo fade + translate berbasis scroll sebagai fondasi untuk pinned storytelling AberoAI."
    >
      <div className="mt-6">
        <ScrollExperimentExample />
      </div>
    </LabShell>
  );
}

// apps/frontend/app/(dev)/lab/svg/page.tsx
import { notFound } from "next/navigation";
// ⬇️ UBAH: relative path ke components/lab
import LabShell from "../../../../../components/lab/LabShell";
import SvgExperimentExample from "../../../../../components/lab/svg/SvgExperimentExample";

export default function LabSvgPage() {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  return (
    <LabShell
      title="SVG Experiment"
      subtitle="Demo sederhana animasi stroke-draw / orbit sebagai baseline untuk SVG AberoAI."
    >
      <div className="mt-6">
        <SvgExperimentExample />
      </div>
    </LabShell>
  );
}

// apps/frontend/app/[locale]/(dev)/lab/showcase/page.tsx
import { notFound } from "next/navigation";
import LabShell from "../../../../../components/lab/LabShell";
import ShowcaseGrowthContent from "../../../../../components/lab/showcase/ShowcaseGrowthContent";

export default function LabShowcaseContentPage() {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  return (
    <LabShell
      title="Showcase Content Variant"
      subtitle="Eksperimen isi showcase: value prop + chat bubbles, tanpa mengubah container utama."
    >
      <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50/60 px-6 py-8">
        <ShowcaseGrowthContent />
      </div>
    </LabShell>
  );
}

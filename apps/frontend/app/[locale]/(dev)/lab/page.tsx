// apps/frontend/app/(dev)/lab/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
// ⬇️ UBAH: pakai relative path ke components/lab
import LabShell from "../../../../components/lab/LabShell";

export default function LabIndexPage() {
  // 🔐 Hanya aktif di environment development
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  return (
    <LabShell
      title="AberoAI LAB"
      subtitle="Internal playground untuk eksperimen animasi, scroll, dan hero—tidak memengaruhi halaman utama."
    >
      <div className="grid gap-4 sm:grid-cols-3 mt-6">
        <Link
          href="/lab/svg"
          className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm transition hover:border-slate-300 hover:shadow-md"
        >
          <h2 className="text-sm font-semibold text-slate-900">
            SVG Experiments
          </h2>
          <p className="mt-1 text-xs text-slate-600">
            Coba animasi svg seperti stroke-draw, pulse, orbit, dll.
          </p>
        </Link>

        <Link
          href="/lab/scroll"
          className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm transition hover:border-slate-300 hover:shadow-md"
        >
          <h2 className="text-sm font-semibold text-slate-900">
            Scroll Interactions
          </h2>
          <p className="mt-1 text-xs text-slate-600">
            Eksperimen efek scroll: fade, translate, pinned cluster, dsb.
          </p>
        </Link>

        <Link
          href="/lab/hero"
          className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm transition hover:border-slate-300 hover:shadow-md"
        >
          <h2 className="text-sm font-semibold text-slate-900">
            Hero Variants
          </h2>
          <p className="mt-1 text-xs text-slate-600">
            Uji variasi hero AberoAI sebelum dibawa ke landing utama.
          </p>
        </Link>
      </div>

      <p className="mt-6 text-xs text-slate-500">
        Catatan: Semua eksperimen di sini hanya untuk development dan tidak
        digunakan di production build.
      </p>
    </LabShell>
  );
}

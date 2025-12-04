// apps/frontend/app/[locale]/(dev)/lab/pipeline/page.tsx

import SystemPipelineFlow from "@/components/lab/pipeline/SystemPipelineFlow";

export default function PipelineLabPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-8">
        <header className="space-y-2">
          <h1 className="text-lg font-semibold text-slate-900">
            LAB — Pipeline System
          </h1>

          <p className="max-w-2xl text-sm text-slate-600">
            Development-only pipeline visualization for AberoAI system flow.
          </p>
        </header>

        <SystemPipelineFlow />
      </div>
    </main>
  );
}

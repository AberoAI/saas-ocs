"use client";
import Link from "next/link";
import type { AboutCopy } from "./types";

export default function AboutView({ copy }: { copy: AboutCopy }) {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-bold mb-6">{copy.title}</h1>

      <h2 className="text-xl font-semibold mb-3">🎯 {copy.mission.title}</h2>
      {copy.mission.ps.map((p: string, i: number) => (
        <p key={i} className="mb-3 text-black/70">{p}</p>
      ))}

      <h2 className="text-xl font-semibold mb-3">⚙️ {copy.what.title}</h2>
      <p className="mb-3 text-black/70">{copy.what.p1}</p>

      <h3 className="mt-4 font-semibold">{copy.features.title}</h3>
      <ul className="list-disc list-inside mb-6 text-black/70 space-y-1">
        {copy.features.items.map((x: string, i: number) => <li key={i}>{x}</li>)}
      </ul>

      <h3 className="mt-4 font-semibold">{copy.value.title}</h3>
      <ul className="list-disc list-inside mb-8 text-black/70 space-y-1">
        {copy.value.items.map((x: string, i: number) => <li key={i}>{x}</li>)}
      </ul>

      <h2 className="text-xl font-semibold mb-3">💡 {copy.how.title}</h2>
      <p className="mb-3 text-black/70">{copy.how.p1}</p>

      <h3 className="mt-2 font-semibold">{copy.principles.title}</h3>
      <ul className="list-disc list-inside mb-6 text-black/70 space-y-1">
        {copy.principles.items.map((x: string, i: number) => <li key={i}>{x}</li>)}
      </ul>

      <h3 className="mt-2 font-semibold">{copy.outcomes.title}</h3>
      <ul className="list-disc list-inside mb-6 text-black/70 space-y-1">
        {copy.outcomes.items.map((x: string, i: number) => <li key={i}>{x}</li>)}
      </ul>

      <p className="mb-8 text-black/70">{copy.outcomes.closer}</p>

      <p className="text-black/70">
        {copy.contact.prefix}{" "}
        <Link href="/contact" className="text-blue-600 hover:underline">
          {copy.contact.link}
        </Link>.
      </p>
    </main>
  );
}

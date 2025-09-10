// apps/frontend/app/login/page.tsx
import type { Metadata } from "next";
import LoginClient from "./LoginClient";

export const metadata: Metadata = {
  title: "Login – AberoAI",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function Page({
  searchParams,
}: {
  searchParams?: { next?: string; error?: string };
}) {
  // Ambil next & error dari URL di sisi server (stabil & long-term)
  const rawNext = searchParams?.next || "/dashboard";
  let nextPath = "/dashboard";
  try {
    nextPath = decodeURIComponent(rawNext);
  } catch {
    nextPath = rawNext; // fallback aman
  }

  const nextAuthError = searchParams?.error ?? null;

  return <LoginClient nextPath={nextPath} nextAuthError={nextAuthError} />;
}

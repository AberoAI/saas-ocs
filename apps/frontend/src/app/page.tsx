"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false, // tetap, biar kita kontrol feedback sendiri
    });

    setLoading(false);

    if (res?.ok) {
      setMsg(
        "Login sukses. Coba buka /api/auth/session atau pindah ke halaman lain.",
      );
    } else {
      setMsg(res?.error || "Login gagal");
    }
  }

  return (
    <main className="min-h-[60vh] mx-auto max-w-sm py-10 px-4 font-sans">
      <h1 className="text-2xl font-semibold mb-6">Login</h1>

      <form onSubmit={onSubmit} className="grid gap-3">
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="username"
          required
          className="border rounded px-3 py-2"
        />

        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
          className="border rounded px-3 py-2"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white rounded py-2 disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      {msg && <p className="mt-3 text-sm">{msg}</p>}
    </main>
  );
}

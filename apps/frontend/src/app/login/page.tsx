// apps/frontend/src/app/login/page.tsx
'use client';

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

    const emailTrim = email.trim();
    const passTrim = password.trim();
    if (!emailTrim || !passTrim) {
      setMsg("Email dan password wajib diisi.");
      return;
    }

    setLoading(true);
    try {
      const res = await signIn("credentials", {
        email: emailTrim,
        password: passTrim,
        redirect: false, // tetap seperti punyamu
      });

      if (res?.ok) {
        setMsg("✅ Login sukses. Coba buka /api/auth/session atau refresh halaman utama.");
        // kalau mau auto-redirect, uncomment:
        // window.location.href = "/";
      } else {
        setMsg(res?.error || "❌ Login gagal. Periksa email/password.");
      }
    } catch (err: any) {
      setMsg(`❌ Terjadi kesalahan: ${err?.message || String(err)}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 360, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>Login</h1>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="username"
          required
          aria-label="Email"
          style={{ border: "1px solid #ccc", borderRadius: 6, padding: "10px" }}
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
          aria-label="Password"
          style={{ border: "1px solid #ccc", borderRadius: 6, padding: "10px" }}
        />
        <button
          type="submit"
          disabled={loading}
          aria-busy={loading}
          style={{
            padding: "10px",
            borderRadius: 6,
            background: "#000",
            color: "#fff",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      {msg && (
        <p style={{ marginTop: 12, fontSize: 14 }}>
          {msg}
        </p>
      )}
    </main>
  );
}

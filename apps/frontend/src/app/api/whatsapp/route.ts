// apps/frontend/src/app/api/whatsapp/route.ts
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs"; // aman di Vercel

// Jika sudah punya backend terpisah, set BACKEND_URL di Environment Vercel.
// contoh: https://your-backend.example.com
const BACKEND_URL = process.env.BACKEND_URL;

/** GET: Meta Webhook Verification */
export async function GET(req: NextRequest) {
  // Proxy ke backend jika disediakan
  if (BACKEND_URL) {
    const search = new URL(req.url).search;
    const r = await fetch(`${BACKEND_URL}/webhooks/whatsapp${search}`, {
      method: "GET",
    });
    const txt = await r.text();
    return new NextResponse(txt, { status: r.status });
  }

  // Fallback tanpa backend: verifikasi token langsung (tanpa DB)
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === process.env.WA_VERIFY_TOKEN) {
    return new NextResponse(challenge ?? "", { status: 200 });
  }
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

/** POST: Inbound Messages */
export async function POST(req: NextRequest) {
  // Proxy ke backend jika ada (disarankan)
  if (BACKEND_URL) {
    const bodyText = await req.text();
    const r = await fetch(`${BACKEND_URL}/webhooks/whatsapp`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: bodyText,
    });
    const respText = await r.text();
    return new NextResponse(respText, {
      status: r.status,
      headers: {
        "content-type": r.headers.get("content-type") ?? "application/json",
      },
    });
  }

  // Fallback: terima saja tanpa proses
  return NextResponse.json(
    { ok: true, note: "Backend not configured; message accepted (no-op)." },
    { status: 200 }
  );
}

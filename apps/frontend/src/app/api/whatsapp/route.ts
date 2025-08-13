// apps/frontend/src/app/api/whatsapp/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Queue } from "bullmq";
import type { InboundWaJob } from "shared/queue-types";
import { getPrisma } from "@/lib/prisma"; // <- perbaikan di sini

export const runtime = "nodejs"; // Penting untuk Prisma di Vercel

const inboundQueue = new Queue<InboundWaJob>("wa-inbound", {
  connection: { url: process.env.REDIS_URL! },
});

/** GET: Verify Token (Meta setup) */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === process.env.WA_VERIFY_TOKEN) {
    return new NextResponse(challenge ?? "", { status: 200 });
  }
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

/** POST: Receive Inbound Messages */
export async function POST(req: NextRequest) {
  const prisma = getPrisma();

  try {
    const body = await req.json();

    const entry = body?.entry?.[0];
    const change = entry?.changes?.[0];
    const value = change?.value;
    const messages = value?.messages;

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ status: "ok", info: "no_messages" }, { status: 200 });
    }

    const msg = messages[0];
    const from = String(msg.from);
    const waMessageId = msg.id ? String(msg.id) : undefined;
    const text = msg.text?.body ? String(msg.text.body) : "";
    const to = value?.metadata?.display_phone_number
      ? String(value.metadata.display_phone_number)
      : "";

    const tenant = await prisma.tenant.findFirst();
    if (!tenant) {
      return NextResponse.json({ error: "No tenant configured" }, { status: 500 });
    }

    const contact =
      (await prisma.contact.findUnique({ where: { waPhone: from } })) ??
      (await prisma.contact.create({
        data: { tenantId: tenant.id, waPhone: from, name: null },
      }));

    await prisma.message.create({
      data: {
        tenantId: tenant.id,
        contactId: contact.id,
        direction: "inbound",
        content: text,
        waMessageId,
        fromNumber: from,
        toNumber: to,
        status: "received",
      },
    });

    await inboundQueue.add("inbound-wa", {
      tenantId: tenant.id,
      from,
      to,
      waMessageId: waMessageId ?? "",
      content: text,
    });

    return NextResponse.json({ status: "ok" }, { status: 200 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("WA webhook error:", msg);
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
}

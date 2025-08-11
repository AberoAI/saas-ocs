// apps/frontend/src/app/api/whatsapp/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Queue } from "bullmq";
import type { InboundWaJob } from "shared/queue-types";

const prisma = new PrismaClient();

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
  try {
    const body = await req.json();

    // Ambil struktur standar dari Meta Webhook
    const entry = body?.entry?.[0];
    const change = entry?.changes?.[0];
    const value = change?.value;
    const messages = value?.messages;

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ status: "ok", info: "no_messages" }, { status: 200 });
    }

    // Ambil message pertama
    const msg = messages[0];
    const from = String(msg.from);
    const waMessageId = msg.id ? String(msg.id) : undefined;
    const text = msg.text?.body ? String(msg.text.body) : "";
    const to = value?.metadata?.display_phone_number
      ? String(value.metadata.display_phone_number)
      : "";

    // Tenant (MVP: ambil tenant pertama)
    const tenant = await prisma.tenant.findFirst();
    if (!tenant) {
      return NextResponse.json({ error: "No tenant configured" }, { status: 500 });
      }

    // Pastikan contact ada (unik by waPhone)
    const contact =
      (await prisma.contact.findUnique({ where: { waPhone: from } })) ??
      (await prisma.contact.create({
        data: { tenantId: tenant.id, waPhone: from, name: null },
      }));

    // ✅ Opsi A: pakai foreign key langsung (paling stabil di semua versi Prisma)
    await prisma.message.create({
      data: {
        tenantId: tenant.id,
        contactId: contact.id,           // <-- kunci fix-nya di sini
        direction: "inbound",
        content: text,
        waMessageId,
        fromNumber: from,
        toNumber: to,
        status: "received",
      },
    });

    // Enqueue untuk diproses worker
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

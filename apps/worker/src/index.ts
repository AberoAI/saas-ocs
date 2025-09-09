// apps/worker/src/index.ts
import "dotenv/config"; // ✅ Pastikan ENV terbaca di worker process
import { Worker } from "bullmq";
import { PrismaClient } from "@prisma/client";
import type { InboundWaJob } from "shared/queue-types"; // ✅ alias dari packages/shared
import { sendWhatsAppText } from "../../backend/src/lib/whatsapp"; // reuse helper dari backend

// ✅ Worker BullMQ untuk queue "wa-inbound"
const inboundWorker = new Worker<InboundWaJob>(
  "wa-inbound",
  async (job) => {
    const prisma = new PrismaClient();

    try {
      const { tenantId, from, to, content } = job.data;
      let reply: string | null = null;

      // --- (Opsional) Balasan AI via OpenAI ---
      if (process.env.OPENAI_API_KEY) {
        try {
          const OpenAI = (await import("openai")).default;
          const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

          const completion = await openai.chat.completions.create({
            model: process.env.OPENAI_MODEL || "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content:
                  "Kamu adalah asisten CS singkat, ramah, dan membantu. Jawab dalam Bahasa Indonesia dengan ringkas.",
              },
              {
                role: "user",
                content:
                  `Nomor pelanggan: ${from}\n` +
                  `Pesan:\n${content || "(kosong)"}\n\n` +
                  `Balas dengan informasi yang relevan dan sopan.`,
              },
            ],
            temperature: 0.3,
            max_tokens: 180,
          });

          reply = completion.choices?.[0]?.message?.content?.trim() || null;
        } catch (e) {
          console.warn("[worker] OpenAI error, fallback to echo:", e);
        }
      }

      // --- Fallback reply sederhana ---
      if (!reply) {
        reply = content?.trim()
          ? `Echo: ${content}`
          : "Halo! Pesan Anda sudah kami terima.";
      }

      // Pastikan contact ada
      const existingContact = await prisma.contact.findUnique({
        where: { waPhone: from },
      });

      const contact =
        existingContact ??
        (await prisma.contact.create({
          data: { tenantId, waPhone: from, name: null },
        }));

      // Kirim WhatsApp
      await sendWhatsAppText({ to: from, text: reply });

      // Simpan outbound message
      await prisma.message.create({
        data: {
          tenantId,
          contactId: contact.id,
          direction: "outbound",
          content: reply,
          fromNumber: to,
          toNumber: from,
          status: "sent",
        },
      });
    } finally {
      await prisma.$disconnect();
    }
  },
  {
    // ✅ Gunakan koneksi Redis dari ENV
    connection: { url: process.env.REDIS_URL! },
  },
);

// Logging event
inboundWorker.on("ready", () => {
  console.log("✅ worker ready (queue: wa-inbound)");
});
inboundWorker.on("completed", (job) => {
  console.log(`[wa-inbound] completed: ${job.id}`);
});
inboundWorker.on("failed", (job, err) => {
  console.error(`[wa-inbound] failed: ${job?.id}`, err);
});

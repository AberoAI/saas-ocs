// apps/backend/src/server/routers/chat.ts
import { router, procedure } from "../trpc";
import { z } from "zod";

export const chatRouter = router({
  // ✅ Menangani pengiriman pesan
  sendMessage: procedure
    .input(z.object({ content: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const message = await ctx.prisma.message.create({
        data: {
          content: input.content,
          tenantId: ctx.tenantId,
          direction: "outbound",
        },
      });

      // Bisa tambahkan ke queue worker atau broadcast via WebSocket
      return message;
    }),

  // ✅ Mengambil pesan terakhir
  getMessages: procedure.query(async ({ ctx }) => {
    return await ctx.prisma.message.findMany({
      where: { tenantId: ctx.tenantId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
  }),
});

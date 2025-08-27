import { router, procedure } from "../../trpc/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const chatRouter = router({
  sendMessage: procedure
    .input(z.object({ content: z.string().min(1) }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.tenantId) throw new TRPCError({ code: "UNAUTHORIZED", message: "Missing tenant" });
      const message = await ctx.prisma.message.create({
        data: {
          content: input.content,
          direction: "outbound",
          tenant: { connect: { id: ctx.tenantId } },
          ...(ctx.userId ? { user: { connect: { id: ctx.userId } } } : {}),
        },
      });
      return message;
    }),

  getMessages: procedure.query(async ({ ctx }) => {
    if (!ctx.tenantId) throw new TRPCError({ code: "UNAUTHORIZED", message: "Missing tenant" });
    return ctx.prisma.message.findMany({
      where: { tenantId: ctx.tenantId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
  }),
});

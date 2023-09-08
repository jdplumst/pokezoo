import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const tradeRouter = router({
  initiateTrade: protectedProcedure
    .input(
      z.object({ speciesId: z.string(), description: z.string().nullish() })
    )
    .mutation(async ({ ctx, input }) => {
      const initiatorId = ctx.session.user.id;
      const trade = await ctx.prisma.trade.create({
        data: {
          initiatorId: initiatorId,
          initiatorSpeciesId: input.speciesId,
          description: input.description
        }
      });
      return { trade: trade };
    }),

  cancelTrade: protectedProcedure
    .input(z.object({ tradeId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const trade = await ctx.prisma.trade.findFirst({
        where: { id: input.tradeId }
      });
      if (!trade) {
        throw Error(`Trade with id ${input.tradeId} does not exist`);
      }
      if (trade.initiatorId !== ctx.session.user.id) {
        throw Error("You are not authorized to delete this trade");
      }
      await ctx.prisma.trade.delete({ where: { id: input.tradeId } });
    })
});

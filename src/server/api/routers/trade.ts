import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const tradeRouter = router({
  initiateTrade: protectedProcedure
    .input(
      z.object({ instanceId: z.string(), description: z.string().nullish() })
    )
    .mutation(async ({ ctx, input }) => {
      const initiatorId = ctx.session.user.id;
      const trade = await ctx.prisma.trade.create({
        data: {
          initiatorId: initiatorId,
          initiatorInstanceId: input.instanceId,
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
    }),

  offerTrade: protectedProcedure
    .input(z.object({ tradeId: z.string(), instanceId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const trade = await ctx.prisma.trade.findFirst({
        where: { id: input.tradeId }
      });
      if (!trade) {
        throw Error(`Trade with id ${input.tradeId} does not exist`);
      }
      if (trade.offererId) {
        throw Error("There is already an offer for this trade");
      }
      const newTrade = await ctx.prisma.trade.update({
        where: { id: input.tradeId },
        data: {
          offererId: ctx.session.user.id,
          offererInstanceId: input.instanceId
        }
      });
      return { trade: newTrade };
    }),

  withdrawTrade: protectedProcedure
    .input(z.object({ tradeId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const trade = await ctx.prisma.trade.findFirst({
        where: { id: input.tradeId }
      });
      if (!trade) {
        throw Error(`Trade with id ${input.tradeId} does not exist`);
      }
      if (trade.offererId !== ctx.session.user.id) {
        throw Error("You are not the offerer for this trade");
      }
      await ctx.prisma.trade.update({
        where: { id: input.tradeId },
        data: { offererId: null, offererInstanceId: null }
      });
    })
});

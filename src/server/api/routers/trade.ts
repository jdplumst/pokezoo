import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const tradeRouter = router({
  getTrades: protectedProcedure.query(async ({ ctx }) => {
    const trades = await ctx.prisma.trade.findMany({
      orderBy: { modifyDate: "desc" },
      include: {
        initiator: { select: { username: true } },
        offerer: { select: { username: true } },
        initiatorInstance: {
          select: {
            species: {
              select: { name: true, img: true, rarity: true, shiny: true }
            }
          }
        },
        offererInstance: {
          select: {
            species: {
              select: { name: true, img: true, rarity: true, shiny: true }
            }
          }
        }
      }
    });
    return { trades: trades };
  }),

  initiateTrade: protectedProcedure
    .input(
      z.object({ instanceId: z.string(), description: z.string().nullish() })
    )
    .mutation(async ({ ctx, input }) => {
      const initiatorId = ctx.session.user.id;
      const instance = await ctx.prisma.instance.findFirst({
        where: { id: input.instanceId }
      });
      if (!instance) {
        throw Error(`Instance with id ${input.instanceId} does not exist`);
      }
      if (instance?.userId !== initiatorId) {
        throw Error(
          `Instance with id ${input.instanceId} does not belong to you`
        );
      }
      const exists = await ctx.prisma.trade.findFirst({
        where: {
          OR: [
            { initiatorInstanceId: input.instanceId },
            { offererInstanceId: input.instanceId }
          ]
        }
      });
      if (exists) {
        throw Error(
          `Instance with id ${input.instanceId} is already in a trade`
        );
      }
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
        throw Error("You are not authorized to cancel this trade");
      }
      await ctx.prisma.trade.delete({ where: { id: input.tradeId } });
    }),

  offerTrade: protectedProcedure
    .input(z.object({ tradeId: z.string(), instanceId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const offererId = ctx.session.user.id;
      const instance = await ctx.prisma.instance.findFirst({
        where: { id: input.instanceId }
      });
      if (!instance) {
        throw Error(`Instance with id ${input.instanceId} does not exist`);
      }
      if (instance?.userId !== offererId) {
        throw Error(
          `Instance with id ${input.instanceId} does not belong to you`
        );
      }
      const trade = await ctx.prisma.trade.findFirst({
        where: { id: input.tradeId }
      });
      if (!trade) {
        throw Error(`Trade with id ${input.tradeId} does not exist`);
      }
      if (trade.offererId) {
        throw Error("There is already an offer for this trade");
      }
      if (trade.initiatorId === ctx.session.user.id) {
        throw Error("You can't give an offer for your own trade");
      }
      const exists = await ctx.prisma.trade.findFirst({
        where: {
          OR: [
            { initiatorInstanceId: input.instanceId },
            { offererInstanceId: input.instanceId }
          ]
        }
      });
      if (exists) {
        throw Error(
          `Instance with id ${input.instanceId} is already in a trade`
        );
      }
      const newTrade = await ctx.prisma.trade.update({
        where: { id: input.tradeId },
        data: {
          offererId: ctx.session.user.id,
          offererInstanceId: input.instanceId,
          modifyDate: new Date()
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
        data: {
          offererId: null,
          offererInstanceId: null,
          modifyDate: new Date()
        }
      });
    }),

  acceptTrade: protectedProcedure
    .input(z.object({ tradeId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const trade = await ctx.prisma.trade.findFirst({
        where: { id: input.tradeId }
      });
      if (!trade) {
        throw Error(`Trade with id ${input.tradeId} does not exist`);
      }
      if (trade.initiatorId !== ctx.session.user.id) {
        throw Error("You are not the initiator for this trade");
      }
      if (!trade.offererId || !trade.offererInstanceId) {
        throw Error("There is no offer for this trade");
      }
      await ctx.prisma.instance.update({
        where: { id: trade.initiatorInstanceId },
        data: { userId: trade.offererId }
      });
      await ctx.prisma.instance.update({
        where: { id: trade.offererInstanceId },
        data: { userId: trade.initiatorId }
      });
      await ctx.prisma.trade.delete({ where: { id: input.tradeId } });
    }),

  rejectTrade: protectedProcedure
    .input(z.object({ tradeId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const trade = await ctx.prisma.trade.findFirst({
        where: { id: input.tradeId }
      });
      if (!trade) {
        throw Error(`Trade with id ${input.tradeId} does not exist`);
      }
      if (trade.initiatorId !== ctx.session.user.id) {
        throw Error("You are not the initiator for this trade");
      }
      if (!trade.offererId || !trade.offererInstanceId) {
        throw Error("There is no offer for this trade");
      }
      const newTrade = await ctx.prisma.trade.update({
        where: { id: input.tradeId },
        data: {
          offererId: null,
          offererInstanceId: null,
          modifyDate: new Date()
        }
      });
      return { trade: newTrade };
    })
});

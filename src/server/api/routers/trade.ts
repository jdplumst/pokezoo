import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";

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
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Instance with id ${input.instanceId} does not exist`
        });
      }
      if (instance?.userId !== initiatorId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: `Instance with id ${input.instanceId} does not belong to you`
        });
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
        throw new TRPCError({
          code: "CONFLICT",
          message: `Instance with id ${input.instanceId} is already in a trade`
        });
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
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Trade with id ${input.tradeId} does not exist`
        });
      }
      if (trade.initiatorId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not authorized to cancel this trade"
        });
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
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Instance with id ${input.instanceId} does not exist`
        });
      }
      if (instance?.userId !== offererId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: `Instance with id ${input.instanceId} does not belong to you`
        });
      }
      const trade = await ctx.prisma.trade.findFirst({
        where: { id: input.tradeId }
      });
      if (!trade) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Trade with id ${input.tradeId} does not exist`
        });
      }
      if (trade.offererId) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "There is already an offer for this trade"
        });
      }
      if (trade.initiatorId === ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can't give an offer for your own trade"
        });
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
        throw new TRPCError({
          code: "CONFLICT",
          message: `Instance with id ${input.instanceId} is already in a trade`
        });
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
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Trade with id ${input.tradeId} does not exist`
        });
      }
      if (trade.offererId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not the offerer for this trade"
        });
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
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Trade with id ${input.tradeId} does not exist`
        });
      }
      if (trade.initiatorId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not the initiator for this trade"
        });
      }
      if (!trade.offererId || !trade.offererInstanceId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "There is no offer for this trade"
        });
      }
      const initiatorInstance = await ctx.prisma.instance.findFirst({
        where: { id: trade.initiatorInstanceId },
        select: { id: true, userId: true, species: { select: { yield: true } } }
      });
      const offererInstance = await ctx.prisma.instance.findFirst({
        where: { id: trade.offererInstanceId },
        select: { id: true, userId: true, species: { select: { yield: true } } }
      });
      if (!initiatorInstance) {
        await ctx.prisma.trade.delete({ where: { id: input.tradeId } });
        throw new TRPCError({
          code: "CONFLICT",
          message: "This initiator's Pokemon no longer belongs to the initiator"
        });
      }
      if (!offererInstance) {
        await ctx.prisma.trade.update({
          where: { id: input.tradeId },
          data: {
            offererId: null,
            offererInstanceId: null,
            modifyDate: new Date()
          }
        });
        throw new TRPCError({
          code: "CONFLICT",
          message: "The offered Pokemon no longer belongs to the offerer"
        });
      }
      if (initiatorInstance?.userId !== trade.initiatorId) {
        await ctx.prisma.trade.delete({ where: { id: input.tradeId } });
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "This initiator's Pokemon no longer belongs to the initiator"
        });
      }
      if (offererInstance?.userId !== trade.offererId) {
        await ctx.prisma.trade.update({
          where: { id: input.tradeId },
          data: {
            offererId: null,
            offererInstanceId: null,
            modifyDate: new Date()
          }
        });
        throw new TRPCError({
          code: "CONFLICT",
          message: "The offered Pokemon no longer belongs to the offerer"
        });
      }
      const currInitiatorYield = await ctx.prisma.user.findFirst({
        where: { id: trade.initiatorId },
        select: { totalYield: true }
      });
      const currOffererYield = await ctx.prisma.user.findFirst({
        where: { id: trade.offererId },
        select: { totalYield: true }
      });
      await ctx.prisma.$transaction([
        ctx.prisma.instance.update({
          where: { id: trade.initiatorInstanceId },
          data: { userId: trade.offererId, modifyDate: new Date() }
        }),
        ctx.prisma.instance.update({
          where: { id: trade.offererInstanceId },
          data: { userId: trade.initiatorId, modifyDate: new Date() }
        }),
        ctx.prisma.user.update({
          where: { id: trade.initiatorId },
          data: {
            totalYield:
              currInitiatorYield?.totalYield! -
              initiatorInstance?.species.yield! +
              offererInstance?.species.yield!
          }
        }),
        ctx.prisma.user.update({
          where: { id: trade.offererId },
          data: {
            totalYield:
              currOffererYield?.totalYield! -
              offererInstance?.species.yield! +
              initiatorInstance?.species.yield!
          }
        }),
        ctx.prisma.trade.delete({ where: { id: input.tradeId } }),
        ctx.prisma.trade.deleteMany({
          where: {
            OR: [
              { initiatorInstanceId: initiatorInstance.id },
              { initiatorInstanceId: offererInstance.id }
            ]
          }
        }),
        ctx.prisma.trade.updateMany({
          where: {
            OR: [
              { offererInstanceId: initiatorInstance.id },
              { offererInstanceId: offererInstance.id }
            ]
          },
          data: {
            offererId: null,
            offererInstanceId: null
          }
        })
      ]);
    }),

  rejectTrade: protectedProcedure
    .input(z.object({ tradeId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const trade = await ctx.prisma.trade.findFirst({
        where: { id: input.tradeId }
      });
      if (!trade) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Trade with id ${input.tradeId} does not exist`
        });
      }
      if (trade.initiatorId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not the initiator for this trade"
        });
      }
      if (!trade.offererId || !trade.offererInstanceId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "There is no offer for this trade"
        });
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

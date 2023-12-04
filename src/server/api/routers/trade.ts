import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";
import { instance, species, trade, user } from "../../db/schema";
import { and, desc, eq, or } from "drizzle-orm";
import { alias } from "drizzle-orm/mysql-core";

export const tradeRouter = router({
  getTrades: protectedProcedure.query(async ({ ctx }) => {
    const initiator = alias(user, "initiator");
    const offerer = alias(user, "offerer");

    const initiatorInstance = ctx.db
      .select({
        id: instance.id,
        name: species.name,
        img: species.img,
        rarity: species.rarity,
        shiny: species.shiny
      })
      .from(instance)
      .leftJoin(species, eq(instance.speciesId, species.id))
      .as("initiatorInstance");

    const offererInstance = ctx.db
      .select({
        id: instance.id,
        name: species.name,
        img: species.img,
        rarity: species.rarity,
        shiny: species.shiny
      })
      .from(instance)
      .leftJoin(species, eq(instance.speciesId, species.id))
      .as("offererInstance");

    const trades = await ctx.db
      .select()
      .from(trade)
      .innerJoin(initiator, eq(trade.initiatorId, initiator.id))
      .leftJoin(offerer, eq(trade.offererId, offerer.id))
      .innerJoin(
        initiatorInstance,
        eq(trade.initiatorInstanceId, initiatorInstance.id)
      )
      .leftJoin(
        offererInstance,
        eq(trade.offererInstanceId, offererInstance.id)
      )
      .orderBy(desc(trade.modifyDate));

    return { trades: trades };
  }),

  initiateTrade: protectedProcedure
    .input(
      z.object({ instanceId: z.string(), description: z.string().nullish() })
    )
    .mutation(async ({ ctx, input }) => {
      const initiatorId = ctx.session.user.id;

      const instanceData = (
        await ctx.db
          .select()
          .from(instance)
          .where(eq(instance.id, input.instanceId))
      )[0];

      if (!instanceData) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Instance with id ${input.instanceId} does not exist`
        });
      }

      if (instanceData.userId !== initiatorId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: `Instance with id ${input.instanceId} does not belong to you`
        });
      }

      const exists = (
        await ctx.db
          .select()
          .from(trade)
          .where(
            or(
              eq(trade.initiatorInstanceId, input.instanceId),
              eq(trade.offererInstanceId, input.instanceId)
            )
          )
      )[0];

      if (exists) {
        throw new TRPCError({
          code: "CONFLICT",
          message: `Instance with id ${input.instanceId} is already in a trade`
        });
      }

      await ctx.db.insert(trade).values({
        initiatorId: initiatorId,
        initiatorInstanceId: input.instanceId,
        description: input.description
      });

      return { message: "Trade created successfully" };
    }),

  cancelTrade: protectedProcedure
    .input(z.object({ tradeId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const tradeData = (
        await ctx.db.select().from(trade).where(eq(trade.id, input.tradeId))
      )[0];

      if (!tradeData) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Trade with id ${input.tradeId} does not exist`
        });
      }

      if (tradeData.initiatorId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not authorized to cancel this trade"
        });
      }

      await ctx.db.delete(trade).where(eq(trade.id, input.tradeId));

      return { message: "Trade deleted successfully" };
    }),

  offerTrade: protectedProcedure
    .input(z.object({ tradeId: z.string(), instanceId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const offererId = ctx.session.user.id;

      const instanceData = (
        await ctx.db
          .select()
          .from(instance)
          .where(eq(instance.id, input.instanceId))
      )[0];

      if (!instanceData) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Instance with id ${input.instanceId} does not exist`
        });
      }

      if (instanceData?.userId !== offererId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: `Instance with id ${input.instanceId} does not belong to you`
        });
      }

      const tradeData = (
        await ctx.db.select().from(trade).where(eq(trade.id, input.tradeId))
      )[0];

      if (!tradeData) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Trade with id ${input.tradeId} does not exist`
        });
      }

      if (tradeData.offererId) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "There is already an offer for this trade"
        });
      }

      if (tradeData.initiatorId === ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can't give an offer for your own trade"
        });
      }

      const exists = (
        await ctx.db
          .select()
          .from(trade)
          .where(
            or(
              eq(trade.initiatorInstanceId, input.instanceId),
              eq(trade.offererInstanceId, input.instanceId)
            )
          )
      )[0];

      if (exists) {
        throw new TRPCError({
          code: "CONFLICT",
          message: `Instance with id ${input.instanceId} is already in a trade`
        });
      }

      await ctx.db
        .update(trade)
        .set({
          offererId: ctx.session.user.id,
          offererInstanceId: input.instanceId,
          modifyDate: new Date()
        })
        .where(eq(trade.id, input.tradeId));

      return { message: "Trade offer placed successfully" };
    }),

  withdrawTrade: protectedProcedure
    .input(z.object({ tradeId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const tradeData = (
        await ctx.db.select().from(trade).where(eq(trade.id, input.tradeId))
      )[0];

      if (!tradeData) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Trade with id ${input.tradeId} does not exist`
        });
      }

      if (tradeData.offererId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not the offerer for this trade"
        });
      }

      await ctx.db
        .update(trade)
        .set({
          offererId: null,
          offererInstanceId: null,
          modifyDate: new Date()
        })
        .where(eq(trade.id, input.tradeId));

      return { message: "Withdrawn from trade successfully" };
    }),

  acceptTrade: protectedProcedure
    .input(z.object({ tradeId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const tradeData = (
        await ctx.db.select().from(trade).where(eq(trade.id, input.tradeId))
      )[0];

      if (!tradeData) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Trade with id ${input.tradeId} does not exist`
        });
      }

      if (tradeData.initiatorId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not the initiator for this trade"
        });
      }

      if (!tradeData.offererId || !tradeData.offererInstanceId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "There is no offer for this trade"
        });
      }

      const initiatorInstance = (
        await ctx.db
          .select({
            id: instance.id,
            userId: instance.userId,
            yield: species.yield
          })
          .from(instance)
          .innerJoin(species, eq(instance.speciesId, species.id))
          .where(
            and(
              eq(instance.id, tradeData.initiatorInstanceId),
              eq(instance.userId, tradeData.initiatorId)
            )
          )
      )[0];

      const offererInstance = (
        await ctx.db
          .select({
            id: instance.id,
            userId: instance.userId,
            yield: species.yield
          })
          .from(instance)
          .innerJoin(species, eq(instance.speciesId, species.id))
          .where(
            and(
              eq(instance.id, tradeData.offererInstanceId),
              eq(instance.userId, tradeData.offererId)
            )
          )
      )[0];

      if (!initiatorInstance) {
        await ctx.db.delete(trade).where(eq(trade.id, input.tradeId));

        throw new TRPCError({
          code: "CONFLICT",
          message: "This initiator's Pokemon no longer belongs to the initiator"
        });
      }

      if (!offererInstance) {
        await ctx.db
          .update(trade)
          .set({
            offererId: null,
            offererInstanceId: null,
            modifyDate: new Date()
          })
          .where(eq(trade.id, input.tradeId));

        throw new TRPCError({
          code: "CONFLICT",
          message: "The offered Pokemon no longer belongs to the offerer"
        });
      }

      const initiator = (
        await ctx.db
          .select({ totalYield: user.totalYield })
          .from(user)
          .where(eq(user.id, tradeData.initiatorId))
      )[0];

      const offerer = (
        await ctx.db
          .select({ totalYield: user.totalYield })
          .from(user)
          .where(eq(user.id, tradeData.offererId))
      )[0];

      await ctx.db.transaction(async (tx) => {
        await tx
          .update(instance)
          .set({ userId: tradeData.offererId!, modifyDate: new Date() })
          .where(eq(instance.id, tradeData.initiatorInstanceId));

        await tx
          .update(instance)
          .set({ userId: tradeData.initiatorId, modifyDate: new Date() })
          .where(eq(instance.id, tradeData.offererInstanceId!));

        await tx
          .update(user)
          .set({
            totalYield:
              initiator.totalYield -
              initiatorInstance.yield +
              offererInstance.yield
          })
          .where(eq(user.id, tradeData.initiatorId));

        await tx
          .update(user)
          .set({
            totalYield:
              offerer.totalYield -
              offererInstance.yield +
              initiatorInstance.yield
          })
          .where(eq(user.id, tradeData.offererId!));

        await tx.delete(trade).where(eq(trade.id, input.tradeId));

        await tx
          .delete(trade)
          .where(
            or(
              eq(trade.initiatorInstanceId, initiatorInstance.id),
              eq(trade.initiatorInstanceId, offererInstance.id)
            )
          );

        await tx
          .update(trade)
          .set({ offererId: null, offererInstanceId: null })
          .where(
            or(
              eq(trade.offererInstanceId, initiatorInstance.id),
              eq(trade.offererInstanceId, offererInstance.id)
            )
          );
      });

      return { message: "Trade accepted successfully" };
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

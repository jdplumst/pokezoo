import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";
import {
  instances,
  profiles,
  rarities,
  species,
  trades
} from "../../db/schema";
import { and, desc, eq, or } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";

export const tradeRouter = router({
  getTrades: protectedProcedure.query(async ({ ctx }) => {
    const initiator = alias(profiles, "initiator");
    const offerer = alias(profiles, "offerer");
    const initiatorInstance = alias(instances, "initiatorInstance");
    const offererInstance = alias(instances, "offererInstance");
    const initiatorSpecies = alias(species, "initiatorSpecies");
    const offererSpecies = alias(species, "offererSpecies");
    const initiatorRarity = alias(rarities, "initiatorRarity");
    const offererRarity = alias(rarities, "offererRarity");

    const tradesData = await ctx.db
      .select()
      .from(trades)
      .innerJoin(initiator, eq(trades.initiatorId, initiator.userId))
      .leftJoin(offerer, eq(trades.offererId, offerer.userId))
      .innerJoin(
        initiatorInstance,
        eq(trades.initiatorInstanceId, initiatorInstance.id)
      )
      .innerJoin(
        initiatorSpecies,
        eq(initiatorInstance.speciesId, initiatorSpecies.id)
      )
      .innerJoin(
        initiatorRarity,
        eq(initiatorSpecies.rarityId, initiatorRarity.id)
      )
      .leftJoin(
        offererInstance,
        eq(trades.offererInstanceId, offererInstance.id)
      )
      .leftJoin(
        offererSpecies,
        eq(offererInstance.speciesId, offererSpecies.id)
      )
      .leftJoin(offererRarity, eq(offererSpecies.rarityId, offererRarity.id))
      .orderBy(desc(trades.modifyDate));

    return { trades: tradesData };
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
          .from(instances)
          .where(eq(instances.id, input.instanceId))
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
          .from(trades)
          .where(
            or(
              eq(trades.initiatorInstanceId, input.instanceId),
              eq(trades.offererInstanceId, input.instanceId)
            )
          )
      )[0];

      if (exists) {
        throw new TRPCError({
          code: "CONFLICT",
          message: `Instance with id ${input.instanceId} is already in a trade`
        });
      }

      await ctx.db.insert(trades).values({
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
        await ctx.db.select().from(trades).where(eq(trades.id, input.tradeId))
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

      await ctx.db.delete(trades).where(eq(trades.id, input.tradeId));

      return { message: "Trade deleted successfully" };
    }),

  offerTrade: protectedProcedure
    .input(z.object({ tradeId: z.string(), instanceId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const offererId = ctx.session.user.id;

      const instanceData = (
        await ctx.db
          .select()
          .from(instances)
          .where(eq(instances.id, input.instanceId))
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
        await ctx.db.select().from(trades).where(eq(trades.id, input.tradeId))
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
          .from(trades)
          .where(
            or(
              eq(trades.initiatorInstanceId, input.instanceId),
              eq(trades.offererInstanceId, input.instanceId)
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
        .update(trades)
        .set({
          offererId: ctx.session.user.id,
          offererInstanceId: input.instanceId,
          modifyDate: new Date()
        })
        .where(eq(trades.id, input.tradeId));

      return { message: "Trade offer placed successfully" };
    }),

  withdrawTrade: protectedProcedure
    .input(z.object({ tradeId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const tradeData = (
        await ctx.db.select().from(trades).where(eq(trades.id, input.tradeId))
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
        .update(trades)
        .set({
          offererId: null,
          offererInstanceId: null,
          modifyDate: new Date()
        })
        .where(eq(trades.id, input.tradeId));

      return { message: "Withdrawn from trade successfully" };
    }),

  acceptTrade: protectedProcedure
    .input(z.object({ tradeId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const tradeData = (
        await ctx.db.select().from(trades).where(eq(trades.id, input.tradeId))
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
            id: instances.id,
            userId: instances.userId,
            yield: species.yield
          })
          .from(instances)
          .innerJoin(species, eq(instances.speciesId, species.id))
          .where(
            and(
              eq(instances.id, tradeData.initiatorInstanceId),
              eq(instances.userId, tradeData.initiatorId)
            )
          )
      )[0];

      const offererInstance = (
        await ctx.db
          .select({
            id: instances.id,
            userId: instances.userId,
            yield: species.yield
          })
          .from(instances)
          .innerJoin(species, eq(instances.speciesId, species.id))
          .where(
            and(
              eq(instances.id, tradeData.offererInstanceId),
              eq(instances.userId, tradeData.offererId)
            )
          )
      )[0];

      if (!initiatorInstance) {
        await ctx.db.delete(trades).where(eq(trades.id, input.tradeId));

        throw new TRPCError({
          code: "CONFLICT",
          message: "This initiator's Pokemon no longer belongs to the initiator"
        });
      }

      if (!offererInstance) {
        await ctx.db
          .update(trades)
          .set({
            offererId: null,
            offererInstanceId: null,
            modifyDate: new Date()
          })
          .where(eq(trades.id, input.tradeId));

        throw new TRPCError({
          code: "CONFLICT",
          message: "The offered Pokemon no longer belongs to the offerer"
        });
      }

      const initiator = (
        await ctx.db
          .select({ totalYield: profiles.totalYield })
          .from(profiles)
          .where(eq(profiles.userId, tradeData.initiatorId))
      )[0];

      const offerer = (
        await ctx.db
          .select({ totalYield: profiles.totalYield })
          .from(profiles)
          .where(eq(profiles.userId, tradeData.offererId))
      )[0];

      await ctx.db.transaction(async (tx) => {
        await tx
          .update(instances)
          .set({ userId: tradeData.offererId!, modifyDate: new Date() })
          .where(eq(instances.id, tradeData.initiatorInstanceId));

        await tx
          .update(instances)
          .set({ userId: tradeData.initiatorId, modifyDate: new Date() })
          .where(eq(instances.id, tradeData.offererInstanceId!));

        await tx
          .update(profiles)
          .set({
            totalYield:
              initiator.totalYield -
              initiatorInstance.yield +
              offererInstance.yield
          })
          .where(eq(profiles.userId, tradeData.initiatorId));

        await tx
          .update(profiles)
          .set({
            totalYield:
              offerer.totalYield -
              offererInstance.yield +
              initiatorInstance.yield
          })
          .where(eq(profiles.userId, tradeData.offererId!));

        await tx.delete(trades).where(eq(trades.id, input.tradeId));

        await tx
          .delete(trades)
          .where(
            or(
              eq(trades.initiatorInstanceId, initiatorInstance.id),
              eq(trades.initiatorInstanceId, offererInstance.id)
            )
          );

        await tx
          .update(trades)
          .set({ offererId: null, offererInstanceId: null })
          .where(
            or(
              eq(trades.offererInstanceId, initiatorInstance.id),
              eq(trades.offererInstanceId, offererInstance.id)
            )
          );
      });

      return { message: "Trade accepted successfully" };
    }),

  rejectTrade: protectedProcedure
    .input(z.object({ tradeId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const tradeData = (
        await ctx.db.select().from(trades).where(eq(trades.id, input.tradeId))
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

      await ctx.db
        .update(trades)
        .set({
          offererId: null,
          offererInstanceId: null,
          modifyDate: new Date()
        })
        .where(eq(trades.id, input.tradeId));

      return { message: "Trade rejected successfully" };
    })
});

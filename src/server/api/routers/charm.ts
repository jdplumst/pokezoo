import { and, eq } from "drizzle-orm";
import { charms, profiles, userCharms } from "../../db/schema";
import { protectedProcedure, router } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const charmRouter = router({
  getCharms: protectedProcedure.query(async ({ ctx }) => {
    const charmsData = await ctx.db.select().from(charms);
    return { charms: charmsData };
  }),

  purchaseCharm: protectedProcedure
    .input(z.object({ charmId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const currUser = (
        await ctx.db
          .select({ balance: profiles.balance })
          .from(profiles)
          .where(eq(profiles.userId, ctx.session.user.id))
      )[0];

      if (!currUser) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Not authorized to make this request"
        });
      }

      const charmData = (
        await ctx.db.select().from(charms).where(eq(charms.id, input.charmId))
      )[0];

      if (!charmData) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Charm does not exist"
        });
      }

      const exists = (
        await ctx.db
          .select()
          .from(userCharms)
          .where(
            and(
              eq(userCharms.charmId, input.charmId),
              eq(userCharms.userId, ctx.session.user.id)
            )
          )
      )[0];

      if (exists) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "You have already claimed this charm"
        });
      }

      if (currUser.balance < charmData.cost) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "You cannot afford this charm"
        });
      }

      await ctx.db.transaction(async (tx) => {
        await tx
          .insert(userCharms)
          .values({ userId: ctx.session.user.id, charmId: input.charmId });

        await tx
          .update(profiles)
          .set({ balance: currUser.balance - charmData.cost })
          .where(eq(profiles.userId, ctx.session.user.id));
      });

      return { message: "Charm bought successfully" };
    }),

  getUserCharms: protectedProcedure.query(async ({ ctx }) => {
    const currUser = (
      await ctx.db
        .select({ balance: profiles.balance })
        .from(profiles)
        .where(eq(profiles.userId, ctx.session.user.id))
    )[0];

    if (!currUser) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Not authorized to make this request"
      });
    }

    try {
      const charmsData = await ctx.db.select().from(userCharms).leftJoin(charms, eq(userCharms.charmId, charms.id))
      return { charmsData }
    } catch (err) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong. Try again later."
      })
    }
  })
});

import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";
import { MAX_YIELD } from "@/src/constants";
import { achievement, user, userAchievement } from "../../db/schema";
import { and, eq } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";

export const achievementRouter = router({
  getAchievements: protectedProcedure.query(async ({ ctx }) => {
    const achievements = await ctx.db.select().from(achievement);
    return { achievements: achievements };
  }),

  claimAchievement: protectedProcedure
    .input(z.object({ achievementId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const currUser = (
        await ctx.db
          .select({ id: user.id, totalYield: user.totalYield })
          .from(user)
          .where(eq(user.id, ctx.session.user.id))
      )[0];

      if (!currUser) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Not authorized to make this request"
        });
      }

      const achievementData = (
        await ctx.db
          .select()
          .from(achievement)
          .where(eq(achievement.id, input.achievementId))
      )[0];

      if (!achievement) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Achievement does not exist"
        });
      }

      const exists = (
        await ctx.db
          .select()
          .from(userAchievement)
          .where(
            and(
              eq(userAchievement.userId, ctx.session.user.id),
              eq(userAchievement.achievementId, input.achievementId)
            )
          )
      )[0];

      if (exists) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You have already claimed this achievement."
        });
      }

      const newYield =
        currUser.totalYield + achievementData.yield > MAX_YIELD
          ? MAX_YIELD
          : currUser.totalYield + achievementData.yield;

      await ctx.db.transaction(async (tx) => {
        await tx
          .update(user)
          .set({ totalYield: newYield })
          .where(eq(user.id, ctx.session.user.id));
        await tx.insert(userAchievement).values({
          userId: ctx.session.user.id,
          achievementId: input.achievementId
        });
      });

      return { message: "Achievement claimed successfully" };
    })
});

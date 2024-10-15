import { and, eq } from "drizzle-orm";
import { profiles, quests, userQuests } from "../../db/schema";
import { protectedProcedure, router } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const questRouter = router({
  getUserQuests: protectedProcedure.query(async ({ ctx }) => {
    const currUserQuests = await ctx.db
      .select()
      .from(userQuests)
      .leftJoin(quests, eq(userQuests.questId, quests.id))
      .where(eq(userQuests.userId, ctx.session.user.id));

    return currUserQuests;
  }),

  claimQuestReward: protectedProcedure
    .input(
      z.object({
        userQuestId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const currUserQuest = (
        await ctx.db
          .select()
          .from(userQuests)
          .where(
            and(
              eq(userQuests.id, input.userQuestId),
              eq(userQuests.userId, ctx.session.user.id),
            ),
          )
      )[0];

      if (!currUserQuest) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `User Quest with id ${input.userQuestId} was not found`,
        });
      }

      const currQuest = (
        await ctx.db
          .select()
          .from(quests)
          .where(eq(quests.id, currUserQuest.questId))
      )[0];

      if (!currQuest) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Quest associated with user quest ${input.userQuestId} was not found`,
        });
      }

      // Validate that user can claim this quest
      if (currUserQuest.claimed) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Quest reward already claimed",
        });
      }

      if (currUserQuest.count < currQuest.goal) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User has not yet met criteria to claim quest reward",
        });
      }

      const currProfile = (
        await ctx.db
          .select()
          .from(profiles)
          .where(eq(profiles.userId, ctx.session.user.id))
      )[0];

      if (!currProfile) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: `Profile for user with userId ${ctx.session.user.id} was not found`,
        });
      }

      try {
        await ctx.db.transaction(async (tx) => {
          await tx
            .update(userQuests)
            .set({ claimed: true })
            .where(
              and(
                eq(userQuests.id, input.userQuestId),
                eq(userQuests.userId, ctx.session.user.id),
              ),
            );

          await tx
            .update(profiles)
            .set({ balance: currProfile.balance + currQuest.reward });
        });
        return { message: "Quest reward claimed successfully" };
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong trying to claim quest reward",
        });
      }
    }),
});

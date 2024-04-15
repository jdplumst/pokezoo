import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";
import {
  achievementTypes,
  achievements,
  attributes,
  profiles,
  regions,
  userAchievements,
} from "../../db/schema";
import { and, eq } from "drizzle-orm";
import { calcNewYield } from "@/src/utils/calcNewYield";

export const achievementRouter = router({
  getAchievements: protectedProcedure.query(async ({ ctx }) => {
    const achievementsData = await ctx.db
      .select({
        id: achievements.id,
        description: achievements.description,
        tier: achievements.tier,
        yield: achievements.yield,
        type: achievementTypes.name,
        attribute: attributes.name,
        region: regions.name,
        shiny: achievements.shiny,
        generation: achievements.generation,
      })
      .from(achievements)
      .innerJoin(achievementTypes, eq(achievements.typeId, achievementTypes.id))
      .innerJoin(attributes, eq(achievements.attributeId, attributes.id))
      .innerJoin(regions, eq(achievements.regionId, regions.id));
    return { achievements: achievementsData };
  }),

  claimAchievement: protectedProcedure
    .input(z.object({ achievementId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const currUser = (
        await ctx.db
          .select({ totalYield: profiles.totalYield })
          .from(profiles)
          .where(eq(profiles.userId, ctx.session.user.id))
      )[0];

      if (!currUser) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Not authorized to make this request",
        });
      }

      const achievementData = (
        await ctx.db
          .select()
          .from(achievements)
          .where(eq(achievements.id, input.achievementId))
      )[0];

      if (!achievementData) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Achievement does not exist",
        });
      }

      const exists = (
        await ctx.db
          .select()
          .from(userAchievements)
          .where(
            and(
              eq(userAchievements.userId, ctx.session.user.id),
              eq(userAchievements.achievementId, input.achievementId),
            ),
          )
      )[0];

      if (exists) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "You have already claimed this achievement.",
        });
      }

      const newYield = calcNewYield(currUser.totalYield, achievementData.yield);

      await ctx.db.transaction(async (tx) => {
        await tx
          .update(profiles)
          .set({ totalYield: newYield })
          .where(eq(profiles.userId, ctx.session.user.id));

        await tx.insert(userAchievements).values({
          userId: ctx.session.user.id,
          achievementId: input.achievementId,
        });
      });

      return { message: "Achievement claimed successfully" };
    }),
});

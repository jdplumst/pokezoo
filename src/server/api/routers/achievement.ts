import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";

export const achievementRouter = router({
  getAchievements: protectedProcedure.query(async ({ ctx }) => {
    const achievements = await ctx.prisma.achievement.findMany();
    return { achievements: achievements };
  }),

  claimAchievement: protectedProcedure
    .input(z.object({ userId: z.string(), achievementId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const currUser = await ctx.prisma.user.findUnique({
        where: { id: ctx.session.user.id },
        select: { totalYield: true, id: true }
      });
      if (!currUser || currUser.id !== input.userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Not authorized to make this request"
        });
      }

      const achievement = await ctx.prisma.achievement.findFirst({
        where: { id: input.achievementId }
      });
      if (!achievement) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Achievement does not exist"
        });
      }

      const exists = await ctx.prisma.userAchievement.findFirst({
        where: { userId: input.userId, achievementId: input.achievementId }
      });
      if (exists) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You have already claimed this achievement."
        });
      }

      const user = await ctx.prisma.user.update({
        where: { id: input.userId },
        data: { totalYield: currUser.totalYield + achievement.yield }
      });
      const userAchievement = await ctx.prisma.userAchievement.create({
        data: { userId: input.userId, achievementId: input.achievementId }
      });
      return userAchievement;
    })
});

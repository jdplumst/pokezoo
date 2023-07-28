import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const userAchievementRouter = router({
  getUserAchievements: protectedProcedure.query(async ({ ctx }) => {
    const userAchievements = await ctx.prisma.userAchievement.findMany({
      where: { userId: ctx.session.user.id.toString() }
    });
    return { userAchievements: userAchievements };
  })
});

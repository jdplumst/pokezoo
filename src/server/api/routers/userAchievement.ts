import { eq } from "drizzle-orm";
import { userAchievement } from "../../db/schema";
import { protectedProcedure, router } from "../trpc";

export const userAchievementRouter = router({
  getUserAchievements: protectedProcedure.query(async ({ ctx }) => {
    const userAchievements = await ctx.db
      .select()
      .from(userAchievement)
      .where(eq(userAchievement.userId, ctx.session.user.id));
    return { userAchievements: userAchievements };
  })
});

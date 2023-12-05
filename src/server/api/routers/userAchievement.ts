import { eq } from "drizzle-orm";
import { userAchievements } from "../../db/schema";
import { protectedProcedure, router } from "../trpc";

export const userAchievementRouter = router({
  getUserAchievements: protectedProcedure.query(async ({ ctx }) => {
    const userAchievementsData = await ctx.db
      .select()
      .from(userAchievements)
      .where(eq(userAchievements.userId, ctx.session.user.id));
    return { userAchievements: userAchievementsData };
  })
});

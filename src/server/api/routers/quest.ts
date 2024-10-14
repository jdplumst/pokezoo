import { eq } from "drizzle-orm";
import { quests, userQuests } from "../../db/schema";
import { protectedProcedure, router } from "../trpc";

export const questRouter = router({
  getUserQuests: protectedProcedure.query(async ({ ctx }) => {
    const currUserQuests = await ctx.db
      .select()
      .from(userQuests)
      .leftJoin(quests, eq(userQuests.questId, quests.id))
      .where(eq(userQuests.userId, ctx.session.user.id));

    return currUserQuests;
  }),
});

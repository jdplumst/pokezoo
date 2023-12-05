import { protectedProcedure, router } from "../trpc";
import { balls } from "../../db/schema";

export const ballRouter = router({
  getBalls: protectedProcedure.query(async ({ ctx }) => {
    const ballsData = await ctx.db.select().from(balls);
    return { balls: ballsData };
  })
});

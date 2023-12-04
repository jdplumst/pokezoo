import { protectedProcedure, router } from "../trpc";
import { ball } from "../../db/schema";

export const ballRouter = router({
  getBalls: protectedProcedure.query(async ({ ctx }) => {
    const balls = await ctx.db.select().from(ball);
    return { balls: balls };
  })
});

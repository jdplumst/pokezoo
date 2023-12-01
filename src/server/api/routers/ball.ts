import { protectedProcedure, router } from "../trpc";
import { ball } from "../../db/schema";

export const ballRouter = router({
  getBalls: protectedProcedure.query(async ({ ctx }) => {
    const balls = await ctx.db.select().from(ball);
    // const balls = await ctx.prisma.ball.findMany();
    return { balls: balls };
  })
});

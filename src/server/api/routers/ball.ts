import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const ballRouter = router({
  getBalls: protectedProcedure.query(async ({ ctx }) => {
    const balls = await ctx.prisma.ball.findMany();
    return { balls: balls };
  })
});

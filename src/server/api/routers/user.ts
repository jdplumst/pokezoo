import { protectedProcedure, router } from "../trpc";

export const userRouter = router({
  claimDaily: protectedProcedure.mutation(async ({ ctx }) => {
    const currUser = await ctx.prisma.user.findFirst({
      where: { id: ctx.session.user.id },
      select: { balance: true, claimedDaily: true, totalYield: true }
    });
    if (!currUser) {
      throw new Error("Not authorized to make this request");
    }
    if (currUser.claimedDaily) {
      throw new Error("Daily reward already claimed");
    }
    let reward = 25;
    if (currUser.totalYield >= 10000) {
      reward = 1000;
    } else if (currUser.totalYield >= 1000) {
      reward = 100;
    }
    const user = await ctx.prisma.user.update({
      where: { id: ctx.session.user.id },
      data: { balance: currUser.balance + reward, claimedDaily: true }
    });
    return {
      user: user
    };
  })
});

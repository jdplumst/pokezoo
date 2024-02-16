import { charms } from "../../db/schema";
import { protectedProcedure, router } from "../trpc";

export const charmRouter = router({
  getCharms: protectedProcedure.query(async ({ ctx }) => {
    const charmsData = await ctx.db.select().from(charms);
    return { charms: charmsData };
  })
});

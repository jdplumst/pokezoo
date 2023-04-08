import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../trpc";

export const helloRouter = router({
  sayHello: protectedProcedure
    .input(
      z.object({
        text: z.string()
      })
    )
    .query(({ input }) => {
      return {
        greeting: `hello ${input.text}`
      };
    })
});

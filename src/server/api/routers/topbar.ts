import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { getProfileForTopbar } from "~/server/repositories/profile";
import { TRPCError } from "@trpc/server";
import { ERROR_MESSAGES } from "~/lib/errors";

export const topbarRouter = createTRPCRouter({
  getTopbarData: protectedProcedure.query(async () => {
    try {
      const profile = await getProfileForTopbar();
      if (profile === null) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: ERROR_MESSAGES.PROFILE.NOT_FOUND,
        });
      }

      return {
        profile,
      };
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: ERROR_MESSAGES.COMMON.INTERNAL_SERVER_ERROR,
      });
    }
  }),
});

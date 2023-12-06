import * as trpcNext from "@trpc/server/adapters/next";
import { appRouter } from "../../../server/api/_app";
import { createTRPCContext } from "@/src/server/api/trpc";
import { env } from "@/src/env";

// export API handler
// @see https://trpc.io/docs/api-handler
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: createTRPCContext,
  onError:
    env.NODE_ENV === "development"
      ? ({ path, error }) => {
          console.error(
            `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`
          );
        }
      : undefined
});

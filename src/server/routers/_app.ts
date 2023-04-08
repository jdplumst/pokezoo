import { router } from "../trpc";
import { helloRouter } from "./hello";

// Primary Router
// All routers in routers folder should be added here

export const appRouter = router({
  hello: helloRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;

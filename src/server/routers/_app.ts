import { router } from "../trpc";
import { helloRouter } from "./hello";
import { instanceRouter } from "./instance";
import { userRouter } from "./user";

// Primary Router
// All routers in routers folder should be added here

export const appRouter = router({
  hello: helloRouter,
  instance: instanceRouter,
  user: userRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;

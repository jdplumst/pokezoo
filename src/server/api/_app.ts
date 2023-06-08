import { router } from "./trpc";
import { instanceRouter } from "./routers/instance";
import { userRouter } from "./routers/user";
import { achievementRouter } from "./routers/achievement";

// Primary Router
// All routers in routers folder should be added here

export const appRouter = router({
  instance: instanceRouter,
  user: userRouter,
  achievement: achievementRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;

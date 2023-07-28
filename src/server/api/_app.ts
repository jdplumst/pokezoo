import { router } from "./trpc";
import { instanceRouter } from "./routers/instance";
import { userRouter } from "./routers/user";
import { achievementRouter } from "./routers/achievement";
import { speciesRouter } from "./routers/species";
import { userAchievementRouter } from "./routers/userAchievement";

// Primary Router
// All routers in routers folder should be added here

export const appRouter = router({
  instance: instanceRouter,
  species: speciesRouter,
  user: userRouter,
  achievement: achievementRouter,
  userAchievement: userAchievementRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;

import { router } from "./trpc";
import { instanceRouter } from "./routers/instance";
import { profileRouter } from "./routers/profile";
import { achievementRouter } from "./routers/achievement";
import { speciesRouter } from "./routers/species";
import { userAchievementRouter } from "./routers/userAchievement";
import { ballRouter } from "./routers/ball";
import { tradeRouter } from "./routers/trade";

// Primary Router
// All routers in routers folder should be added here

export const appRouter = router({
  instance: instanceRouter,
  species: speciesRouter,
  profile: profileRouter,
  achievement: achievementRouter,
  userAchievement: userAchievementRouter,
  ball: ballRouter,
  trade: tradeRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;

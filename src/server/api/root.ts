import { gameRouter } from "~/server/api/routers/game";
import { pokedexRouter } from "~/server/api/routers/pokedex";
import { tradesRouter } from "~/server/api/routers/trades";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { topbarRouter } from "~/server/api/routers/topbar";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  topbar: topbarRouter,
  game: gameRouter,
  pokedex: pokedexRouter,
  trades: tradesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);

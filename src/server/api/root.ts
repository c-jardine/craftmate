import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

import { materialRouter } from "~/server/api/routers/material";
import { quantityUnitRouter } from "./routers/quantity-unit";
import { recipeRouter } from "./routers/recipe";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  quantityUnit: quantityUnitRouter,
  material: materialRouter,
  recipe: recipeRouter,
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

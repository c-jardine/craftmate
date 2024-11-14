import { createTRPCRouter, protectedProcedure } from "../trpc";

export const quantityUnitsRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.quantityUnit.findMany({
      orderBy: {
        group: "asc",
      },
    });
  }),
});

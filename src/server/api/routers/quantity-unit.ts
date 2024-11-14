import { createTRPCRouter, protectedProcedure } from "../trpc";

export const quantityUnitRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.quantityUnit.findMany({
      orderBy: {
        group: "asc",
      },
    });
  }),
});

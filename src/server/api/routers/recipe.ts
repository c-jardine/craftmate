import { createRecipeFormSchema } from "~/features/recipes/types";
import { db } from "~/server/db";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const recipeRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createRecipeFormSchema)
    .mutation(
      async ({
        ctx,
        input: { materials, batchSizeUnit, categories, ...rest },
      }) =>
        db.recipe.create({
          data: {
            ...rest,
            materials: {
              create: materials.map(({ material, quantity }) => {
                return {
                  ...(material && {
                    material: {
                      connect: {
                        id: material.value.id,
                      },
                    },
                    quantity,
                    quantityUnit: {
                      connect: {
                        id: material.value.quantityUnitId,
                      },
                    },
                  }),
                };
              }),
            },
            batchSizeUnit: {
              connect: {
                name: batchSizeUnit.value,
              },
            },
            ...(categories && {
              categories: {
                connectOrCreate: categories.map((category) => ({
                  where: { id: category.value },
                  create: { name: category.label },
                })),
              },
            }),
            createdBy: { connect: { id: ctx.session.user.id } },
            updatedBy: { connect: { id: ctx.session.user.id } },
          },
        })
    ),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    const recipes = await ctx.db.recipe.findMany({
      orderBy: { name: "asc" },
      include: {
        materials: true,
        batchSizeUnit: true,
        categories: true,
      },
    });

    return recipes ?? null;
  }),

  getCategories: protectedProcedure.query(async ({ ctx }) => {
    const categories = await ctx.db.recipeCategory.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return categories ?? null;
  }),
});

import { Prisma } from "@prisma/client";
import {
  createRecipeFormSchema,
  deleteRecipeSchema,
} from "~/features/recipes/types";
import { db } from "~/server/db";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const recipeRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createRecipeFormSchema)
    .mutation(
      async ({
        ctx,
        input: { materials, batchSizeUnit, categories, ...rest },
      }) => {
        const totalCost = materials.reduce((acc, recipeMaterial) => {
          const quantity = new Prisma.Decimal(recipeMaterial.quantity);
          const costPerUnit = recipeMaterial.material.value.cost ?? 0;
          const totalMaterialCost = quantity.times(costPerUnit);
          return acc.plus(totalMaterialCost);
        }, new Prisma.Decimal(0));

        const costPerUnit = totalCost.div(rest.batchSize);
        return db.recipe.create({
          data: {
            ...rest,
            costPerUnit,
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
        });
      }
    ),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    const recipes = await ctx.db.recipe.findMany({
      orderBy: { name: "asc" },
      include: {
        materials: {
          include: {
            material: true,
            quantityUnit: true,
          },
        },
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

  deleteById: protectedProcedure
    .input(deleteRecipeSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.recipe.delete({
        where: {
          id: input.id,
        },
      });
    }),
});

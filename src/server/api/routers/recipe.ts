import {
  createRecipeFormSchema,
  deleteRecipeSchema,
  updateRecipeFormSchema,
} from "~/features/recipes/types";
import { db } from "~/server/db";
import { calculateMargin } from "~/utils/math";
import { toDecimal } from "~/utils/prisma";
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
          const quantity = toDecimal(recipeMaterial.quantity);
          const costPerUnit = recipeMaterial.material.value.cost ?? 0;
          const totalMaterialCost = quantity.times(costPerUnit);
          return acc.plus(totalMaterialCost);
        }, toDecimal(0));

        const costPerUnit = totalCost.div(rest.batchSize);

        const retailMargin =
          rest.retailPrice && costPerUnit
            ? calculateMargin({
                revenue: toDecimal(rest.retailPrice),
                costOfGoods: costPerUnit,
              })
            : null;

        const wholesaleMargin =
          rest.wholesalePrice && costPerUnit
            ? calculateMargin({
                revenue: toDecimal(rest.wholesalePrice),
                costOfGoods: costPerUnit,
              })
            : null;

        return db.recipe.create({
          data: {
            ...rest,
            costPerUnit,
            retailMargin,
            wholesaleMargin,
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

  update: protectedProcedure
    .input(updateRecipeFormSchema)
    .mutation(
      async ({
        ctx,
        input: { id, materials, batchSizeUnit, categories, ...rest },
      }) => {
        const totalCost = materials.reduce((acc, recipeMaterial) => {
          const quantity = toDecimal(recipeMaterial.quantity);
          const costPerUnit = recipeMaterial.material.value.cost ?? 0;
          const totalMaterialCost = quantity.times(costPerUnit);
          return acc.plus(totalMaterialCost);
        }, toDecimal(0));

        const costPerUnit = totalCost.div(rest.batchSize);

        const retailMargin =
          rest.retailPrice && costPerUnit
            ? calculateMargin({
                revenue: toDecimal(rest.retailPrice),
                costOfGoods: costPerUnit,
              })
            : null;

        const wholesaleMargin =
          rest.wholesalePrice && costPerUnit
            ? calculateMargin({
                revenue: toDecimal(rest.wholesalePrice),
                costOfGoods: costPerUnit,
              })
            : null;

        const updatedRecipe = await db.$transaction(async (tsx) => {
          await tsx.recipeMaterial.deleteMany({
            where: {
              recipeId: id,
            },
          });

          return await tsx.recipe.update({
            where: {
              id,
            },
            data: {
              ...rest,
              costPerUnit,
              retailMargin,
              wholesaleMargin,
              materials: {
                set: [],
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
                  set: [],
                  connectOrCreate: categories.map((category) => ({
                    where: { id: category.value },
                    create: { name: category.label },
                  })),
                },
              }),
              updatedBy: { connect: { id: ctx.session.user.id } },
            },
          });
        });

        return updatedRecipe;
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

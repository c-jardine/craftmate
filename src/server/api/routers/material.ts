import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
  createMaterialFormSchema,
  updateMaterialStockFormSchema,
} from "~/types/material";

export const materialRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createMaterialFormSchema)
    .mutation(async ({ ctx, input: { vendor, categories, ...rest } }) => {
      return ctx.db.material.create({
        data: {
          ...rest,
          ...(vendor && {
            vendor: {
              connectOrCreate: {
                where: {
                  id: vendor.label,
                },
                create: {
                  name: vendor.label,
                },
              },
            },
          }),
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
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    const materials = await ctx.db.material.findMany({
      orderBy: { name: "asc" },
      include: {
        vendor: true,
        categories: true,
      },
    });

    return materials ?? null;
  }),

  updateStock: protectedProcedure
    .input(updateMaterialStockFormSchema)
    .mutation(
      async ({
        ctx,
        input: { materialId, type, newStockLevel, previousStockLevel, notes },
      }) => {
        const stockLog = await ctx.db.$transaction([
          ctx.db.material.update({
            where: {
              id: materialId,
            },
            data: {
              stockLevel: newStockLevel,
              updatedBy: {
                connect: {
                  id: ctx.session.user.id,
                },
              },
            },
          }),
          ctx.db.materialStockUpdateLog.create({
            data: {
              previousStockLevel,
              newStockLevel,
              type: {
                connect: {
                  id: type.value,
                },
              },
              notes,
              createdBy: {
                connect: {
                  id: ctx.session.user.id,
                },
              },
              material: {
                connect: {
                  id: materialId,
                },
              },
            },
          }),
        ]);

        return stockLog ?? null;
      }
    ),

  deleteAll: protectedProcedure
    .input(z.string().array())
    .mutation(async ({ ctx, input }) => {
      return ctx.db.material.deleteMany({
        where: {
          id: {
            in: input,
          },
        },
      });
    }),

  getVendors: protectedProcedure.query(async ({ ctx }) => {
    const vendors = await ctx.db.vendor.findMany({
      orderBy: { name: "asc" },
    });

    return vendors ?? null;
  }),

  getCategories: protectedProcedure.query(async ({ ctx }) => {
    const categories = await ctx.db.materialCategory.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return categories ?? null;
  }),

  getStockUpdateTypes: protectedProcedure.query(async ({ ctx }) => {
    const updateTypes = await ctx.db.materialStockUpdateType.findMany({
      orderBy: {
        type: "asc",
      },
    });

    return updateTypes ?? null;
  }),

  getLatest: protectedProcedure.query(async ({ ctx }) => {
    const material = await ctx.db.material.findFirst({
      orderBy: { createdAt: "desc" },
      where: { createdBy: { id: ctx.session.user.id } },
    });

    return material ?? null;
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});

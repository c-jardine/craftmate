import type { Material, QuantityUnit } from "@prisma/client";
import { z } from "zod";
import { CustomZod } from "~/utils/zod";

export const createRecipeFormSchema = z.object({
  name: z.string().min(1, "Required"),
  sku: z.string().optional(),
  upc: z.string().optional(),
  retailPrice: CustomZod.PRISMA_POSITIVE_DECIMAL.optional(),
  wholesalePrice: CustomZod.PRISMA_POSITIVE_DECIMAL.optional(),
  materials: z
    .object({
      material: z.object({
        label: z.string(),
        value: z.custom<Material & { quantityUnit: QuantityUnit }>(),
      }),
      quantity: CustomZod.PRISMA_POSITIVE_DECIMAL,
    })
    .array(),
  batchSize: CustomZod.PRISMA_POSITIVE_DECIMAL,
  batchSizeUnit: z.object({
    label: z.string(),
    value: z.string(),
  }),
  categories: z
    .object({
      label: z.string(),
      value: z.string(),
    })
    .array(),
  notes: z.string().optional(),
});

export type CreateRecipeFormType = z.infer<typeof createRecipeFormSchema>;

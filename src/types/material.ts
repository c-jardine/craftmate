import { MaterialQuantityUpdateAction } from "@prisma/client";
import { z } from "zod";

import { CustomZod } from "~/utils";

export const createMaterialFormSchema = z.object({
  name: z.string().min(1, "Required"),
  url: CustomZod.OPTIONAL_URL,
  sku: z.string().optional(),
  cost: z.number().min(0).optional(),
  quantity: z.string().optional(),
  quantityUnit: z.string().optional(),
  minQuantity: z.string().optional(),
  notes: z.string().optional(),
  vendor: z
    .object({
      label: z.string(),
      value: z.string(),
    })
    .optional(),
  categories: z
    .object({
      label: z.string(),
      value: z.string(),
    })
    .array(),
});

export type CreateMaterialFormType = z.infer<typeof createMaterialFormSchema>;

export const updateMaterialFormSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Required"),
  url: CustomZod.OPTIONAL_URL,
  sku: z.string().optional(),
  cost: z.number().optional(),
  quantity: z.number().optional(),
  quantityUnit: z.string().optional(),
  minQuantity: z.number().optional(),
  notes: z.string().optional(),
  vendor: z
    .object({
      label: z.string(),
      value: z.string(),
    })
    .optional(),
  categories: z
    .object({
      label: z.string(),
      value: z.string(),
    })
    .array(),
});

export type UpdateMaterialFormType = z.infer<typeof updateMaterialFormSchema>;

export const updateMaterialQuantityFormSchema = z.object({
  materialId: z.string(),
  type: z.object({
    label: z.string(),
    value: z.object({
      id: z.string(),
      type: z.string(),
      action: z.nativeEnum(MaterialQuantityUpdateAction),
    }),
  }),
  originalQuantity: z.string(),
  adjustedQuantity: z.string(),
  notes: z.string().optional(),
});

export type UpdateMaterialQuantityFormType = z.infer<
  typeof updateMaterialQuantityFormSchema
>;

export const newQuantityAdjustmentActionSchema = z.object({
  name: z.string(),
  color: z.string(),
  adjustmentAction: z.nativeEnum(MaterialQuantityUpdateAction),
});

export type NewQuantityAdjustmentActionFormType = z.infer<
  typeof newQuantityAdjustmentActionSchema
>;

export const updateCategoriesFormSchema = z.object({
  categories: z.object({ id: z.string(), name: z.string() }).array(),
});

export type UpdateCategoriesFormType = z.infer<
  typeof updateCategoriesFormSchema
>;

export const deleteCategoryByNameSchema = z.object({
  name: z.string(),
});

export type DeleteCategoryByIdType = z.infer<typeof deleteCategoryByNameSchema>;

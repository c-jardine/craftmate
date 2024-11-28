import { useDisclosure, useToast } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";

import { type CustomCellRendererProps } from "ag-grid-react";

import { api } from "~/utils/api";
import { mapToSelectInput } from "~/utils/form";
import { type RecipesRowDataType } from "../components/recipes-table";
import { updateRecipeFormSchema, type UpdateRecipeFormType } from "../types";

export function useUpdateRecipe(
  props: CustomCellRendererProps<RecipesRowDataType>["data"]
) {
  const disclosure = useDisclosure();
  const toast = useToast();
  const utils = api.useUtils();

  // Form
  const form = useForm<UpdateRecipeFormType>({
    resolver: zodResolver(updateRecipeFormSchema),
  });
  const fieldArray = useFieldArray({
    control: form.control,
    name: "materials",
  });

  const { reset } = form;

  const initializeForm = useCallback(
    ({
      id,
      name,
      sku,
      retailPrice,
      wholesalePrice,
      batchSize,
      batchSizeUnit,
      materials,
      categories,
      notes,
    }: RecipesRowDataType) => {
      reset({
        id,
        name,
        sku: sku ?? undefined,
        retailPrice: retailPrice?.toString(),
        wholesalePrice: wholesalePrice?.toString(),
        batchSize: batchSize?.toString(),
        batchSizeUnit: { label: batchSizeUnit.name, value: batchSizeUnit.name },
        materials: materials.map(({ quantity, material }) => ({
          material: {
            label: material.name,
            value: material,
          },
          quantity: quantity.toString(),
        })),
        categories: categories?.map(mapToSelectInput),
        notes: notes ?? undefined,
      });
    },
    [reset]
  );

  useEffect(() => {
    if (props) {
      initializeForm(props);
    }
  }, [initializeForm, props]);

  const mutation = api.recipe.update.useMutation({
    onSuccess: async (data) => {
      toast({
        title: "Recipe updated",
        description: `${data.name} has been updated!`,
        status: "success",
      });
      disclosure.onClose();
      form.reset();
      await utils.recipe.getAll.invalidate();
    },
    onError: (error) => {
      toast({
        title: "Error updating recipe",
        description: error.message,
        status: "error",
      });
    },
  });

  async function onSubmit(data: UpdateRecipeFormType) {
    return await mutation.mutateAsync(data);
  }

  return {
    form,
    fieldArray,
    onSubmit,
    disclosure,
  };
}

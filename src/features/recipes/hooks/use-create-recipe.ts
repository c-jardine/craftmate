import { useDisclosure, useToast } from "@chakra-ui/react";
import { useFieldArray, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "~/utils/api";
import { createRecipeFormSchema, type CreateRecipeFormType } from "../types";

export function useCreateRecipe() {
  const disclosure = useDisclosure();
  const toast = useToast();
  const utils = api.useUtils();

  // Form
  const form = useForm<CreateRecipeFormType>({
    defaultValues: {
      materials: [
        {
          material: undefined,
          quantity: undefined,
        },
      ],
    },
    resolver: zodResolver(createRecipeFormSchema),
  });
  const fieldArray = useFieldArray({
    control: form.control,
    name: "materials",
  });

  const mutation = api.recipe.create.useMutation({
    onSuccess: async (data) => {
      toast({
        title: "Recipe created",
        description: `${data.name} has been created!`,
        status: "success",
      });
      disclosure.onClose();
      form.reset();
      await utils.recipe.getAll.invalidate();
      await utils.recipe.getCategories.invalidate();
    },
    onError: (error) => {
      toast({
        title: "Error creating recipe",
        description: error.message,
        status: "error",
      });
    },
  });

  async function onSubmit(data: CreateRecipeFormType) {
    return await mutation.mutateAsync(data);
  }

  return {
    form,
    fieldArray,
    onSubmit,
    disclosure,
  };
}

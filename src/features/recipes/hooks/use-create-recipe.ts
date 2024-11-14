import { useDisclosure, useToast } from "@chakra-ui/react";
import { useForm } from "react-hook-form";

import { api } from "~/utils/api";
import { type CreateRecipeFormType } from "../types";

export function useCreateRecipe() {
  const disclosure = useDisclosure();
  const toast = useToast();
  const utils = api.useUtils();

  // Form
  const form = useForm<CreateRecipeFormType>();

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
      // await utils.recipe.getCategories.invalidate();
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
    await mutation.mutateAsync(data);
  }

  return {
    form,
    onSubmit,
    disclosure,
  };
}

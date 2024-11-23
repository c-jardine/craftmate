import { useToast } from "@chakra-ui/react";
import { api } from "~/utils/api";

export function useDeleteRecipes() {
  const toast = useToast();

  const utils = api.useUtils();
  const deleteMutation = api.recipe.deleteAll.useMutation({
    onSuccess: async ({ count }) => {
      toast({
        title: "Deleted recipes",
        description: `Deleted ${count} recipes.`,
        status: "success",
      });
      await utils.recipe.getAll.invalidate();
    },
  });

  function onDelete(data: string[]) {
    deleteMutation.mutate(data);
  }

  return { onDelete };
}

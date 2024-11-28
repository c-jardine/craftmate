import { useToast } from "@chakra-ui/react";

import { api } from "~/utils/api";

/**
 * Hook for bulk deletion of recipes.
 */
export function useDeleteRecipes() {
  // Toasts for UI notifications.
  const toast = useToast();

  // API utilities and mutation.
  const utils = api.useUtils();
  const mutation = api.recipe.deleteAll.useMutation({
    onSuccess: async ({ count }) => {
      toast({
        title: "Deleted recipes",
        description: `Deleted ${count} recipes.`,
        status: "success",
      });

      // Invalidate cached queries.
      await utils.recipe.getAll.invalidate();
    },
  });

  // Handle deletion of recipes.
  function onDelete(data: string[]) {
    mutation.mutate(data);
  }

  return { onDelete };
}

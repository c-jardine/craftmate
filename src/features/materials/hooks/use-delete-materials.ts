import { useToast } from "@chakra-ui/react";

import { api } from "~/utils/api";

/**
 * Hook for bulk deletion of materials.
 */
export function useDeleteMaterials() {
  // Toasts for UI notifications.
  const toast = useToast();

  // API utilities and mutation.
  const utils = api.useUtils();
  const mutation = api.material.deleteAll.useMutation({
    onSuccess: async ({ count }) => {
      toast({
        title: "Deleted materials.",
        description: `Deleted ${count} materials`,
        status: "success",
      });

      // Invalidate cached queries.
      await utils.material.getAll.invalidate();
    },
  });

  // Handle deletion of materials.
  function onDelete(data: string[]) {
    mutation.mutate(data);
  }

  return { onDelete };
}

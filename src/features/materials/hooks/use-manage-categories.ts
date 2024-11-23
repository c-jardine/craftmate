import { useDisclosure, useToast } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";

import {
  updateCategoriesFormSchema,
  type UpdateCategoriesFormType,
} from "~/types/material";
import { api } from "~/utils/api";
import { useMaterialCategoriesOptions } from "./use-material-categories-options";

/**
 * Hook containing logic for managing categories.
 */
export function useManageCategories() {
  // Form initialization.
  const form = useForm<UpdateCategoriesFormType>({
    defaultValues: {
      categories: [{ id: "", name: "" }],
    },
    resolver: zodResolver(updateCategoriesFormSchema),
  });

  const { control, reset } = form;

  const fieldArray = useFieldArray({
    control: control,
    name: "categories",
  });

  // Get existing categories data.
  const {
    query: { data },
  } = useMaterialCategoriesOptions();

  // Helper to initialize the form with the fetched data.
  const initializeForm = useCallback(
    (data: UpdateCategoriesFormType) => {
      reset(data);
    },
    [reset]
  );

  useEffect(() => {
    if (data) {
      initializeForm({ categories: data });
    }
  }, [data, initializeForm]);

  // Toasts for UI notifications.
  const toast = useToast();

  // Disclosure for managing the modal state.
  const disclosure = useDisclosure({
    onOpen: () => {
      if (data) {
        initializeForm({ categories: data });
      }
    },
  });

  // API utilities and mutation.
  const utils = api.useUtils();
  const mutation = api.material.updateCategories.useMutation({
    onSuccess: async () => {
      toast({
        title: "Updated categories",
        description: "Successfully updated categories.",
        status: "success",
      });

      // Invalidate cached data.
      await utils.material.getAll.invalidate();
      await utils.material.getCategories.invalidate();

      disclosure.onClose();
    },
  });

  // Handle form submission.
  async function onSubmit(data: UpdateCategoriesFormType) {
    return await mutation.mutateAsync(data);
  }

  return { form, fieldArray, onSubmit, disclosure };
}

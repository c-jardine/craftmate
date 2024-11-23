import { useDisclosure, useToast } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";

import {
  updateVendorsFormSchema,
  type UpdateVendorsFormType,
} from "~/types/material";
import { api } from "~/utils/api";
import { useMaterialVendorsOptions } from "./use-material-vendors-options";

/**
 * Custom hook containing logic for managing vendors.
 */
export function useManageVendors() {
  // Form initialization
  const form = useForm<UpdateVendorsFormType>({
    defaultValues: {
      vendors: [{ id: "", name: "" }],
    },
    resolver: zodResolver(updateVendorsFormSchema),
  });

  const { control, reset } = form;

  const fieldArray = useFieldArray({
    control: control,
    name: "vendors",
  });

  // Get existing vendors data.
  const {
    query: { data },
  } = useMaterialVendorsOptions();

  // Helper to initialize the form with the fetched data.
  const initializeForm = useCallback(
    (data: UpdateVendorsFormType) => {
      reset(data);
    },
    [reset]
  );

  useEffect(() => {
    if (data) {
      initializeForm({ vendors: data });
    }
  }, [data, initializeForm]);

  // Toasts for UI notifications.
  const toast = useToast();

  // Disclosure for managing the modal state.
  const disclosure = useDisclosure({
    onOpen: () => {
      if (data) {
        initializeForm({ vendors: data });
      }
    },
  });

  // API utilities and mutation.
  const utils = api.useUtils();
  const mutation = api.material.updateVendors.useMutation({
    onSuccess: async () => {
      toast({
        title: "Updated vendors",
        description: "Successfully updated vendors.",
        status: "success",
      });

      // Invalidate cached data.
      await utils.material.getAll.invalidate();
      await utils.material.getVendors.invalidate();

      disclosure.onClose();
    },
  });

  // Handle form submission.
  async function onSubmit(data: UpdateVendorsFormType) {
    return await mutation.mutateAsync(data);
  }

  return { form, fieldArray, onSubmit, disclosure };
}

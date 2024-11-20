import { useToast } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";

import {
  updateMaterialQuantityFormSchema,
  type UpdateMaterialQuantityFormType,
} from "~/types/material";
import { api, RouterOutputs } from "~/utils/api";

export function useUpdateQuantity(
  props: RouterOutputs["material"]["getAll"][0]
) {
  const toast = useToast();
  const utils = api.useUtils();

  const updateTypeQuery = api.material.getQuantityUpdateTypes.useQuery();
  const updateTypeOptions = updateTypeQuery.data?.map(
    ({ id, type, action }) => ({
      label: type,
      value: { id, type, action },
    })
  );

  const mutation = api.material.updateQuantity.useMutation({
    onSuccess: async (data) => {
      toast({
        title: "Quantity updated",
        description: `Successfully updated quantity for ${data[0].name}.`,
        status: "success",
      });
      await utils.material.getAll.invalidate();
    },
  });

  const form = useForm<UpdateMaterialQuantityFormType>({
    defaultValues: {
      materialId: props.id ?? undefined,
      originalQuantity: props.quantity?.toString() ?? "0",
    },
    resolver: zodResolver(updateMaterialQuantityFormSchema),
  });

  const { reset } = form;

  // Form submit handler
  async function onSubmit(data: UpdateMaterialQuantityFormType) {
    await mutation.mutateAsync(data);
  }

  // Initialize form callback
  const initializeForm = useCallback(
    (data: RouterOutputs["material"]["getAll"][0]) => {
      reset({
        materialId: data.id,
        originalQuantity: data.quantity?.toString() ?? "0",
      });
    },
    [reset]
  );

  useEffect(() => {
    if (props) {
      initializeForm(props);
    }
  }, [props, initializeForm]);

  return { form, onSubmit, updateTypeOptions };
}

import { useDisclosure, useToast } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";

import { CustomCellRendererProps } from "ag-grid-react";

import {
  updateMaterialFormSchema,
  UpdateMaterialFormType,
} from "~/types/material";
import { getQuantityUnitText, isTRPCClientError } from "~/utils";
import { api } from "~/utils/api";
import { toNumber } from "~/utils/prisma";
import { mapToSelectInput } from "~/utils/selectInput";
import { MaterialsTableRows } from "../MaterialsTable";

export function useUpdateMaterial(
  props: CustomCellRendererProps<MaterialsTableRows>["data"]
) {
  const toast = useToast();

  const disclosure = useDisclosure();
  const { onClose } = disclosure;

  // Initialize the form
  const form = useForm<UpdateMaterialFormType>({
    resolver: zodResolver(updateMaterialFormSchema),
  });

  const { reset, setFocus, setError } = form;

  // Get vendors
  const { data: vendorsQuery } = api.material.getVendors.useQuery();
  const vendorOptions = vendorsQuery?.map(({ id, name }) => ({
    label: name,
    value: id,
  }));

  // Get categories
  const { data: categoriesQuery } = api.material.getCategories.useQuery();
  const categoryOptions = categoriesQuery?.map(({ id, name }) => ({
    label: name,
    value: id,
  }));

  // Callback to initialize the form when node.data is ready
  const initializeForm = React.useCallback(
    (data: MaterialsTableRows) => {
      const { name, cost, quantity, minQuantity, extraData } = data;
      reset({
        id: extraData.id,
        name,
        url: extraData.url ?? undefined,
        sku: extraData.sku ?? undefined,
        cost: toNumber(cost),
        quantity: toNumber(quantity),
        quantityUnit:
          getQuantityUnitText({
            quantity: quantity,
            quantityUnit: extraData.quantityUnit,
            style: "abbreviation",
          }) ?? "",
        minQuantity: toNumber(minQuantity),
        vendor: extraData.vendor
          ? mapToSelectInput(extraData.vendor)
          : undefined,
        categories: extraData.categories?.map(mapToSelectInput),
        notes: extraData.notes ?? undefined,
      });
    },
    [reset]
  );

  // Initialize the form defaults
  React.useEffect(() => {
    if (props) {
      initializeForm(props);
    }
  }, [initializeForm, props]);

  // Update material mutation
  const utils = api.useUtils();
  const mutation = api.material.update.useMutation({
    onSuccess: async ({ name }) => {
      toast({
        title: `Material updated`,
        description: `Successfully updated ${name}`,
        status: "success",
      });

      await utils.material.getAll.invalidate();
      onClose();
    },
  });

  // Form submit handler
  async function onSubmit(data: UpdateMaterialFormType) {
    try {
      await mutation.mutateAsync(data);
    } catch (error) {
      if (isTRPCClientError(error) && error.data?.code === "CONFLICT") {
        setError("sku", {
          type: "manual",
          message: error.message,
        });
        setFocus("sku");
      }
    }
  }

  return { form, onSubmit, vendorOptions, categoryOptions, disclosure };
}
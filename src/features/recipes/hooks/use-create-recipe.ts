import { useDisclosure, useToast } from "@chakra-ui/react";
import { useForm } from "react-hook-form";

import { api } from "~/utils/api";

export function useCreateRecipe() {
  const disclosure = useDisclosure();
  const toast = useToast();
  const utils = api.useUtils();

  // Form
  const form = useForm();

  const mutation = null;

  function onSubmit(data: unknown) {}

  return {
    form,
    onSubmit,
    disclosure,
  };
}

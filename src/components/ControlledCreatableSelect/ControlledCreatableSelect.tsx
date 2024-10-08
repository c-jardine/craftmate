import { FormControl, FormErrorMessage, FormLabel } from "@chakra-ui/react";
import {
  CreatableSelect,
  type GroupBase,
  type CreatableProps as SelectProps,
} from "chakra-react-select";
import { type ReactNode } from "react";
import {
  useController,
  type FieldValues,
  type UseControllerProps,
} from "react-hook-form";

interface ControlledSelectProps<
  FormValues extends FieldValues = FieldValues,
  Option = unknown,
  IsMulti extends boolean = boolean,
  Group extends GroupBase<Option> = GroupBase<Option>
> extends Omit<SelectProps<Option, IsMulti, Group>, "name" | "defaultValue">,
    UseControllerProps<FormValues> {
  label?: string | ReactNode;
}

/**
 * An attempt to make a reusable chakra-react-select form component
 *
 * @param props - The combined props of the chakra-react-select component and the useController hook
 */
export function ControlledCreatableSelect<
  FormValues extends FieldValues = FieldValues,
  Option = unknown,
  IsMulti extends boolean = boolean,
  Group extends GroupBase<Option> = GroupBase<Option>
>({
  name,
  label,
  options,
  control,
  rules,
  shouldUnregister,
  ...selectProps
}: ControlledSelectProps<FormValues, Option, IsMulti, Group>) {
  const {
    field,
    fieldState: { error },
  } = useController<FormValues>({
    name,
    control,
    rules,
    shouldUnregister,
  });

  return (
    <FormControl id={name} isInvalid={!!error}>
      {label && <FormLabel w="full">{label}</FormLabel>}
      <CreatableSelect<Option, IsMulti, Group>
        options={options}
        chakraStyles={{
          option: (provided) => ({
            ...provided,
            fontSize: "sm",
          }),
          multiValueLabel: (provided) => ({
            ...provided,
            fontSize: "xs",
          }),
        }}
        {...selectProps}
        {...field}
      />
      {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
    </FormControl>
  );
}

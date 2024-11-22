import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Controller } from "react-hook-form";
import { FaDollarSign, FaPlus, FaX } from "react-icons/fa6";
import { NumericFormat } from "react-number-format";

import { ControlledCreatableSelect } from "~/components/controlled-creatable-select";
import { ControlledSelect } from "~/components/controlled-select";
import { TextInput } from "~/components/text-input";
import { useMaterialOptions } from "~/hooks/use-material-options";
import { useQuantityUnitOptions } from "~/hooks/use-quantity-unit-options";
import { type SelectInput } from "~/utils/form";
import { useCreateRecipe } from "../hooks/use-create-recipe";
import { type CreateRecipeFormType } from "../types";
import { useRecipeCategoriesOptions } from "./use-recipe-categories-options";

export function CreateRecipeForm() {
  const {
    form: {
      control,
      register,
      handleSubmit,
      watch,
      formState: { errors, isSubmitting },
    },
    fieldArray: { fields, append, remove },
    onSubmit,
    disclosure: { isOpen, onOpen, onClose },
  } = useCreateRecipe();

  const { quantityUnitOptions } = useQuantityUnitOptions();
  const { materialOptions } = useMaterialOptions();
  const { categoryOptions } = useRecipeCategoriesOptions();

  return (
    <>
      <Button
        display={{ base: "none", md: "flex" }}
        variant="primary"
        leftIcon={<Icon as={FaPlus} />}
        fontSize="sm"
        onClick={onOpen}
      >
        New recipe
      </Button>
      <Drawer size="md" {...{ isOpen, onClose }}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader>New recipe</DrawerHeader>
          <DrawerBody>
            <Stack
              as="form"
              id="create-recipe-form"
              onSubmit={handleSubmit(onSubmit)}
              spacing={4}
            >
              <TextInput
                control={control}
                name="name"
                label="Name"
                isRequired
              />

              <TextInput control={control} name="sku" label="SKU" />

              <SimpleGrid columns={2} gap={4}>
                <FormControl isInvalid={!!errors.retailPrice}>
                  <FormLabel>MSRP</FormLabel>
                  <Controller
                    control={control}
                    name="retailPrice"
                    render={({ field: { value, onChange, onBlur } }) => (
                      <InputGroup>
                        <InputLeftElement pointerEvents="none">
                          <FaDollarSign />
                        </InputLeftElement>
                        <Input
                          variant="input"
                          as={NumericFormat}
                          allowNegative={false}
                          decimalScale={2}
                          thousandSeparator=","
                          value={value}
                          onChange={onChange}
                          onBlur={onBlur}
                        />
                      </InputGroup>
                    )}
                  />
                  {errors.retailPrice && (
                    <FormErrorMessage>
                      {errors.retailPrice.message}
                    </FormErrorMessage>
                  )}
                </FormControl>
                <FormControl isInvalid={!!errors.wholesalePrice}>
                  <FormLabel>Wholesale</FormLabel>
                  <Controller
                    control={control}
                    name="wholesalePrice"
                    render={({ field: { value, onChange, onBlur } }) => (
                      <InputGroup>
                        <InputLeftElement pointerEvents="none">
                          <FaDollarSign />
                        </InputLeftElement>
                        <Input
                          variant="input"
                          as={NumericFormat}
                          allowNegative={false}
                          decimalScale={2}
                          thousandSeparator=","
                          value={value}
                          onChange={onChange}
                          onBlur={onBlur}
                        />
                      </InputGroup>
                    )}
                  />
                  {errors.wholesalePrice && (
                    <FormErrorMessage>
                      {errors.wholesalePrice.message}
                    </FormErrorMessage>
                  )}
                </FormControl>
              </SimpleGrid>

              <SimpleGrid columns={5} gap={4}>
                <TextInput
                  control={control}
                  name="batchSize"
                  label="Batch size"
                  isRequired
                  formControlProps={{ gridColumn: "1 / span 3" }}
                  inputProps={{
                    as: NumericFormat,
                    allowNegative: false,
                    decimalScale: 2,
                    thousandSeparator: ",",
                  }}
                />

                <Box gridColumn="4 / span 2">
                  <ControlledSelect
                    control={control}
                    name="batchSizeUnit"
                    label="Unit"
                    options={quantityUnitOptions}
                    noOptionsMessage={() => <Text>No units found.</Text>}
                  />
                </Box>
              </SimpleGrid>

              <Stack>
                <FormLabel>Materials</FormLabel>
                {fields.map((field, index) => {
                  const units =
                    watch(`materials.${index}`)?.material?.value?.quantityUnit
                      ?.abbrevPlural ?? "units";
                  return (
                    <SimpleGrid
                      key={field.id}
                      gridTemplateColumns="repeat(5, 1fr) auto"
                      gap={4}
                    >
                      <Box gridColumn="1 / span 3">
                        <ControlledSelect
                          control={control}
                          name={`materials.${index}.material`}
                          options={materialOptions}
                          noOptionsMessage={() => (
                            <Text>No materials found.</Text>
                          )}
                        />
                      </Box>

                      <Box gridColumn="4 / span 2">
                        <Controller
                          control={control}
                          name={`materials.${index}.quantity`}
                          render={({ field: { value, onChange, onBlur } }) => (
                            <InputGroup>
                              <Input
                                variant="input"
                                as={NumericFormat}
                                allowNegative={false}
                                decimalScale={2}
                                thousandSeparator=","
                                value={value}
                                onChange={onChange}
                                onBlur={onBlur}
                              />
                              <InputRightElement pointerEvents="none">
                                {units && <Text fontSize="xs">{units}</Text>}
                              </InputRightElement>
                            </InputGroup>
                          )}
                        />
                      </Box>

                      <IconButton
                        icon={<Icon as={FaX} fontSize="2xs" />}
                        aria-label="Remove"
                        size="xs"
                        alignSelf="center"
                        rounded="full"
                        variant="outline"
                        colorScheme={index === 0 ? "blackAlpha" : "red"}
                        isDisabled={index === 0}
                        onClick={() => remove(index)}
                      />
                    </SimpleGrid>
                  );
                })}
                <Button
                  leftIcon={<Icon as={FaPlus} />}
                  onClick={() =>
                    append({
                      // TODO: Fix this...
                      material: undefined,
                      quantity: undefined,
                    })
                  }
                  isDisabled={(() => {
                    const length = watch("materials").length;
                    const lastMaterial = watch("materials")[length - 1];

                    if (lastMaterial) {
                      const { material, quantity } = lastMaterial;
                      if (material?.label && quantity) {
                        return false;
                      }

                      return true;
                    }

                    return true;
                  })()}
                >
                  Add material
                </Button>
              </Stack>

              <ControlledCreatableSelect<
                CreateRecipeFormType,
                SelectInput,
                true
              >
                options={categoryOptions}
                isMulti
                control={control}
                name="categories"
                label="Categories"
                useBasicStyles
              />

              <FormControl isInvalid={!!errors.notes}>
                <FormLabel>Notes</FormLabel>
                <Input {...register("notes")} />
                {errors.notes && (
                  <FormErrorMessage>{errors.notes.message}</FormErrorMessage>
                )}
              </FormControl>
            </Stack>
          </DrawerBody>
          <DrawerFooter gap={4}>
            <Button onClick={onClose} isDisabled={!!isSubmitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              form="create-recipe-form"
              variant="primary"
              isDisabled={!!isSubmitting}
            >
              Create
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}

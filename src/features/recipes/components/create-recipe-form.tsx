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
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Controller } from "react-hook-form";
import { FaDollarSign, FaPlus } from "react-icons/fa6";
import { NumericFormat } from "react-number-format";

import { ControlledCreatableSelect } from "~/components/controlled-creatable-select";
import { ControlledSelect } from "~/components/controlled-select";
import { TextInput } from "~/components/text-input";
import { useQuantityUnitOptions } from "~/hooks/use-quantity-unit-options";
import { type SelectInput } from "~/utils/selectInput";
import { useCreateRecipe } from "../hooks/use-create-recipe";
import { type CreateRecipeFormType } from "../types";
import { useRecipeCategoriesOptions } from "./use-recipe-categories-options";

export function CreateRecipeForm() {
  const {
    form: {
      control,
      register,
      handleSubmit,
      formState: { errors, isSubmitting },
    },
    onSubmit,
    disclosure: { isOpen, onOpen, onClose },
  } = useCreateRecipe();

  const { quantityUnitOptions } = useQuantityUnitOptions();
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

              <SimpleGrid columns={2} gap={4}>
                <TextInput control={control} name="sku" label="UPC" />
                <TextInput control={control} name="upc" label="SKU" />
              </SimpleGrid>

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

import {
  Button,
  HStack,
  Icon,
  IconButton,
  MenuItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ScaleFade,
  Stack,
} from "@chakra-ui/react";
import { FaPlus, FaTag, FaTrash } from "react-icons/fa6";

import { TextInput } from "~/components/text-input";
import { useManageCategories } from "../hooks/use-manage-categories";

export function ManageCategories() {
  const {
    form: {
      control,
      watch,
      handleSubmit,
      formState: { isValid, isDirty, isSubmitting },
    },
    fieldArray: { fields, append, remove },
    onSubmit,
    disclosure: { isOpen, onOpen, onClose },
  } = useManageCategories();

  return (
    <>
      <MenuItem
        icon={<Icon as={FaTag} boxSize={4} />}
        fontSize="sm"
        onClick={onOpen}
      >
        Manage categories
      </MenuItem>

      <Modal {...{ isOpen, onClose }}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Manage categories</ModalHeader>

          <ModalBody maxH={96} overflowY="scroll">
            <Stack
              as="form"
              id="update-categories-form"
              onSubmit={handleSubmit(onSubmit)}
            >
              {fields.map((field, index) => (
                <HStack key={field.id} justifyContent="space-between">
                  <TextInput
                    control={control}
                    name={`categories.${index}.name`}
                  />
                  <IconButton
                    icon={<Icon as={FaTrash} color="red.600" boxSize={3} />}
                    aria-label={`Delete ${watch(
                      `categories.${index}.name`
                    )} category`}
                    variant="outline"
                    size="xs"
                    rounded="md"
                    onClick={() => remove(index)}
                  />
                </HStack>
              ))}
            </Stack>
          </ModalBody>

          <ModalFooter gap={4}>
            <Stack w="full">
              <Button
                leftIcon={<Icon as={FaPlus} />}
                variant="primary"
                w="full"
                onClick={() => append({ id: "", name: "" })}
                isDisabled={!isValid || isSubmitting}
              >
                Create new category
              </Button>

              <HStack mt={6} spacing={4} justifyContent="flex-end">
                <ScaleFade in={!isSubmitting} initialScale={0.9}>
                  <Button size="sm" onClick={onClose}>
                    Cancel
                  </Button>
                </ScaleFade>
                <Button
                  type="submit"
                  form="update-categories-form"
                  variant="primary"
                  size="sm"
                  isDisabled={!isValid || !isDirty || isSubmitting}
                  isLoading={isSubmitting}
                >
                  Save
                </Button>
              </HStack>
            </Stack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

import {
    Button,
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    Icon,
    Stack,
} from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa6";
import { useCreateRecipe } from "./hooks";

export default function CreateRecipeForm() {
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
            ></Stack>
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

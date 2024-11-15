import {
  Button,
  Icon,
  MenuItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { FaTrash, FaTriangleExclamation } from "react-icons/fa6";

import { api } from "~/utils/api";

export function DeleteMaterialButton({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const utils = api.useUtils();
  const mutation = api.material.deleteById.useMutation({
    onSuccess: async (data) => {
      toast({
        title: "Material deleted",
        description: `${data.name} has been deleted.`,
        status: "success",
      });

      await utils.material.getAll.invalidate();

      onClose();
    },
  });

  function handleDelete() {
    mutation.mutate({ id });
  }

  return (
    <>
      <MenuItem icon={<Icon as={FaTrash} />} color="red.500" onClick={onOpen}>
        Delete material
      </MenuItem>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader display="flex" alignItems="center" gap={4}>
            <Icon as={FaTriangleExclamation} boxSize={8} color="red.600" />
            Delete material
          </ModalHeader>
          <ModalBody fontSize="sm">
            Are you sure you want to delete {name}?
          </ModalBody>
          <ModalFooter gap={4}>
            <Button colorScheme="red" onClick={handleDelete}>
              Delete material
            </Button>
            <Button>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

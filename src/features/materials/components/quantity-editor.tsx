import {
  Button,
  ButtonProps,
  Flex,
  HStack,
  Icon,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ScaleFade,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { FaEdit } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa6";
import { NumericFormat } from "react-number-format";
import { ControlledCreatableSelect } from "~/components/controlled-creatable-select";
import { TextInput } from "~/components/text-input";
import { RouterOutputs } from "~/utils/api";
import { formatQuantityWithUnitAbbrev } from "~/utils/formatQuantity";
import { toDecimal } from "~/utils/prisma";
import { calculateAdjustedQuantity } from "~/utils/quantityAdjustment";
import { useUpdateQuantity } from "../hooks/use-update-quantity";
import { NewQuantityUpdateTypeForm } from "./new-quantity-update-type-form";

export function QuantityEditor(
  props: RouterOutputs["material"]["getAll"][0] & { buttonProps?: ButtonProps }
) {
  const {
    form: {
      control,
      handleSubmit,
      watch,
      formState: { isSubmitting },
    },
    onSubmit,
    updateTypeOptions,
  } = useUpdateQuantity(props);

  const { isOpen, onOpen, onClose } = useDisclosure();

  if (!props) {
    return null;
  }

  const { name, quantity, quantityUnit } = props;

  const prevQuantityText = formatQuantityWithUnitAbbrev({
    quantity,
    quantityUnit,
  });

  const newQuantity =
    quantity &&
    watch("adjustedQuantity") &&
    calculateAdjustedQuantity({
      previousQuantity: quantity,
      adjustmentAmount: toDecimal(
        watch("adjustedQuantity").replaceAll(",", "")
      ),
      action: watch("type.value.action"),
    });
  const newQuantityText = newQuantity
    ? formatQuantityWithUnitAbbrev({ quantity: newQuantity, quantityUnit })
    : prevQuantityText;

  return (
    <>
      <Button
        rightIcon={<Icon as={FaEdit} />}
        variant="stockUpdate"
        size="sm"
        justifyContent="space-between"
        w="full"
        onClick={onOpen}
        {...props.buttonProps}
      >
        {prevQuantityText}
      </Button>

      <Modal {...{ isOpen, onClose }}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{name}</ModalHeader>

          <ModalBody>
            <Stack
              as="form"
              id="update-material-quantity-form"
              onSubmit={handleSubmit(onSubmit)}
              spacing={4}
            >
              <ControlledCreatableSelect
                options={updateTypeOptions}
                control={control}
                name="type"
                label={
                  <Flex justifyContent="space-between" alignItems="center">
                    <Text>Quantity update type</Text>
                    <NewQuantityUpdateTypeForm />
                  </Flex>
                }
                useBasicStyles
              />
              <TextInput
                control={control}
                name="adjustedQuantity"
                label="Adjusted quantity"
                inputProps={{
                  as: NumericFormat,
                  allowNegative: false,
                  decimalScale: 2,
                  thousandSeparator: ",",
                }}
              />
              <HStack>
                <Text fontSize="xs">{prevQuantityText}</Text>{" "}
                <Icon as={FaChevronRight} boxSize={3} />
                <Text fontSize="xs" fontWeight="semibold">
                  {newQuantityText}
                </Text>
              </HStack>
              <TextInput control={control} name="notes" label="Notes" />
            </Stack>
          </ModalBody>

          <ModalFooter gap={4}>
            <ScaleFade in={!isSubmitting} initialScale={0.9}>
              <Button size="sm" onClick={onClose}>
                Cancel
              </Button>
            </ScaleFade>
            <Button
              type="submit"
              form="update-material-quantity-form"
              variant="primary"
              size="sm"
              isDisabled={isSubmitting}
              isLoading={isSubmitting}
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

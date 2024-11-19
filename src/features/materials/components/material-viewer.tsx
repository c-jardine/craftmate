import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Heading,
  HStack,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  SimpleGrid,
  Stack,
  Tag,
  useDisclosure,
} from "@chakra-ui/react";
import { FaEllipsis } from "react-icons/fa6";

import { type CustomCellRendererProps } from "ag-grid-react";

import { Detail } from "~/components/detail";
import { api } from "~/utils/api";
import { formatQuantityWithUnitAbbrev } from "~/utils/formatQuantity";
import { toNumber } from "~/utils/prisma";
import { DeleteMaterialButton } from "./delete-material-button";
import { MaterialUpdateLogs } from "./material-update-logs";
import { type MaterialsTableRows } from "./materials-table";
import { UpdateMaterialForm } from "./update-material-form";

export function MaterialViewer(
  props: CustomCellRendererProps<MaterialsTableRows>["data"]
) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  if (!props) {
    return null;
  }

  const {
    id,
    name,
    sku,
    cost,
    quantity,
    quantityUnit,
    minQuantity,
    vendor,
    categories,
  } = props;

  const { data: updates } = api.material.getQuantityUpdatesById.useQuery({
    id,
  });

  return (
    <>
      <Button
        variant="text"
        justifyContent="flex-start"
        alignItems="center"
        size="sm"
        fontSize="sm"
        fontWeight="semibold"
        w="fit-content"
        px={2}
        h="fit-content"
        py={"0 !important"}
        onClick={onOpen}
      >
        {name}
      </Button>
      <Drawer {...{ isOpen, onClose }} size="md">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader as={Stack}>
            <Heading as="h2" fontSize="2xl">
              {name}
            </Heading>
            {categories.length > 0 && (
              <Flex wrap="wrap" gap={2}>
                {categories.map(({ id, name }) => (
                  <Tag key={id}>{name}</Tag>
                ))}
              </Flex>
            )}
          </DrawerHeader>
          <DrawerBody>
            <Stack spacing={4}>
              <HStack>
                <UpdateMaterialForm {...props} />
                <Menu>
                  <MenuButton
                    as={IconButton}
                    icon={<Icon as={FaEllipsis} />}
                    aria-label="More options"
                  />
                  <MenuList>
                    <DeleteMaterialButton id={props.id} name={props.name} />
                  </MenuList>
                </Menu>
              </HStack>

              <SimpleGrid columns={3} gap={4}>
                <Detail
                  title="Stock level"
                  details={formatQuantityWithUnitAbbrev({
                    quantity,
                    quantityUnit,
                  })}
                />
                <Detail
                  title="Unit cost"
                  details={`$${toNumber(cost)} /${quantityUnit.abbrevSingular}`}
                />
                <Detail
                  title="Min. quantity"
                  details={formatQuantityWithUnitAbbrev({
                    quantity: minQuantity,
                    quantityUnit,
                  })}
                />
                <Detail title="SKU" details={sku} />
                <Detail title="Vendor" details={vendor?.name} />
              </SimpleGrid>
              {updates && updates.length > 0 && (
                <>
                  <Heading as="h2" fontSize="lg">
                    Updates
                  </Heading>
                  {updates && <MaterialUpdateLogs updates={updates} />}
                </>
              )}
            </Stack>
          </DrawerBody>
          <DrawerFooter gap={4}>
            <Button onClick={onClose}>Close</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}

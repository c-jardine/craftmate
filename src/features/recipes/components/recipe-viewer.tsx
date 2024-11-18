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
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { type ReactNode } from "react";
import { FaEllipsis } from "react-icons/fa6";

import { type CustomCellRendererProps } from "ag-grid-react";

import { Prisma } from "@prisma/client";
import { formatCurrency } from "~/utils/currency";
import { Character } from "~/utils/text";
import { RecipesTableRows } from "./recipes-table";
// import { DeleteMaterialButton } from "./delete-material-button";
// import { MaterialUpdateLogs } from "./material-update-logs";
// import { type MaterialsTableRows } from "./materials-table";
// import { UpdateMaterialForm } from "./update-material-form";

function Detail({ title, details }: { title: string; details: ReactNode }) {
  return (
    <Stack spacing={0}>
      <Heading as="h3" fontSize="xs" fontWeight="semibold" color="zinc.400">
        {title}
      </Heading>
      <Text fontSize="xs">{details}</Text>
    </Stack>
  );
}

export function RecipeViewer(
  props: CustomCellRendererProps<RecipesTableRows>["data"]
) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  if (!props) {
    return null;
  }

  const {
    name,
    sku,
    upc,
    retailPrice,
    wholesalePrice,
    batchSize,
    batchSizeUnit,
    materials,
    categories,
  } = props;

  const totalCost = materials.reduce((acc, recipeMaterial) => {
    const quantity = new Prisma.Decimal(recipeMaterial.quantity);
    const costPerUnit = recipeMaterial.material.cost ?? 0;
    const totalMaterialCost = quantity.times(costPerUnit);
    return acc.plus(totalMaterialCost);
  }, new Prisma.Decimal(0));

  const costPerUnit = totalCost.div(batchSize);

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
                {/* <UpdateMaterialForm {...props} /> */}
                <Menu>
                  <MenuButton
                    as={IconButton}
                    icon={<Icon as={FaEllipsis} />}
                    aria-label="More options"
                  />
                  <MenuList>
                    {/* <DeleteMaterialButton id={props.id} name={props.name} /> */}
                  </MenuList>
                </Menu>
              </HStack>

              <SimpleGrid columns={3} gap={4}>
                <Detail
                  title="Cost per unit"
                  details={`${formatCurrency(costPerUnit.toNumber())} /${
                    batchSizeUnit.abbrevSingular
                  }`}
                />
                <Detail
                  title="MSRP"
                  details={
                    retailPrice
                      ? formatCurrency(
                          new Prisma.Decimal(retailPrice).toNumber()
                        )
                      : Character.EM_DASH
                  }
                />
                <Detail
                  title="MSRP"
                  details={
                    wholesalePrice
                      ? formatCurrency(
                          new Prisma.Decimal(wholesalePrice).toNumber()
                        )
                      : Character.EM_DASH
                  }
                />
                <Detail title="SKU" details={sku ?? Character.EM_DASH} />
                <Detail title="UPC" details={upc ?? Character.EM_DASH} />
              </SimpleGrid>
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

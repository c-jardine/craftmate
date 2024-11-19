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
import { formatCurrency } from "~/utils/currency";
import { toNumber } from "~/utils/prisma";
import { Character } from "~/utils/text";
import { DeleteRecipeButton } from "./delete-recipe-button";
import { RecipeMaterialsAccordion } from "./recipe-materials-accordion";
import { RecipeMaterialsTable } from "./recipe-materials-table";
import { type RecipesTableRows } from "./recipes-table";

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
    costPerUnit,
    batchSizeUnit,
    materials,
    categories,
  } = props;

  // Calculate the margin.
  const margin = retailPrice
    ? retailPrice.minus(costPerUnit).div(retailPrice)
    : undefined;

  // Format the margin for display.
  const marginFormatted = margin
    ? Intl.NumberFormat("en-US", {
        style: "percent",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(margin.toNumber())
    : Character.EM_DASH;

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
      <Drawer {...{ isOpen, onClose }} size="xl">
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
            <Stack spacing={4} h="full">
              <HStack>
                {/* <UpdateMaterialForm {...props} /> */}
                <Menu>
                  <MenuButton
                    as={IconButton}
                    icon={<Icon as={FaEllipsis} />}
                    aria-label="More options"
                  />
                  <MenuList>
                    <DeleteRecipeButton id={props.id} name={props.name} />
                  </MenuList>
                </Menu>
              </HStack>

              <SimpleGrid columns={4} gap={4}>
                <Detail
                  title="MSRP"
                  details={
                    retailPrice
                      ? formatCurrency(toNumber(retailPrice)!)
                      : Character.EM_DASH
                  }
                />
                <Detail
                  title="Wholesale"
                  details={
                    wholesalePrice
                      ? formatCurrency(toNumber(wholesalePrice)!)
                      : Character.EM_DASH
                  }
                />
                <Detail
                  title="Cost per unit"
                  details={`${formatCurrency(toNumber(costPerUnit)!)} /${
                    batchSizeUnit.abbrevSingular
                  }`}
                />
                <Detail title="Margin" details={marginFormatted} />
                <Detail title="SKU" details={sku ?? Character.EM_DASH} />
                <Detail title="UPC" details={upc ?? Character.EM_DASH} />
              </SimpleGrid>

              {materials.length > 0 && (
                <>
                  <Heading as="h2" fontSize="lg">
                    Materials used
                  </Heading>
                  <>
                    <RecipeMaterialsTable {...props} />
                    <RecipeMaterialsAccordion {...props} />
                  </>
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

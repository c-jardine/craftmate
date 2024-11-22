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
import {
  Character,
  formatCurrency,
  formatQuantityWithUnitAbbrev,
} from "~/utils/formatting";
import { formatMargin } from "~/utils/math";
import { toNumber } from "~/utils/prisma";
import { DeleteRecipeButton } from "./delete-recipe-button";
import { RecipeMaterialsCards } from "./recipe-materials-cards";
import { RecipeMaterialsTable } from "./recipe-materials-table";
import { type RecipesTableRows } from "./recipes-table";
import { UpdateRecipeForm } from "./update-recipe-form";

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
    retailMargin,
    wholesalePrice,
    wholesaleMargin,
    costPerUnit,
    batchSize,
    batchSizeUnit,
    materials,
    categories,
  } = props;

  const retailMarginFormatted = formatMargin(retailMargin);
  const wholesaleMarginFormatted = formatMargin(wholesaleMargin);

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
        px={0}
        h="fit-content"
        py={"0 !important"}
        onClick={onOpen}
      >
        {name}
      </Button>
      <Drawer {...{ isOpen, onClose }} size="lg">
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
                <UpdateRecipeForm {...props} />
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

              <SimpleGrid columns={3} gap={4}>
                <Detail title="SKU" details={sku ?? Character.EM_DASH} />

                <Detail title="UPC" details={upc ?? Character.EM_DASH} />

                <Detail
                  title="Cost per unit"
                  details={`${formatCurrency(toNumber(costPerUnit))} /${
                    batchSizeUnit.abbrevSingular
                  }`}
                />

                <Detail
                  title="MSRP"
                  details={`${
                    retailPrice
                      ? formatCurrency(toNumber(retailPrice))
                      : Character.EM_DASH
                  } • ${retailMarginFormatted}`}
                />

                <Detail
                  title="Wholesale"
                  details={`${
                    wholesalePrice
                      ? formatCurrency(toNumber(wholesalePrice))
                      : Character.EM_DASH
                  } • ${wholesaleMarginFormatted}`}
                />
              </SimpleGrid>

              {/* Materials list */}
              {materials.length > 0 && (
                <>
                  <HStack justifyContent="space-between" alignItems="center">
                    <Heading as="h2" fontSize="lg">
                      Materials used
                    </Heading>
                    <Tag>
                      Batch size:{" "}
                      {formatQuantityWithUnitAbbrev({
                        quantity: batchSize,
                        quantityUnit: batchSizeUnit,
                      })}
                    </Tag>
                  </HStack>
                  <RecipeMaterialsTable {...props} />
                  <RecipeMaterialsCards {...props} />
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

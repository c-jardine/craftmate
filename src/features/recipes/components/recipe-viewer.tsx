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
  StackDivider,
  Tag,
  useDisclosure,
} from "@chakra-ui/react";
import { Prisma } from "@prisma/client";
import { FaEllipsis } from "react-icons/fa6";

import { type CustomCellRendererProps } from "ag-grid-react";

import { Detail } from "~/components/detail";
import { formatCurrency } from "~/utils/currency";
import { formatQuantityWithUnitAbbrev } from "~/utils/formatQuantity";
import { Character } from "~/utils/text";
import { DeleteRecipeButton } from "./delete-recipe-button";
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
    batchSize,
    batchSizeUnit,
    materials,
    categories,
  } = props;

  const margin = retailPrice
    ? Intl.NumberFormat("en-US", {
        style: "percent",
      }).format(retailPrice.minus(costPerUnit).div(retailPrice).toNumber())
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
                    <DeleteRecipeButton id={props.id} name={props.name} />
                  </MenuList>
                </Menu>
              </HStack>

              <SimpleGrid columns={3} gap={4}>
                <Detail
                  title="Cost per unit"
                  details={`${formatCurrency(
                    new Prisma.Decimal(costPerUnit).toNumber()
                  )} /${batchSizeUnit.abbrevSingular}`}
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
                  title="Wholesale price"
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
                <Detail title="Margin" details={margin} />
              </SimpleGrid>

              {materials.length > 0 && (
                <>
                  <Heading as="h2" fontSize="lg">
                    Materials
                  </Heading>
                  <Stack spacing={4} divider={<StackDivider />}>
                    {materials.map(
                      ({ id, quantity, quantityUnit, material }) => {
                        return (
                          <Stack key={id}>
                            <Heading
                              as="h3"
                              fontSize="sm"
                              fontWeight="semibold"
                            >
                              {material.name}
                            </Heading>
                            <SimpleGrid columns={3} fontSize="sm">
                              <Detail
                                title="Quantity per batch"
                                details={formatQuantityWithUnitAbbrev({
                                  quantity,
                                  quantityUnit,
                                })}
                              />
                              <Detail
                                title="Price per unit"
                                details={
                                  material.cost
                                    ? formatCurrency(
                                        quantity
                                          .div(batchSize)
                                          .times(material.cost)
                                          .toNumber()
                                      )
                                    : Character.EM_DASH
                                }
                              />

                              <Detail
                                title="Price per batch"
                                details={
                                  material.cost &&
                                  formatCurrency(
                                    new Prisma.Decimal(quantity)
                                      .times(new Prisma.Decimal(material.cost))
                                      .toNumber()
                                  )
                                }
                              />
                            </SimpleGrid>
                          </Stack>
                        );
                      }
                    )}
                  </Stack>
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

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
import { PageSection } from "~/components/page-section";
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
import { type RecipesRowDataType } from "./recipes-table";
import { UpdateRecipeForm } from "./update-recipe-form";

export function RecipeViewer(
  props: CustomCellRendererProps<RecipesRowDataType>["data"]
) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  if (!props) {
    return null;
  }

  const {
    name,
    sku,
    retailPrice,
    retailMargin,
    wholesalePrice,
    wholesaleMargin,
    cogsUnit,
    cogsBatch,
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

              {sku && (
                <SimpleGrid columns={3} gap={4}>
                  <Detail title="SKU" details={sku ?? Character.EM_DASH} />
                </SimpleGrid>
              )}

              <SimpleGrid columns={3} gap={4}>
                <Detail
                  title="Batch size"
                  details={formatQuantityWithUnitAbbrev({
                    quantity: batchSize,
                    quantityUnit: batchSizeUnit,
                  })}
                />

                <Detail
                  title="Cost per unit"
                  details={`${formatCurrency(toNumber(cogsUnit))} /${
                    batchSizeUnit.abbrevSingular
                  }`}
                />

                <Detail
                  title="Cost per batch"
                  details={`${formatCurrency(toNumber(cogsBatch))} /${
                    batchSizeUnit.abbrevSingular
                  }`}
                />
              </SimpleGrid>

              <Heading as="h2" fontSize="lg">
                Pricing
              </Heading>

              <SimpleGrid columns={2} gap={4}>
                <PageSection position="relative">
                  <Tag
                    position="absolute"
                    top={-3}
                    left="50%"
                    transform="translateX(-50%)"
                  >
                    Retail
                  </Tag>
                  <SimpleGrid columns={2} gap={4}>
                    <Detail
                      title="Price"
                      details={
                        retailPrice
                          ? formatCurrency(toNumber(retailPrice))
                          : Character.EM_DASH
                      }
                    />
                    <Detail title="Margin" details={retailMarginFormatted} />
                  </SimpleGrid>
                </PageSection>

                <PageSection position="relative">
                  <Tag
                    position="absolute"
                    top={-3}
                    left="50%"
                    transform="translateX(-50%)"
                  >
                    Wholesale
                  </Tag>
                  <SimpleGrid columns={2} gap={4}>
                    <Detail
                      title="Price"
                      details={
                        wholesalePrice
                          ? formatCurrency(toNumber(wholesalePrice))
                          : Character.EM_DASH
                      }
                    />
                    <Detail title="Margin" details={wholesaleMarginFormatted} />
                  </SimpleGrid>
                </PageSection>
              </SimpleGrid>

              {/* Materials list */}
              {materials.length > 0 && (
                <>
                  <Heading as="h2" fontSize="lg">
                    Materials used
                  </Heading>
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

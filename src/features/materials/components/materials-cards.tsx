import { Flex, HStack, SimpleGrid, Stack, Tag } from "@chakra-ui/react";
import PuffLoader from "react-spinners/PuffLoader";

import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid

import { Detail } from "~/components/detail";
import { PageSection } from "~/components/page-section";
import { api } from "~/utils/api";
import {
  Character,
  formatCurrency,
  formatQuantityWithUnitAbbrev,
} from "~/utils/formatting";
import { toNumber } from "~/utils/prisma";
import { MaterialViewer } from "./material-viewer";
import { QuantityEditor } from "./quantity-editor";
import { StatusIndicator } from "./status-indicator";

export function MaterialsCards() {
  // Fetch materials query
  const { data: materials, isLoading } = api.material.getAll.useQuery();

  // Show spinner if query is loading
  if (isLoading) {
    return (
      <Flex justifyContent="center" alignItems="center" flexGrow={1}>
        <PuffLoader color="var(--chakra-colors-blue-500)" />
      </Flex>
    );
  }

  if (!materials) {
    return null;
  }

  return (
    <Stack spacing={4}>
      {materials.map((material) => {
        return (
          <PageSection
            key={material.id}
            as={Stack}
            display={{ base: "flex", md: "none" }}
          >
            <HStack justifyContent="space-between" alignItems="center">
              <MaterialViewer {...material} status="In Stock" />
              {material.quantity && material.minQuantity && (
                <StatusIndicator {...material} />
              )}
            </HStack>

            {material.categories?.length > 0 && (
              <HStack wrap="wrap">
                {material.categories.map((category) => (
                  <Tag key={category.id}>{category.name}</Tag>
                ))}
              </HStack>
            )}

            <SimpleGrid columns={2} gap={4}>
              <Detail
                title="SKU"
                details={material.sku ?? Character.EM_DASH}
                fontSize="sm"
              />

              <Detail
                title="Quantity"
                details={
                  <QuantityEditor
                    {...material}
                    buttonProps={{
                      w: "fit-content",
                      fontSize: "sm",
                    }}
                  />
                }
                fontSize="sm"
                alignItems="flex-end"
              />

              <Detail
                title="Cost"
                details={
                  material.cost
                    ? `${formatCurrency(toNumber(material.cost))} /${
                        material.quantityUnit.abbrevSingular
                      }`
                    : Character.EM_DASH
                }
                fontSize="sm"
              />

              <Detail
                title="Min. quantity"
                details={formatQuantityWithUnitAbbrev({
                  quantity: material.minQuantity,
                  quantityUnit: material.quantityUnit,
                })}
                fontSize="sm"
                alignItems="flex-end"
              />
            </SimpleGrid>
          </PageSection>
        );
      })}
    </Stack>
  );
}

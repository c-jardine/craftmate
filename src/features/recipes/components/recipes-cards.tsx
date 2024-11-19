import { Flex, HStack, SimpleGrid, Stack, Text } from "@chakra-ui/react";

import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid

import PuffLoader from "react-spinners/PuffLoader";
import { Detail } from "~/components/detail";
import { PageSection } from "~/components/page-section";
import { api, type RouterOutputs } from "~/utils/api";
import { formatCurrency } from "~/utils/currency";
import { toNumber } from "~/utils/prisma";
import { Character } from "~/utils/text";
import { RecipeViewer } from "./recipe-viewer";

// Table column type definition
export type RecipesTableRows = RouterOutputs["recipe"]["getAll"][0];

export function RecipesCards() {
  // Fetch materials query
  const { data: recipes, isLoading } = api.recipe.getAll.useQuery();

  // Show spinner if query is loading
  if (isLoading) {
    return (
      <Flex justifyContent="center" alignItems="center" flexGrow={1}>
        <PuffLoader color="var(--chakra-colors-blue-500)" />
      </Flex>
    );
  }

  if (!recipes) {
    return null;
  }

  return (
    <Stack>
      {recipes.map((recipe) => {
        // Calculate the margin.
        const margin = recipe.retailPrice
          ? recipe.retailPrice.minus(recipe.costPerUnit).div(recipe.retailPrice)
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
          <PageSection
            key={recipe.id}
            as={Stack}
            display={{ base: "flex", md: "none" }}
          >
            <HStack justifyContent="space-between" alignItems="center">
              <RecipeViewer {...recipe} />
              <Text fontSize="xs" fontStyle="italic">
                ({recipe.materials.length} materials)
              </Text>
            </HStack>
            <SimpleGrid columns={4}>
              <Detail
                title="Unit cost"
                details={`${formatCurrency(toNumber(recipe.costPerUnit)!)} /${
                  recipe.batchSizeUnit.abbrevSingular
                }`}
              />

              <Detail
                title="MSRP"
                details={`${formatCurrency(toNumber(recipe.retailPrice)!)} /${
                  recipe.batchSizeUnit.abbrevSingular
                }`}
              />

              <Detail
                title="Wholesale"
                details={`${formatCurrency(
                  toNumber(recipe.wholesalePrice)!
                )} /${recipe.batchSizeUnit.abbrevSingular}`}
              />

              <Detail title="Margin" details={marginFormatted} />
            </SimpleGrid>
          </PageSection>
        );
      })}
    </Stack>
  );
}

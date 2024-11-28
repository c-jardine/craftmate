import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  HStack,
  SimpleGrid,
  Stack,
  Tag,
  Text,
} from "@chakra-ui/react";

import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid

import { Detail } from "~/components/detail";
import { PageSection } from "~/components/page-section";
import { type RouterOutputs } from "~/utils/api";
import { Character, formatCurrency } from "~/utils/formatting";
import { toNumber } from "~/utils/prisma";
import { RecipeViewer } from "./recipe-viewer";

export function RecipesCards({
  recipes,
}: {
  recipes: RouterOutputs["recipe"]["getAll"] | undefined;
}) {
  if (!recipes) {
    return null;
  }

  return (
    <Stack display={{ base: "flex", md: "none" }}>
      {recipes.map((recipe) => {
        // Calculate the margin.
        const margin = recipe.retailPrice
          ? recipe.retailPrice.minus(recipe.cogsUnit).div(recipe.retailPrice)
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
            {recipe.categories?.length > 0 && (
              <HStack wrap="wrap">
                {recipe.categories.map((category) => (
                  <Tag key={category.id}>{category.name}</Tag>
                ))}
              </HStack>
            )}
            <SimpleGrid columns={3} gap={4}>
              <Detail
                title="SKU"
                details={recipe.sku ?? Character.EM_DASH}
                fontSize="sm"
              />

              <Detail
                title="Unit cost"
                details={`${formatCurrency(toNumber(recipe.cogsUnit))} /${
                  recipe.batchSizeUnit.abbrevSingular
                }`}
                alignItems="flex-end"
                fontSize="sm"
              />

              <Detail
                title="MSRP"
                details={
                  recipe.retailPrice
                    ? `${formatCurrency(toNumber(recipe.retailPrice))} /${
                        recipe.batchSizeUnit.abbrevSingular
                      }`
                    : Character.EM_DASH
                }
                fontSize="sm"
              />

              <Detail
                title="Wholesale"
                details={
                  recipe.wholesalePrice
                    ? `${formatCurrency(toNumber(recipe.wholesalePrice))} /${
                        recipe.batchSizeUnit.abbrevSingular
                      }`
                    : Character.EM_DASH
                }
                fontSize="sm"
              />

              <Detail
                title="Margin"
                details={marginFormatted}
                alignItems="flex-end"
                fontSize="sm"
              />
            </SimpleGrid>

            {recipe.notes && (
              <Accordion allowToggle>
                <AccordionItem>
                  <h2>
                    <AccordionButton>
                      <Box as="span" flex={1} textAlign="left">
                        Notes
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>{recipe.notes}</AccordionPanel>
                </AccordionItem>
              </Accordion>
            )}
          </PageSection>
        );
      })}
    </Stack>
  );
}

import { HStack, Stack, Tag, Text, useColorModeValue } from "@chakra-ui/react";

import { type CustomCellRendererProps } from "ag-grid-react";

import { RecipeViewer } from "./recipe-viewer";
import { type RecipesRowDataType } from "./recipes-table";

export function NameRenderer({
  node,
}: CustomCellRendererProps<RecipesRowDataType>) {
  const skuColor = useColorModeValue("zinc.500", "zinc.500");

  if (!node.data) {
    return null;
  }

  const { sku, categories } = node.data;

  return (
    <HStack
      py={2}
      justifyContent="space-between"
      alignItems="center"
      wrap="wrap"
    >
      <Stack spacing={2}>
        <RecipeViewer {...node.data} />

        {categories?.length > 0 && (
          <HStack wrap="wrap">
            {categories.map((category) => (
              <Tag key={category.id}>{category.name}</Tag>
            ))}
          </HStack>
        )}
      </Stack>
      <Stack alignItems="flex-end" alignSelf="center" spacing={2}>
        {sku && (
          <Text px={1} color={skuColor} fontStyle="italic" lineHeight="normal">
            SKU: {sku}
          </Text>
        )}
      </Stack>
    </HStack>
  );
}

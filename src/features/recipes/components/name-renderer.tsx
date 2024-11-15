import { HStack, Stack, Tag, Text, useColorModeValue } from "@chakra-ui/react";

import { type CustomCellRendererProps } from "ag-grid-react";

import { type RecipesTableRows } from "./recipes-table";

export function NameRenderer({
  node,
}: CustomCellRendererProps<RecipesTableRows>) {
  const skuColor = useColorModeValue("zinc.500", "zinc.500");

  if (!node.data) {
    return null;
  }

  const { name, sku, upc, categories } = node.data;

  return (
    <HStack
      py={2}
      justifyContent="space-between"
      alignItems="center"
      wrap="wrap"
    >
      <Stack spacing={2}>
        {/* <MaterialViewer {...node.data} /> */}
        <Text lineHeight={1}>{name}</Text>

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

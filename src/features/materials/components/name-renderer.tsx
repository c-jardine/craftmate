import { HStack, Stack, Tag, Text, useColorModeValue } from "@chakra-ui/react";

import { type CustomCellRendererProps } from "ag-grid-react";

import { ExternalLink } from "~/components/external-link";
import { MaterialViewer } from "./material-viewer";
import { type MaterialsRowDataType } from "./materials-table";

export function NameRenderer({
  node,
}: CustomCellRendererProps<MaterialsRowDataType>) {
  const skuColor = useColorModeValue("zinc.500", "zinc.500");

  if (!node.data) {
    return null;
  }

  const { url, sku, vendor, categories } = node.data;

  return (
    <HStack
      py={2}
      justifyContent="space-between"
      alignItems="center"
      wrap="wrap"
    >
      <Stack spacing={2}>
        <MaterialViewer {...node.data} />
        {categories?.length > 0 && (
          <HStack wrap="wrap">
            {categories.map((category) => (
              <Tag key={category.id}>{category.name}</Tag>
            ))}
          </HStack>
        )}
      </Stack>
      <Stack alignItems="flex-end" alignSelf="center" spacing={2}>
        {url && (
          <ExternalLink href={url}>
            View
            {vendor?.name ? ` on ${vendor.name}` : " website"}
          </ExternalLink>
        )}
        {sku && (
          <Text px={1} color={skuColor} fontStyle="italic" lineHeight="normal">
            SKU: {sku}
          </Text>
        )}
      </Stack>
    </HStack>
  );
}

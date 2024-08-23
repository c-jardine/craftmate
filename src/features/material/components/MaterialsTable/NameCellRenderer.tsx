import { HStack, Stack, Tag, Text } from "@chakra-ui/react";
import { type CustomCellRendererProps } from "ag-grid-react";
import { type MaterialTableColumnsDef } from "./MaterialsTable";

export function NameCellRenderer({
  node,
}: CustomCellRendererProps<MaterialTableColumnsDef>) {
  if (!node.data) {
    return null;
  }

  return (
    <Stack spacing={0}>
      <Text>{node.data.name}</Text>
      {node.data.categories?.length && (
        <HStack mt={-2} mb={2}>
          {node.data.categories?.map((c) => (
            <Tag key={c} fontSize="xs" fontWeight="medium">
              {c}
            </Tag>
          ))}
        </HStack>
      )}
    </Stack>
  );
}
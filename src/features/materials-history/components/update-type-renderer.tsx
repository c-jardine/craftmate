import { HStack, Tag, Text, useColorModeValue } from "@chakra-ui/react";

import { type CustomCellRendererProps } from "ag-grid-react";

import { type MaterialLogsTableRows } from "./material-logs-table";

export function UpdateTypeRenderer({
  node,
}: CustomCellRendererProps<MaterialLogsTableRows>) {
  const color = node.data?.type.color;
  const styles = {
    border: "1px",
    borderColor: useColorModeValue(`${color}.300`, `${color}.900`),
    bg: useColorModeValue(`${color}.100`, `${color}.950`),
    color: useColorModeValue(`${color}.800`, `${color}.500`),
  };

  if (!node.data) {
    return null;
  }

  const { type } = node.data;

  return (
    <Tag {...{ ...styles }}>
      <HStack alignItems="center">
        <Text fontWeight="semibold">{type.type}</Text>
      </HStack>
    </Tag>
  );
}

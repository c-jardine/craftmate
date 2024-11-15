import { Text } from "@chakra-ui/react";

import { type CustomCellRendererProps } from "ag-grid-react";

import { formatQuantityWithUnitAbbrev } from "~/utils/formatQuantity";
import { type MaterialLogsTableRows } from "./material-logs-table";

export function PreviousQuantityRenderer({
  node,
}: CustomCellRendererProps<MaterialLogsTableRows>) {
  if (!node.data) {
    return null;
  }

  const { originalQuantity, material } = node.data;

  return (
    <Text>
      {formatQuantityWithUnitAbbrev({
        quantity: originalQuantity,
        quantityUnit: material.quantityUnit,
      })}
    </Text>
  );
}

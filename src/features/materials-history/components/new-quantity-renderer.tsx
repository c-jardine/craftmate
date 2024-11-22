import { Text } from "@chakra-ui/react";

import { type CustomCellRendererProps } from "ag-grid-react";

import { formatQuantityWithUnitAbbrev } from "~/utils/formatting";
import { calculateAdjustedQuantity } from "~/utils/inventory";
import { type MaterialLogsTableRows } from "./material-logs-table";

export function NewQuantityRenderer({
  node,
}: CustomCellRendererProps<MaterialLogsTableRows>) {
  if (!node.data) {
    return null;
  }

  const { originalQuantity, adjustedQuantity, type, material } = node.data;

  const adjustedBy = calculateAdjustedQuantity({
    previousQuantity: originalQuantity,
    adjustmentAmount: adjustedQuantity,
    action: type.action,
  });

  return (
    <Text>
      {formatQuantityWithUnitAbbrev({
        quantity: adjustedBy,
        quantityUnit: material.quantityUnit,
      })}
    </Text>
  );
}

import { Text } from "@chakra-ui/react";
import { Prisma } from "@prisma/client";

import { type CustomCellRendererProps } from "ag-grid-react";

import { type MaterialLogsTableRows } from "./MaterialLogsTable";

export function NewQuantityCellRenderer({
  node,
}: CustomCellRendererProps<MaterialLogsTableRows>) {
  if (!node.data) {
    return null;
  }

  const { originalQuantity, adjustedQuantity, type } = node.data;

  const prev = new Prisma.Decimal(originalQuantity);
  const adj = new Prisma.Decimal(adjustedQuantity);

  function getAdjustedBy() {
    switch (type) {
      case "DECREASE": {
        return prev.sub(adj);
      }
      case "SET": {
        return adj;
      }
      case "INCREASE": {
        return prev.add(adj);
      }
      default: {
        return adj;
      }
    }
  }

  const adjustedBy = getAdjustedBy();

  return <Text>{adjustedBy?.toNumber()}</Text>;
}
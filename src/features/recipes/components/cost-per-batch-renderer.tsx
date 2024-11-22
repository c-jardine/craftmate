import { HStack, Text } from "@chakra-ui/react";

import { type CustomCellRendererProps } from "ag-grid-react";

import { formatCurrency } from "~/utils/formatting";
import { toNumber } from "~/utils/prisma";
import { type RecipesTableRows } from "./recipes-table";

export function CostPerBatchRenderer({
  node,
}: CustomCellRendererProps<RecipesTableRows>) {
  if (!node.data) {
    return null;
  }

  const { batchSize, batchSizeUnit, costPerUnit } = node.data;

  return (
    <Text>
      {formatCurrency(toNumber(costPerUnit.times(batchSize)))} /
      {batchSizeUnit.abbrevSingular}
    </Text>
  );
}

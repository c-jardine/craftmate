import { HStack, Text } from "@chakra-ui/react";

import { type CustomCellRendererProps } from "ag-grid-react";

import { formatCurrency } from "~/utils/currency";
import { toNumber } from "~/utils/prisma";
import { type RecipesTableRows } from "./recipes-table";

export function CostPerUnitRenderer({
  node,
}: CustomCellRendererProps<RecipesTableRows>) {
  if (!node.data) {
    return null;
  }

  const { batchSizeUnit, costPerUnit } = node.data;

  return (
    <HStack
      py={2}
      justifyContent="space-between"
      alignItems="center"
      wrap="wrap"
    >
      <Text>
        {formatCurrency(toNumber(costPerUnit)!)} /{batchSizeUnit.abbrevSingular}
      </Text>
    </HStack>
  );
}

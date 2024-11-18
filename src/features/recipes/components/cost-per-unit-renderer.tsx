import { HStack, Text } from "@chakra-ui/react";
import { Prisma } from "@prisma/client";

import { type CustomCellRendererProps } from "ag-grid-react";

import { formatCurrency } from "~/utils/currency";
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
        {formatCurrency(new Prisma.Decimal(costPerUnit).toNumber())} /
        {batchSizeUnit.abbrevSingular}
      </Text>
    </HStack>
  );
}

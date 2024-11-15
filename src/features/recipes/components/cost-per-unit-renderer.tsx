import { HStack, Text } from "@chakra-ui/react";

import { type CustomCellRendererProps } from "ag-grid-react";

import { Prisma } from "@prisma/client";
import { type RecipesTableRows } from "./recipes-table";
import { formatCurrency } from "~/utils/currency";

export function CostPerUnitRenderer({
  node,
}: CustomCellRendererProps<RecipesTableRows>) {
  if (!node.data) {
    return null;
  }

  const { batchSize, batchSizeUnit, materials } = node.data;

  const totalCost = materials.reduce((acc, recipeMaterial) => {
    const quantity = new Prisma.Decimal(recipeMaterial.quantity);
    const costPerUnit = recipeMaterial.material.cost ?? 0;
    const totalMaterialCost = quantity.times(costPerUnit);
    return acc.plus(totalMaterialCost);
  }, new Prisma.Decimal(0));

  const costPerUnit = totalCost.div(batchSize);

  return (
    <HStack
      py={2}
      justifyContent="space-between"
      alignItems="center"
      wrap="wrap"
    >
      <Text>
        {formatCurrency(costPerUnit.toNumber())} /{batchSizeUnit.abbrevSingular}
      </Text>
    </HStack>
  );
}

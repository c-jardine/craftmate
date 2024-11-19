import {
  Heading,
  HStack,
  Icon,
  Stack,
  StackDivider,
  Text,
} from "@chakra-ui/react";

import { FaCircle } from "react-icons/fa6";
import { formatCurrency } from "~/utils/currency";
import { formatQuantityWithUnitAbbrev } from "~/utils/formatQuantity";
import { Character } from "~/utils/text";
import { type RecipesTableRows } from "./recipes-table";

export function RecipeMaterialsCards({
  batchSize,
  materials,
}: RecipesTableRows) {
  return (
    <Stack
      display={{ base: "flex", md: "none" }}
      spacing={4}
      divider={<StackDivider />}
    >
      {materials.map(({ id, quantity, quantityUnit, material }) => {
        return (
          <Stack key={id} spacing={0}>
            <Heading as="h3" fontSize="sm" fontWeight="semibold">
              {material.name}
            </Heading>
            <HStack divider={<Icon as={FaCircle} boxSize={1} />}>
              <Text fontSize="sm" color="zinc.600">
                {formatQuantityWithUnitAbbrev({
                  quantity: quantity.div(batchSize),
                  quantityUnit,
                })}{" "}
                used
              </Text>

              <Text fontSize="sm" color="zinc.600">
                {material.cost
                  ? `${formatCurrency(
                      quantity.div(batchSize).times(material.cost).toNumber(),
                      {
                        minimumFractionDigits: 4,
                        maximumFractionDigits: 4,
                      }
                    )} per unit`
                  : Character.EM_DASH}
              </Text>

              <Text fontSize="sm" color="zinc.600">
                {formatQuantityWithUnitAbbrev({
                  quantity: material.quantity,
                  quantityUnit,
                })}{" "}
                available
              </Text>
            </HStack>
          </Stack>
        );
      })}
    </Stack>
  );
}

import { Flex, HStack, Icon, Text, useColorModeValue } from "@chakra-ui/react";
import { FaArrowDown, FaArrowUp } from "react-icons/fa6";

import { type CustomCellRendererProps } from "ag-grid-react";

import { Character, formatQuantityWithUnitAbbrev } from "~/utils/formatting";
import { type MaterialLogsTableRows } from "./material-logs-table";

export function AdjustedQuantityRenderer({
  node,
}: CustomCellRendererProps<MaterialLogsTableRows>) {
  const negativeColor = useColorModeValue("red.600", "red.500");
  const positiveColor = useColorModeValue("green.600", "green.500");

  if (!node.data) return null;

  const { originalQuantity, adjustedQuantity, type, material } = node.data;

  const prev = originalQuantity;
  const adj = adjustedQuantity;
  const quantityDifference = adj.sub(prev);

  const { icon, color } = quantityDifference.isNegative()
    ? { icon: FaArrowDown, color: negativeColor }
    : { icon: FaArrowUp, color: positiveColor };

  const adjustedBy = type.type === "SET" ? adj.sub(prev).abs() : adj;

  return (
    <Flex alignItems="center" h="full">
      {adjustedBy.isZero() ? (
        <Text>{Character.EM_DASH}</Text>
      ) : (
        <HStack color={color}>
          <Icon as={icon} />
          <Text>
            {formatQuantityWithUnitAbbrev({
              quantity: adjustedBy,
              quantityUnit: material.quantityUnit,
            })}
          </Text>
        </HStack>
      )}
    </Flex>
  );
}

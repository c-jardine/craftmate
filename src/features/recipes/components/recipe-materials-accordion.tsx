import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Heading,
  HStack,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Prisma } from "@prisma/client";

import {
  Character,
  formatCurrency,
  formatQuantityWithUnitAbbrev,
} from "~/utils/formatting";
import { type RecipesTableRows } from "./recipes-table";

export function RecipeMaterialsAccordion({
  batchSize,
  materials,
}: RecipesTableRows) {
  return (
    <Accordion allowToggle display={{ base: "block", md: "none" }}>
      {materials.map(({ id, quantity, quantityUnit, material }) => {
        return (
          <AccordionItem key={id}>
            <h3>
              <AccordionButton>
                <HStack flex={1} justifyContent="space-between" fontSize="sm">
                  <Text fontWeight="semibold">{material.name}</Text>
                  <Text fontSize="xs">
                    (
                    {formatQuantityWithUnitAbbrev({
                      quantity,
                      quantityUnit,
                    })}
                    )
                  </Text>
                </HStack>
                <AccordionIcon />
              </AccordionButton>
            </h3>
            <AccordionPanel pb={4}>
              <SimpleGrid gap={4} columns={2}>
                <Stack spacing={0}>
                  <Heading
                    as="h4"
                    fontSize="sm"
                    fontWeight="semibold"
                    color="zinc.400"
                  >
                    Quantity per batch
                  </Heading>
                  <Text fontSize="sm">
                    {formatQuantityWithUnitAbbrev({
                      quantity,
                      quantityUnit,
                    })}
                  </Text>
                </Stack>

                <Stack spacing={0} alignItems="flex-end">
                  <Heading
                    as="h4"
                    fontSize="sm"
                    fontWeight="semibold"
                    color="zinc.400"
                  >
                    Quantity per unit
                  </Heading>
                  <Text fontSize="sm">
                    {formatQuantityWithUnitAbbrev({
                      quantity: quantity.div(batchSize),
                      quantityUnit,
                    })}
                  </Text>
                </Stack>

                <Stack spacing={0}>
                  <Heading
                    as="h4"
                    fontSize="sm"
                    fontWeight="semibold"
                    color="zinc.400"
                  >
                    Cost per batch
                  </Heading>
                  <Text fontSize="sm">
                    {material.cost &&
                      formatCurrency(
                        new Prisma.Decimal(quantity)
                          .times(new Prisma.Decimal(material.cost))
                          .toNumber(),
                        {
                          minimumFractionDigits: 4,
                          maximumFractionDigits: 4,
                        }
                      )}
                  </Text>
                </Stack>

                <Stack spacing={0} alignItems="flex-end">
                  <Heading
                    as="h4"
                    fontSize="sm"
                    fontWeight="semibold"
                    color="zinc.400"
                  >
                    Quantity per unit
                  </Heading>
                  <Text fontSize="sm">
                    {material.cost
                      ? formatCurrency(
                          quantity
                            .div(batchSize)
                            .times(material.cost)
                            .toNumber(),
                          {
                            minimumFractionDigits: 4,
                            maximumFractionDigits: 4,
                          }
                        )
                      : Character.EM_DASH}
                  </Text>
                </Stack>
              </SimpleGrid>
            </AccordionPanel>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}

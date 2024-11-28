import {
  Tag,
  TagLabel,
  TagLeftIcon,
  type TagProps,
  useColorModeValue,
} from "@chakra-ui/react";
import { Availability } from "@prisma/client";
import { FaCircle } from "react-icons/fa6";

import { type RouterOutputs } from "~/utils/api";
import { formatAvailability } from "~/utils/formatting";

export function AvailabilityIndicator({
  availability,
}: RouterOutputs["material"]["getAll"][0]) {
  const greenStyles = {
    border: "1px",
    borderColor: useColorModeValue("green.300", "green.900"),
    bg: useColorModeValue("green.100", "green.950"),
    color: useColorModeValue("green.800", "green.500"),
  };

  const yellowStyles = {
    border: "1px",
    borderColor: useColorModeValue("yellow.300", "yellow.900"),
    bg: useColorModeValue("yellow.100", "yellow.950"),
    color: useColorModeValue("yellow.800", "yellow.500"),
  };

  const redStyles = {
    border: "1px",
    borderColor: useColorModeValue("red.300", "red.900"),
    bg: useColorModeValue("red.100", "red.950"),
    color: useColorModeValue("red.800", "red.500"),
  };

  function getStyles(status: Availability | null): TagProps {
    switch (status) {
      case Availability.AVAILABLE:
        return greenStyles;
      case Availability.LOW_STOCK:
        return yellowStyles;
      case Availability.OUT_OF_STOCK:
        return redStyles;
      default:
        return {};
    }
  }

  const availabilityFormatted = formatAvailability(availability);

  return (
    <Tag fontSize="xs" fontWeight="light" {...getStyles(availability)}>
      <TagLeftIcon as={FaCircle} boxSize={1.5} />
      <TagLabel>{availabilityFormatted}</TagLabel>
    </Tag>
  );
}

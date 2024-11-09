import {
  Box,
  Circle,
  Flex,
  HStack,
  Icon,
  Stack,
  Text,
  type ToastProviderProps,
  useColorModeValue,
  type UseToastOptions,
} from "@chakra-ui/react";
import { FaCheck, FaEllipsis, FaExclamation, FaInfo } from "react-icons/fa6";

export const toastOptions: ToastProviderProps = {
  defaultOptions: {
    position: "bottom-right",
    render: CustomToast,
  },
};

function CustomToast({
  title,
  description,
  status,
  onClose,
}: UseToastOptions & { onClose: () => void }) {
  function getStyles() {
    switch (status) {
      case "success":
        return { icon: FaCheck, color: "emerald" };
      case "error":
        return { icon: FaExclamation, color: "red" };
      case "info":
        return { icon: FaInfo, color: "blue" };
      case "loading":
        return { icon: FaEllipsis, color: "zinc" };
      case "warning":
        return { icon: FaExclamation, color: "yellow" };
      default:
        return { icon: FaCheck, color: "zinc" };
    }
  }
  const { icon, color } = getStyles();

  const containerBg = useColorModeValue("white", "black");
  const borderColor = useColorModeValue(`zinc.100`, `zinc.900`);
  const descriptionColor = useColorModeValue("zinc.600", "zinc.300");
  const shadow = useColorModeValue(
    "rgba(149, 157, 165, 0.2) 0px 8px 24px",
    "rgba(26, 24, 22, 0.2) 0px 8px 24px"
  );

  return (
    <Box
      position="relative"
      rounded="lg"
      border="1px solid"
      borderColor={borderColor}
      bg={containerBg}
      overflow="hidden"
      maxW="sm"
      w="full"
      shadow={shadow}
      onClick={onClose}
    >
      <HStack>
        <Box alignSelf="flex-start" mt="18px" pl={4}>
          <Circle border="1.5px solid" borderColor={`${color}.600`} size={5}>
            <Icon as={icon} boxSize={3} color={`${color}.600`} />
          </Circle>
        </Box>
        <Stack w="full" pl={2} pr={4} py={4}>
          <Flex justifyContent="space-between" alignItems="center" w="full">
            <Text fontSize="sm" fontWeight="bold" color={`${color}.600`}>
              {title}
            </Text>
          </Flex>
          <Text mt={-1} fontSize="sm" color={descriptionColor}>
            {description}
          </Text>
        </Stack>
      </HStack>
    </Box>
  );
}

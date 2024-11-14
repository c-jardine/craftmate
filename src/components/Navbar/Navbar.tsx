import { Container, Flex, useColorModeValue } from "@chakra-ui/react";

import { DesktopNavbar } from "./desktop-navbar";

export function Navbar() {
  const bgColor = useColorModeValue("white", "zinc.900");
  const borderColor = useColorModeValue("zinc.200", "zinc.800");

  return (
    <Flex
      position="fixed"
      top={0}
      w="full"
      h={16}
      bg={bgColor}
      borderBottom="1px solid"
      borderBottomColor={borderColor}
      alignItems="center"
    >
      <Container px={4} maxW="1440px">
        <DesktopNavbar />
      </Container>
    </Flex>
  );
}

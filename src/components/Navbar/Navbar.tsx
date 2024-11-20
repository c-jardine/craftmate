import { Box, useColorModeValue } from "@chakra-ui/react";

import { DesktopNavbar } from "./desktop-navbar";
import { MobileNavbar } from "./mobile-navbar";

export function Navbar() {
  const bgColor = useColorModeValue("white", "zinc.900");
  const borderColor = useColorModeValue("zinc.200", "zinc.800");

  return (
    <Box
      position="fixed"
      top={0}
      w="full"
      h={16}
      bg={bgColor}
      borderBottom="1px solid"
      borderBottomColor={borderColor}
      px={4}
    >
      <DesktopNavbar />
      <MobileNavbar />
    </Box>
  );
}

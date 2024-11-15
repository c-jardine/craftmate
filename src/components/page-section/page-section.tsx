import {
  Container,
  type ContainerProps,
  useColorModeValue,
} from "@chakra-ui/react";
import { type ReactNode } from "react";

interface SectionProps extends ContainerProps {
  children: ReactNode;
}

export function PageSection({ children, ...props }: SectionProps) {
  const bgColor = useColorModeValue("white", "zinc.900");
  const borderColor = useColorModeValue("zinc.200", "zinc.800");

  return (
    <Container
      p={4}
      rounded="2xl"
      maxW="full"
      bg={bgColor}
      border="1px"
      borderColor={borderColor}
      {...props}
    >
      {children}
    </Container>
  );
}

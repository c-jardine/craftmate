import {
  Heading,
  Stack,
  type StackProps,
  Text,
  TypographyProps,
} from "@chakra-ui/react";
import { type ReactNode } from "react";

export function Detail({
  title,
  details,
  fontSize = "xs",
  ...props
}: {
  title: string;
  details: ReactNode;
  fontSize?: TypographyProps["fontSize"];
} & StackProps) {
  return (
    <Stack spacing={0} {...props}>
      <Heading
        as="h3"
        fontSize={fontSize}
        fontWeight="semibold"
        color="zinc.400"
      >
        {title}
      </Heading>
      <Text fontSize={fontSize}>{details}</Text>
    </Stack>
  );
}

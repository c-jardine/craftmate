import { Heading, Stack, type StackProps, Text } from "@chakra-ui/react";
import { type ReactNode } from "react";

export function Detail({
  title,
  details,
  ...props
}: {
  title: string;
  details: ReactNode;
} & StackProps) {
  return (
    <Stack spacing={0} {...props}>
      <Heading as="h3" fontSize="xs" fontWeight="semibold" color="zinc.400">
        {title}
      </Heading>
      <Text fontSize="xs">{details}</Text>
    </Stack>
  );
}

import { Heading, Stack, Text } from "@chakra-ui/react";
import { type ReactNode } from "react";

export function Detail({
  title,
  details,
}: {
  title: string;
  details: ReactNode;
}) {
  return (
    <Stack spacing={0}>
      <Heading as="h3" fontSize="xs" fontWeight="semibold" color="zinc.400">
        {title}
      </Heading>
      <Text fontSize="xs">{details}</Text>
    </Stack>
  );
}

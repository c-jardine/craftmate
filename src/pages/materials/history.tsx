import { Button, Icon, IconButton, Stack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { FaArrowLeft } from "react-icons/fa6";

import { PageHeader } from "~/components/page-header";
import { MaterialLogsTable } from "~/features/materials-history/components/material-logs-table";
import { withAuth } from "~/server/auth";

export default function MaterialHistory() {
  const router = useRouter();

  async function handleGoBack() {
    await router.push("/materials");
  }

  return (
    <Stack spacing={4} h="full">
      <PageHeader>
        <PageHeader.Content>
          <PageHeader.Title>Materials History</PageHeader.Title>
          <IconButton
            display={{ base: "flex", md: "none" }}
            icon={<Icon as={FaArrowLeft} />}
            aria-label="Back to materials"
            onClick={handleGoBack}
          />
          <Button
            display={{ base: "none", md: "flex" }}
            leftIcon={<Icon as={FaArrowLeft} />}
            onClick={handleGoBack}
          >
            Back to materials
          </Button>
        </PageHeader.Content>
      </PageHeader>
      <MaterialLogsTable />
    </Stack>
  );
}

export const getServerSideProps = withAuth();

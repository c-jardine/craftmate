import {
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Stack,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { FaHistory } from "react-icons/fa";
import { FaEllipsis } from "react-icons/fa6";

import { PageHeader } from "~/components/page-header";
import { CreateMaterialForm } from "~/features/materials/components/create-material-form";
import { ManageCategories } from "~/features/materials/components/manage-categories";
import { ManageVendors } from "~/features/materials/components/manage-vendors";
import { MaterialsTable } from "~/features/materials/components/materials-table";
import { withAuth } from "~/server/auth";

export default function Materials() {
  return (
    <Stack spacing={4} h="full">
      <PageHeader>
        <PageHeader.Content>
          <PageHeader.Title>Materials</PageHeader.Title>

          <Menu>
            <MenuButton as={IconButton} icon={<Icon as={FaEllipsis} />} />
            <MenuList>
              <MenuItem
                as={NextLink}
                href="/materials/history"
                icon={<Icon as={FaHistory} boxSize={4} />}
                fontSize="sm"
              >
                View history
              </MenuItem>
              <MenuDivider />
              <ManageVendors />
              <ManageCategories />
            </MenuList>
          </Menu>

          <CreateMaterialForm />
        </PageHeader.Content>
      </PageHeader>
      <MaterialsTable />
    </Stack>
  );
}

export const getServerSideProps = withAuth();

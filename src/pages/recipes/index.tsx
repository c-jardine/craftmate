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
import { CreateRecipeForm } from "~/features/recipes/components/create-recipe-form";
import { RecipesCards } from "~/features/recipes/components/recipes-cards";
import { RecipesTable } from "~/features/recipes/components/recipes-table";
import { withAuth } from "~/server/auth";

export default function Recipes() {
  return (
    <Stack spacing={4} h="full">
      <PageHeader>
        <PageHeader.Content>
          <PageHeader.Title>Recipes</PageHeader.Title>

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
              {/* <ManageCategories /> */}
            </MenuList>
          </Menu>

          <CreateRecipeForm />
        </PageHeader.Content>
      </PageHeader>
      <>
        <RecipesTable />
        <RecipesCards />
      </>
    </Stack>
  );
}

export const getServerSideProps = withAuth();

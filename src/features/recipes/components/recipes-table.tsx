import { Flex, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid
import { type ColDef } from "node_modules/ag-grid-community/dist/types/core/main";

import { api, type RouterOutputs } from "~/utils/api";
import PuffLoader from "react-spinners/PuffLoader";
import { Table } from "~/components/table";

// Table column type definition
export type RecipesTableRows = RouterOutputs["recipe"]["getAll"][0];
// & {
//   status: string;
// };

export function RecipesTable() {
  // Fetch materials query
  const { data: recipes, isLoading } = api.recipe.getAll.useQuery();

  const toast = useToast();

  const utils = api.useUtils();

  const [rowData, setRowData] = useState<RecipesTableRows[]>([]);

  // Update table data when the data is available
  useEffect(() => {
    if (recipes) {
      setRowData(
        recipes.map((recipe) => ({
          ...recipe,
          //   status: "Format status",
        }))
      );
    }
  }, [recipes]);

  const colDefs: ColDef<RecipesTableRows>[] = [
    {
      headerName: "Name",
      field: "name",
      filter: true,
      autoHeight: true,
      flex: 1,
      headerCheckboxSelection: true,
      checkboxSelection: true,
    },
  ];

  // Show spinner if query is loading
  if (isLoading) {
    return (
      <Flex justifyContent="center" alignItems="center" flexGrow={1}>
        <PuffLoader color="var(--chakra-colors-blue-500)" />
      </Flex>
    );
  }

  if (!recipes) {
    return null;
  }

  return (
    <Table<RecipesTableRows>
      rowData={rowData}
      columnDefs={colDefs}
    //   autoSizeStrategy={{
    //     type: "fitCellContents",
    //     colIds: ["status", "quantity", "minQuantity", "cost", "vendor"],
    //   }}
    //   onDelete={onDelete}
    />
  );
}

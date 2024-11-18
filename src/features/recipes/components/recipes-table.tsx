import { Flex, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid
import {
  ValueFormatterParams,
  type ColDef,
} from "node_modules/ag-grid-community/dist/types/core/main";

import { Prisma } from "@prisma/client";
import PuffLoader from "react-spinners/PuffLoader";
import { Table } from "~/components/table";
import { api, type RouterOutputs } from "~/utils/api";
import { formatCurrency } from "~/utils/currency";
import { Character } from "~/utils/text";
import { CostPerUnitRenderer } from "./cost-per-unit-renderer";
import { NameRenderer } from "./name-renderer";

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
      cellRenderer: NameRenderer,
    },
    {
      headerName: "Cost per unit",
      field: "id", // TODO: wrong field
      cellRenderer: CostPerUnitRenderer,
    },
    {
      headerName: "MSRP",
      field: "retailPrice",
      cellStyle: {
        display: "flex",
        alignItems: "center",
      },
      valueFormatter: (
        params: ValueFormatterParams<RecipesTableRows, Prisma.Decimal>
      ) => {
        if (!params.value || !params.data) {
          return Character.EM_DASH;
        }
        return `${formatCurrency(
          new Prisma.Decimal(params.value).toNumber()
        )} /${params.data.batchSizeUnit.abbrevSingular}`;
      },
    },
    {
      headerName: "Wholesale Price",
      field: "wholesalePrice",
      cellStyle: {
        display: "flex",
        alignItems: "center",
      },
      valueFormatter: (
        params: ValueFormatterParams<RecipesTableRows, Prisma.Decimal>
      ) => {
        if (!params.value || !params.data) {
          return Character.EM_DASH;
        }
        return `${formatCurrency(
          new Prisma.Decimal(params.value).toNumber()
        )} /${params.data.batchSizeUnit.abbrevSingular}`;
      },
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
      autoSizeStrategy={{
        type: "fitCellContents",
        colIds: ["id", "retailPrice", "wholesalePrice"],
      }}
      // onDelete={onDelete}
    />
  );
}
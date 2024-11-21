import { Flex } from "@chakra-ui/react";
import { type Prisma } from "@prisma/client";
import { useEffect, useState } from "react";

import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid
import {
  type ColDef,
  type ColGroupDef,
  type ValueFormatterParams,
} from "node_modules/ag-grid-community/dist/types/core/main";

import PuffLoader from "react-spinners/PuffLoader";
import { Table } from "~/components/table";
import { api, type RouterOutputs } from "~/utils/api";
import { formatCurrency } from "~/utils/currency";
import { formatMargin } from "~/utils/math";
import { toNumber } from "~/utils/prisma";
import { Character } from "~/utils/text";
import { CostPerUnitRenderer } from "./cost-per-unit-renderer";
import { NameRenderer } from "./name-renderer";

// Table column type definition
export type RecipesTableRows = RouterOutputs["recipe"]["getAll"][0];

export function RecipesTable() {
  // Fetch materials query
  const { data: recipes, isLoading } = api.recipe.getAll.useQuery();

  const [rowData, setRowData] = useState<RecipesTableRows[]>([]);

  // Update table data when the data is available
  useEffect(() => {
    if (recipes) {
      setRowData(
        recipes.map((recipe) => ({
          ...recipe,
        }))
      );
    }
  }, [recipes]);

  const colDefs: (ColDef<RecipesTableRows> | ColGroupDef<RecipesTableRows>)[] =
    [
      {
        headerName: "Name",
        field: "name",
        filter: true,
        autoHeight: true,
        flex: 1,
        minWidth: 250,
        headerCheckboxSelection: true,
        checkboxSelection: true,
        cellRenderer: NameRenderer,
      },
      {
        headerName: "Cost per unit",
        field: "costPerUnit",
        cellRenderer: CostPerUnitRenderer,
      },
      {
        headerName: "MSRP",
        children: [
          {
            headerName: "Price",
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
              return `${formatCurrency(toNumber(params.value))} /${
                params.data.batchSizeUnit.abbrevSingular
              }`;
            },
          },
          {
            headerName: "Margin",
            field: "retailMargin",
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
              return formatMargin(params.value);
            },
          },
        ],
      },
      {
        headerName: "Wholesale",
        children: [
          {
            headerName: "Price",
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
              return `${formatCurrency(toNumber(params.value))} /${
                params.data.batchSizeUnit.abbrevSingular
              }`;
            },
          },
          {
            headerName: "Margin",
            field: "wholesaleMargin",
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
              return formatMargin(params.value);
            },
          },
        ],
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
        colIds: [
          "costPerUnit",
          "retailPrice",
          "retailMargin",
          "wholesalePrice",
          "wholesaleMargin",
        ],
      }}
      containerProps={{
        display: { base: "none", md: "block" },
      }}
      // onDelete={onDelete}
    />
  );
}

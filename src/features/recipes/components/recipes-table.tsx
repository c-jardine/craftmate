import { type Prisma } from "@prisma/client";

import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid
import {
  type ColDef,
  type ColGroupDef,
  type ValueFormatterParams,
} from "node_modules/ag-grid-community/dist/types/core/main";

import { Table } from "~/components/table";
import { type RouterOutputs } from "~/utils/api";
import { Character, formatCurrency } from "~/utils/formatting";
import { formatMargin } from "~/utils/math";
import { toNumber } from "~/utils/prisma";
import { useDeleteRecipes } from "../hooks/use-delete-recipes";
import { NameRenderer } from "./name-renderer";

type RecipesData = RouterOutputs["recipe"]["getAll"];

// Table row data type.
export type RecipesRowDataType = RecipesData[0];

export function RecipesTable({
  recipes,
}: {
  recipes: RecipesData | undefined;
}) {
  // Get onDelete handler.
  const { onDelete } = useDeleteRecipes();

  if (!recipes) {
    return null;
  }

  // Define table columns.
  const colDefs: (
    | ColDef<RecipesRowDataType>
    | ColGroupDef<RecipesRowDataType>
  )[] = [
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
      headerName: "Cost of goods",
      marryChildren: true,
      children: [
        {
          headerName: "per unit",
          field: "cogsUnit",
          cellStyle: {
            display: "flex",
            alignItems: "center",
          },
          valueFormatter: (
            params: ValueFormatterParams<RecipesRowDataType, Prisma.Decimal>
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
          headerName: "per batch",
          field: "cogsBatch",
          cellStyle: {
            display: "flex",
            alignItems: "center",
          },
          valueFormatter: (
            params: ValueFormatterParams<RecipesRowDataType, Prisma.Decimal>
          ) => {
            if (!params.value || !params.data) {
              return Character.EM_DASH;
            }
            return `${formatCurrency(toNumber(params.value))} /${
              params.data.batchSizeUnit.abbrevSingular
            }`;
          },
        },
      ],
    },
    {
      headerName: "MSRP",
      marryChildren: true,
      children: [
        {
          headerName: "Price",
          field: "retailPrice",
          cellStyle: {
            display: "flex",
            alignItems: "center",
          },
          valueFormatter: (
            params: ValueFormatterParams<RecipesRowDataType, Prisma.Decimal>
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
            params: ValueFormatterParams<RecipesRowDataType, Prisma.Decimal>
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
      marryChildren: true,
      children: [
        {
          headerName: "Price",
          field: "wholesalePrice",
          cellStyle: {
            display: "flex",
            alignItems: "center",
          },
          valueFormatter: (
            params: ValueFormatterParams<RecipesRowDataType, Prisma.Decimal>
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
            params: ValueFormatterParams<RecipesRowDataType, Prisma.Decimal>
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

  return (
    <Table<RecipesRowDataType>
      rowData={recipes}
      columnDefs={colDefs}
      autoSizeStrategy={{
        type: "fitCellContents",
        colIds: [
          "cogsUnit",
          "cogsBatch",
          "retailPrice",
          "retailMargin",
          "wholesalePrice",
          "wholesaleMargin",
        ],
      }}
      containerProps={{
        display: { base: "none", md: "block" },
      }}
      onDelete={onDelete}
    />
  );
}

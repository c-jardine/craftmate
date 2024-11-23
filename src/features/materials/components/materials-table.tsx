import { type Prisma, type Vendor } from "@prisma/client";

import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid
import {
  type ColDef,
  type ValueFormatterParams,
} from "node_modules/ag-grid-community/dist/types/core/main";

import { Table } from "~/components/table";
import { type RouterOutputs } from "~/utils/api";
import {
  Character,
  formatCurrency,
  formatQuantityWithUnitAbbrev,
} from "~/utils/formatting";
import { toNumber } from "~/utils/prisma";
import { useDeleteMaterials } from "../hooks/use-delete-materials";
import { AvailabilityRenderer } from "./availability-renderer";
import { NameRenderer } from "./name-renderer";
import { QuantityRenderer } from "./quantity-renderer";

type MaterialsData = RouterOutputs["material"]["getAll"];

// Table row data type.
export type MaterialsRowDataType = MaterialsData[0];

export function MaterialsTable({
  materials,
}: {
  materials: MaterialsData | undefined;
}) {
  // Get onDelete handler.
  const { onDelete } = useDeleteMaterials();

  if (!materials) {
    return null;
  }

  // Define table columns.
  const colDefs: ColDef<MaterialsRowDataType>[] = [
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
      headerName: "Availability",
      field: "availability",
      cellRenderer: AvailabilityRenderer,
      cellStyle: {
        display: "flex",
        alignItems: "center",
      },
    },
    {
      headerName: "Quantity",
      field: "quantity",
      cellRenderer: QuantityRenderer,
      cellStyle: {
        display: "flex",
        alignItems: "center",
      },
    },
    {
      headerName: "Min. quantity",
      field: "minQuantity",
      cellStyle: {
        display: "flex",
        alignItems: "center",
      },
      valueFormatter: (
        params: ValueFormatterParams<MaterialsRowDataType, Prisma.Decimal>
      ) => {
        if (!params.value || !params.data) {
          return Character.EM_DASH;
        }
        return formatQuantityWithUnitAbbrev({
          quantity: params.value,
          quantityUnit: params.data.quantityUnit,
        });
      },
    },
    {
      headerName: "Cost",
      field: "cost",
      cellStyle: {
        display: "flex",
        alignItems: "center",
      },
      valueFormatter: (
        params: ValueFormatterParams<MaterialsRowDataType, Prisma.Decimal>
      ) => {
        if (!params.value || !params.data) {
          return Character.EM_DASH;
        }
        return `${formatCurrency(toNumber(params.value))} /${
          params.data.quantityUnit.abbrevSingular
        }`;
      },
    },
    {
      headerName: "Vendor",
      field: "vendor",
      filter: true,
      cellStyle: {
        display: "flex",
        alignItems: "center",
      },
      valueFormatter: (
        params: ValueFormatterParams<MaterialsRowDataType, Vendor>
      ) => {
        if (!params.value) {
          return Character.EM_DASH;
        }

        return params.value.name;
      },
    },
  ];

  return (
    <Table<MaterialsRowDataType>
      rowData={materials}
      columnDefs={colDefs}
      autoSizeStrategy={{
        type: "fitCellContents",
        colIds: ["status", "quantity", "minQuantity", "cost", "vendor"],
      }}
      onDelete={onDelete}
      containerProps={{
        display: { base: "none", md: "block" },
      }}
    />
  );
}

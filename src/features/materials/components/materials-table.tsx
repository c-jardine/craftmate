import { Flex } from "@chakra-ui/react";
import { type Prisma, type Vendor } from "@prisma/client";
import { useEffect, useState } from "react";
import PuffLoader from "react-spinners/PuffLoader";

import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid
import {
  type ColDef,
  type ValueFormatterParams,
} from "node_modules/ag-grid-community/dist/types/core/main";

import { Table } from "~/components/table";
import { api, type RouterOutputs } from "~/utils/api";
import {
  Character,
  formatCurrency,
  formatQuantityWithUnitAbbrev,
} from "~/utils/formatting";
import { toNumber } from "~/utils/prisma";
import { useDeleteMaterials } from "../hooks/use-delete-materials";
import { NameRenderer } from "./name-renderer";
import { QuantityRenderer } from "./quantity-renderer";
import { StatusRenderer } from "./status-renderer";

// Table column type definition.
export type MaterialsTableRows = RouterOutputs["material"]["getAll"][0] & {
  status: string;
};

export function MaterialsTable() {
  // Fetch materials query.
  const { data: materials, isLoading } = api.material.getAll.useQuery();

  // Initialize row data.
  const [rowData, setRowData] = useState<MaterialsTableRows[]>([]);
  useEffect(() => {
    if (materials) {
      setRowData(
        materials.map((material) => ({
          ...material,
          status: "Format status",
        }))
      );
    }
  }, [materials]);

  // Get onDelete handler.
  const { onDelete } = useDeleteMaterials();

  // Define table columns.
  const colDefs: ColDef<MaterialsTableRows>[] = [
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
      headerName: "Status",
      field: "status",
      cellRenderer: StatusRenderer,
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
        params: ValueFormatterParams<MaterialsTableRows, Prisma.Decimal>
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
        params: ValueFormatterParams<MaterialsTableRows, Prisma.Decimal>
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
        params: ValueFormatterParams<MaterialsTableRows, Vendor>
      ) => {
        if (!params.value) {
          return Character.EM_DASH;
        }

        return params.value.name;
      },
    },
  ];

  // Show spinner if query is loading.
  if (isLoading) {
    return (
      <Flex justifyContent="center" alignItems="center" flexGrow={1}>
        <PuffLoader color="var(--chakra-colors-blue-500)" />
      </Flex>
    );
  }

  if (!materials) {
    return null;
  }

  return (
    <Table<MaterialsTableRows>
      rowData={rowData}
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

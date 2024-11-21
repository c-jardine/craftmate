import {
  type ColDef,
  type ColGroupDef,
} from "node_modules/ag-grid-community/dist/types/core/main";

import { Table } from "~/components/table";
import { formatCurrency } from "~/utils/currency";
import { formatQuantityWithUnitAbbrev } from "~/utils/formatQuantity";
import { toNumber } from "~/utils/prisma";
import { Character } from "~/utils/text";
import { type RecipesTableRows } from "./recipes-table";

export function RecipeMaterialsTable({
  batchSize,
  materials,
}: RecipesTableRows) {
  type RecipeMaterialsRows = {
    name: string;
    batchQuantity: string;
    batchCost: string;
    unitQuantity: string;
    unitCost: string;
  };

  const rowData = materials.map(({ quantity, quantityUnit, material }) => ({
    name: material.name,
    batchQuantity: formatQuantityWithUnitAbbrev({
      quantity,
      quantityUnit,
    }),
    batchCost: material.cost
      ? formatCurrency(toNumber(quantity.times(material.cost)), {
          minimumFractionDigits: 4,
          maximumFractionDigits: 4,
        })
      : Character.EM_DASH,
    unitQuantity: formatQuantityWithUnitAbbrev({
      quantity: quantity.div(batchSize),
      quantityUnit,
    }),
    unitCost: material.cost
      ? formatCurrency(
          quantity.div(batchSize).times(material.cost).toNumber(),
          {
            minimumFractionDigits: 4,
            maximumFractionDigits: 4,
          }
        )
      : Character.EM_DASH,
  }));

  const colDefs: (
    | ColDef<RecipeMaterialsRows>
    | ColGroupDef<RecipeMaterialsRows>
  )[] = [
    {
      headerName: "Material",
      field: "name",
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: "Per item",
      marryChildren: true,
      children: [
        {
          headerName: "Quantity",
          field: "unitQuantity",
        },
        {
          headerName: "Cost",
          field: "unitCost",
        },
      ],
    },
    {
      headerName: "Per batch",
      marryChildren: true,
      children: [
        {
          headerName: "Quantity",
          field: "batchQuantity",
        },
        {
          headerName: "Cost",
          field: "batchCost",
        },
      ],
    },
  ];

  return (
    <Table<RecipeMaterialsRows>
      rowData={rowData}
      columnDefs={colDefs}
      autoSizeStrategy={{
        type: "fitCellContents",
        colIds: ["batchQuantity", "batchCost", "unitQuantity", "unitCost"],
      }}
      containerProps={{
        display: { base: "none", md: "block" },
        h: "full",
        minH: 64,
      }}
    />
  );
}

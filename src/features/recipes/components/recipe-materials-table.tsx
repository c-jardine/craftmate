import { Prisma } from "@prisma/client";

import { type ColDef } from "node_modules/ag-grid-community/dist/types/core/main";

import { Table } from "~/components/table";
import { formatCurrency } from "~/utils/currency";
import { formatQuantityWithUnitAbbrev } from "~/utils/formatQuantity";
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
      ? formatCurrency(
          new Prisma.Decimal(quantity)
            .times(new Prisma.Decimal(material.cost))
            .toNumber(),
          {
            minimumFractionDigits: 4,
            maximumFractionDigits: 4,
          }
        )
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

  const colDefs: ColDef<RecipeMaterialsRows>[] = [
    {
      headerName: "Material",
      field: "name",
      flex: 1,
    },
    {
      headerName: "Batch quantity",
      field: "batchQuantity",
    },
    {
      headerName: "Batch cost",
      field: "batchCost",
    },
    {
      headerName: "Unit quantity",
      field: "unitQuantity",
    },
    {
      headerName: "Unit cost",
      field: "unitCost",
    },
  ];

  return (
    <Table<RecipeMaterialsRows>
      rowData={rowData}
      columnDefs={colDefs}
      autoSizeStrategy={{
        type: "fitCellContents",
        colIds: [
          "name",
          "batchQuantity",
          "batchCost",
          "unitQuantity",
          "unitCost",
        ],
      }}
      containerProps={{
        display: { base: "none", md: "block" },
        h: "full",
        minH: 64,
      }}
    />
  );
}

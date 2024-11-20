import { type CustomCellRendererProps } from "ag-grid-react";

import { type MaterialsTableRows } from "./materials-table";
import { QuantityEditor } from "./quantity-editor";

export function QuantityRenderer({
  node,
}: CustomCellRendererProps<MaterialsTableRows>) {
  if (!node.data) {
    return null;
  }

  return <QuantityEditor {...node.data} />;
}

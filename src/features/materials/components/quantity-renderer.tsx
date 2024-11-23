import { type CustomCellRendererProps } from "ag-grid-react";

import { type MaterialsRowDataType } from "./materials-table";
import { QuantityEditor } from "./quantity-editor";

export function QuantityRenderer({
  node,
}: CustomCellRendererProps<MaterialsRowDataType>) {
  if (!node.data) {
    return null;
  }

  return <QuantityEditor {...node.data} />;
}

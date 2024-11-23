import { type CustomCellRendererProps } from "ag-grid-react";

import { Character } from "~/utils/formatting";
import { type MaterialsRowDataType } from "./materials-table";
import { StatusIndicator } from "./status-indicator";

export function StatusRenderer({
  node,
}: CustomCellRendererProps<MaterialsRowDataType>) {
  if (!node.data?.minQuantity) {
    return Character.EM_DASH;
  }

  return <StatusIndicator {...node.data} />;
}

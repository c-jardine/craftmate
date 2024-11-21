import { type CustomCellRendererProps } from "ag-grid-react";

import { Character } from "~/utils/formatting";
import { type MaterialsTableRows } from "./materials-table";
import { StatusIndicator } from "./status-indicator";

export function StatusRenderer({
  node,
}: CustomCellRendererProps<MaterialsTableRows>) {
  if (!node.data?.minQuantity) {
    return Character.EM_DASH;
  }

  return <StatusIndicator {...node.data} />;
}

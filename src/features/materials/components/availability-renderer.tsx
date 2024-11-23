import { type CustomCellRendererProps } from "ag-grid-react";

import { Character } from "~/utils/formatting";
import { AvailabilityIndicator } from "./availability-indicator";
import { type MaterialsRowDataType } from "./materials-table";

export function AvailabilityRenderer({
  node,
}: CustomCellRendererProps<MaterialsRowDataType>) {
  if (!node.data?.minQuantity) {
    return Character.EM_DASH;
  }

  return <AvailabilityIndicator {...node.data} />;
}

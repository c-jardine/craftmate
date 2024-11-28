import { type Prisma } from "@prisma/client";
import { Character } from "./formatting";

export function calculateMargin({
  revenue,
  costOfGoods,
}: {
  revenue: Prisma.Decimal | null | undefined;
  costOfGoods: Prisma.Decimal | null | undefined;
}) {
  if (!revenue || !costOfGoods) {
    return null;
  }

  // Calculate the margin.
  const margin = revenue ? revenue.minus(costOfGoods).div(revenue) : undefined;

  return margin;
}

export function formatMargin(margin: Prisma.Decimal | null | undefined) {
  if (!margin) {
    return Character.EM_DASH;
  }

  // Format the margin for display.
  const marginFormatted = Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(margin.toNumber());

  return marginFormatted;
}

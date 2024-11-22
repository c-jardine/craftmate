import type { MaterialQuantityUpdateAction, Prisma } from "@prisma/client";
import { type QuantityStatus } from "~/types/quantity";

interface CalculateAdjustedQuantityOptions {
  /** The original quantity. */
  previousQuantity: Prisma.Decimal;
  /** The amount to adjust the original quantity by. */
  adjustmentAmount: Prisma.Decimal;
  /**
   * The action to take when adjusting the quantity. Can be "DECREASE", "SET",
   * or "INCREASE".
   */
  action: MaterialQuantityUpdateAction;
}

/**
 * Calculate the adjusted quantity based on the adjustment action type.
 *
 * @param options The options for the function.
 * @returns The adjusted quantity.
 */
export function calculateAdjustedQuantity({
  previousQuantity,
  adjustmentAmount,
  action,
}: CalculateAdjustedQuantityOptions): Prisma.Decimal | null {
  if (!previousQuantity) {
    return null;
  }

  if (!adjustmentAmount) {
    return previousQuantity;
  }

  const prev = previousQuantity;
  const adj = adjustmentAmount;

  switch (action) {
    case "DECREASE":
      return prev.sub(adj);
    case "SET":
      return adj;
    case "INCREASE":
      return prev.add(adj);
    default:
      return prev;
  }
}

function calculateStockStatus(
  quantity: Prisma.Decimal | null,
  minQuantity: Prisma.Decimal | null
): QuantityStatus {
  if (!quantity || !minQuantity) {
    return null;
  }

  if (quantity.equals(0)) {
    return "Out of stock";
  }

  // const ratio = quantity.div(minQuantity);
  // if (ratio.lessThanOrEqualTo(0.5)) {
  //   return "Low stock";
  // }
  if (quantity.lessThan(minQuantity)) {
    return "Low stock";
  }

  return "Available";
}

/**
 * Get the stock status.
 * @param quantity The current stock.
 * @param minQuantity The minimum stock.
 * @returns The stock status.
 */
export function getStockStatus(
  quantity: Prisma.Decimal | null,
  minQuantity: Prisma.Decimal | null
) {
  return calculateStockStatus(quantity, minQuantity);
}

import { Availability, type Prisma, type QuantityUnit } from "@prisma/client";

export const Character = {
  EM_DASH: "—",
};

export function removeCommas(value: string) {
  return value.replace(/,/g, "");
}

export function formatCurrency(
  amount: number,
  options?: Intl.NumberFormatOptions
) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    ...options,
  }).format(amount);
}

interface FormatQuantityWithUnitOptions {
  /** The quantity, used to determine if the unit should be singular or plural. */
  quantity: Prisma.Decimal;
  /** The quantity unit object. */
  quantityUnit: QuantityUnit;
  /**
   * The style in which the units should be displayed. "name" is generally the
   * full, plural form. "full" is the full unit name (ounce, ounces, etc.).
   * "abbreviation" is the abbreviated form (lbs., fl. oz., etc.).
   */
  style: "name" | "full" | "abbreviation";
}

/**
 * Get a string representation of a quantity and unit (1 lb., 7 lbs., 12 fluid
 * ounces, etc.).
 *
 * @param options - The options for the function.
 * @returns A string representation the quantity and units.
 */
export function formatQuantityWithUnit(options: FormatQuantityWithUnitOptions) {
  const { quantity, quantityUnit, style } = options;
  if (!quantity) {
    return null;
  }

  const q = quantity;

  if (style === "name") {
    return quantityUnit.name;
  }

  if (q.equals(1)) {
    if (style === "full") {
      return quantityUnit.singular;
    }
    return quantityUnit.abbrevSingular;
  }

  if (style === "full") {
    return quantityUnit.plural;
  }
  return quantityUnit.abbrevPlural;
}

interface FormatQuantityWithUnitAbbrevOptions {
  /** The quantity, used to determine if the unit should be singular or plural. */
  quantity: Prisma.Decimal | null;
  /** The quantity unit object. */
  quantityUnit: QuantityUnit;
}

/**
 * Get the quantity text with abbreviated units (12 fl. oz.).
 *
 * @param options - The options for the function.
 * @returns A string representation of the quantity and units.
 */
export function formatQuantityWithUnitAbbrev(
  options: FormatQuantityWithUnitAbbrevOptions
) {
  if (!options.quantity) {
    return Character.EM_DASH;
  }

  const quantityUnitText = formatQuantityWithUnit({
    quantity: options.quantity,
    quantityUnit: options.quantityUnit,
    style: "abbreviation",
  });

  return `${options.quantity.toString()} ${quantityUnitText}`;
}

export function formatAvailability(availability: Availability) {
  switch (availability) {
    case Availability.AVAILABLE:
      return "Available";
    case Availability.LOW_STOCK:
      return "Low stock";
    case Availability.OUT_OF_STOCK:
      return "Out of stock";
    default:
      return Character.EM_DASH;
  }
}

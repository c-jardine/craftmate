import { Prisma } from "@prisma/client";

export function toNumber(decimalValue: Prisma.Decimal) {
  return decimalValue.toNumber();
}

export function toDecimal(value: string | number) {
  return new Prisma.Decimal(value);
}

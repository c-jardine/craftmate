import { Prisma } from "@prisma/client";

export function toNumber(decimalValue: Prisma.Decimal | null | undefined) {
  return decimalValue ? decimalValue.toNumber() : undefined;
}

export function toDecimal(value: string | number) {
  return new Prisma.Decimal(value);
}

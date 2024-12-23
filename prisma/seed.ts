import {
  type QuantityUnit,
  MaterialQuantityUpdateAction,
  type MaterialQuantityUpdateType,
} from "@prisma/client";
import { db } from "~/server/db";

const quantityUnits: Omit<QuantityUnit, "id">[] = [
  {
    group: "Length",
    name: "Inches",
    singular: "Inch",
    plural: "Inches",
    abbrevSingular: "in.",
    abbrevPlural: "in.",
  },
  {
    group: "Length",
    name: "Feet",
    singular: "Foot",
    plural: "Feet",
    abbrevSingular: "ft.",
    abbrevPlural: "ft.",
  },
  {
    group: "Length",
    name: "Yards",
    singular: "Yard",
    plural: "Yards",
    abbrevSingular: "yd.",
    abbrevPlural: "yd.",
  },
  {
    group: "Length",
    name: "Centimeters",
    singular: "Centimeter",
    plural: "Centimeters",
    abbrevSingular: "cm.",
    abbrevPlural: "cm.",
  },
  {
    group: "Length",
    name: "Meters",
    singular: "Meter",
    plural: "Meters",
    abbrevSingular: "m.",
    abbrevPlural: "m.",
  },
  {
    group: "Weight",
    name: "Ounces",
    singular: "Ounce",
    plural: "Ounces",
    abbrevSingular: "oz.",
    abbrevPlural: "oz.",
  },
  {
    group: "Weight",
    name: "Pounds",
    singular: "Pound",
    plural: "Pounds",
    abbrevSingular: "lb.",
    abbrevPlural: "lbs.",
  },
  {
    group: "Weight",
    name: "Grams",
    singular: "Gram",
    plural: "Grams",
    abbrevSingular: "g.",
    abbrevPlural: "g.",
  },
  {
    group: "Weight",
    name: "Kilograms",
    singular: "Kilogram",
    plural: "Kilograms",
    abbrevSingular: "kg.",
    abbrevPlural: "kg.",
  },
  {
    group: "Volume",
    name: "Fluid ounces",
    singular: "Fluid ounce",
    plural: "Fluid ounces",
    abbrevSingular: "fl. oz.",
    abbrevPlural: "fl. oz.",
  },
  {
    group: "Volume",
    name: "Pints",
    singular: "Pint",
    plural: "Pints",
    abbrevSingular: "pt.",
    abbrevPlural: "pts.",
  },
  {
    group: "Volume",
    name: "Quarts",
    singular: "Quart",
    plural: "Quarts",
    abbrevSingular: "qt.",
    abbrevPlural: "qts.",
  },
  {
    group: "Volume",
    name: "Gallons",
    singular: "Gallon",
    plural: "Gallons",
    abbrevSingular: "gal.",
    abbrevPlural: "gal.",
  },
  {
    group: "Volume",
    name: "Milliliters",
    singular: "Milliliter",
    plural: "Milliliters",
    abbrevSingular: "ml.",
    abbrevPlural: "ml.",
  },
  {
    group: "Volume",
    name: "Liters",
    singular: "Liter",
    plural: "Liters",
    abbrevSingular: "l.",
    abbrevPlural: "l.",
  },
  {
    group: "Volume",
    name: "Cubic inches",
    singular: "Cubic inch",
    plural: "Cubic inches",
    abbrevSingular: "cu. in.",
    abbrevPlural: "cu. in.",
  },
  {
    group: "Volume",
    name: "Cubic feet",
    singular: "Cubic foot",
    plural: "Cubic feet",
    abbrevSingular: "cu. ft.",
    abbrevPlural: "cu. ft.",
  },
  {
    group: "Volume",
    name: "Board feet",
    singular: "Board foot",
    plural: "Board feet",
    abbrevSingular: "bd ft.",
    abbrevPlural: "bd ft.",
  },
  {
    group: "Area",
    name: "Square inches",
    singular: "Square inch",
    plural: "Square inches",
    abbrevSingular: "sq. in.",
    abbrevPlural: "sq. in.",
  },
  {
    group: "Area",
    name: "Square feet",
    singular: "Square foot",
    plural: "Square feet",
    abbrevSingular: "sq. ft.",
    abbrevPlural: "sq. ft.",
  },
  {
    group: "Area",
    name: "Square yards",
    singular: "Square yard",
    plural: "Square yards",
    abbrevSingular: "sq. yd.",
    abbrevPlural: "sq. yd.",
  },
  {
    group: "Area",
    name: "Square centimeters",
    singular: "Square centimeter",
    plural: "Square centimeters",
    abbrevSingular: "sq. cm.",
    abbrevPlural: "sq. cm.",
  },
  {
    group: "Area",
    name: "Square meters",
    singular: "Square meter",
    plural: "Square meters",
    abbrevSingular: "sq. m.",
    abbrevPlural: "sq. m.",
  },
  {
    group: "Count",
    name: "Pieces",
    singular: "Piece",
    plural: "Pieces",
    abbrevSingular: "pc.",
    abbrevPlural: "pcs.",
  },
  {
    group: "Count",
    name: "Pairs",
    singular: "Pair",
    plural: "Pairs",
    abbrevSingular: "pair",
    abbrevPlural: "pairs",
  },
  {
    group: "Count",
    name: "Sets",
    singular: "Set",
    plural: "Sets",
    abbrevSingular: "set",
    abbrevPlural: "sets",
  },
  {
    group: "Count",
    name: "Dozen",
    singular: "Dozen",
    plural: "Dozen",
    abbrevSingular: "doz.",
    abbrevPlural: "doz.",
  },
  {
    group: "Count",
    name: "Reams",
    singular: "Ream",
    plural: "Reams",
    abbrevSingular: "ream",
    abbrevPlural: "reams",
  },
  {
    group: "Miscellaneous",
    name: "Sheets",
    singular: "Sheet",
    plural: "Sheets",
    abbrevSingular: "sheet",
    abbrevPlural: "sheets",
  },
  {
    group: "Miscellaneous",
    name: "Rolls",
    singular: "Roll",
    plural: "Rolls",
    abbrevSingular: "roll",
    abbrevPlural: "rolls",
  },
  {
    group: "Miscellaneous",
    name: "Spools",
    singular: "Spool",
    plural: "Spools",
    abbrevSingular: "spool",
    abbrevPlural: "spools",
  },
  {
    group: "Miscellaneous",
    name: "Skeins",
    singular: "Skein",
    plural: "Skeins",
    abbrevSingular: "skein",
    abbrevPlural: "skeins",
  },
  {
    group: "Miscellaneous",
    name: "Carats",
    singular: "Carat",
    plural: "Carats",
    abbrevSingular: "ct.",
    abbrevPlural: "cts.",
  },
  {
    group: "Miscellaneous",
    name: "Tubs",
    singular: "Tub",
    plural: "Tubs",
    abbrevSingular: "tub",
    abbrevPlural: "tubs",
  },
];

const materialQuantityUpdateTypes: Omit<MaterialQuantityUpdateType, "id">[] = [
  { type: "Audit", action: MaterialQuantityUpdateAction.SET, color: "indigo" },
  {
    type: "Purchase order",
    action: MaterialQuantityUpdateAction.INCREASE,
    color: "emerald",
  },
  {
    type: "Product testing",
    action: MaterialQuantityUpdateAction.DECREASE,
    color: "red",
  },
];

async function main() {
  await Promise.all(
    quantityUnits.map(
      async (unit) =>
        await db.quantityUnit.upsert({
          where: {
            name: unit.name,
          },
          create: unit,
          update: {},
        })
    )
  );

  await Promise.all(
    materialQuantityUpdateTypes.map(
      async (updateType) =>
        await db.materialQuantityUpdateType.upsert({
          where: {
            type: updateType.type,
          },
          create: updateType,
          update: {},
        })
    )
  );
}

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });

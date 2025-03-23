import { MAX_YIELD } from "~/lib/constants";

export function calcNewYield(
  currYield: number,
  addedYield: number,
  operator: "add" | "subtract",
): number {
  if (operator === "add") {
    const newYield =
      currYield + addedYield > MAX_YIELD ? MAX_YIELD : currYield + addedYield;
    return newYield;
  } else {
    const newYield = currYield - addedYield < 0 ? 0 : currYield - addedYield;
    return newYield;
  }
}

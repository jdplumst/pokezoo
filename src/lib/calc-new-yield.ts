import { MAX_YIELD } from "~/lib/constants";

export function calcNewYield(currYield: number, addedYield: number): number {
  const newYield =
    currYield + addedYield > MAX_YIELD ? MAX_YIELD : currYield + addedYield;
  return newYield;
}

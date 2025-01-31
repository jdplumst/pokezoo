import { MAX_YIELD } from "@/utils/constants";

export function calcNewYield(currYield: number, addedYield: number): number {
  const newYield =
    currYield + addedYield > MAX_YIELD ? MAX_YIELD : currYield + addedYield;
  return newYield;
}

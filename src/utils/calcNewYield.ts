import { MAX_YIELD } from "../constants";

export function calcNewYield(currYield: number, addedYield: number) {
  const newYield =
    currYield + addedYield > MAX_YIELD ? MAX_YIELD : currYield + addedYield;
  return newYield;
}

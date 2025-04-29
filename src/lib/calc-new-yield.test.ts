import { describe, expect, it } from "vitest";
import { calcNewYield } from "./calc-new-yield";
import { MAX_YIELD } from "./constants";

describe("calc new yield", () => {
  it("add", () => {
    expect(calcNewYield(100, 20, "add")).toBe(120);
  });

  it("add, currYield is max yield", () => {
    expect(calcNewYield(MAX_YIELD, 1, "add")).toBe(MAX_YIELD);
  });

  it("add, addedYield is max yield", () => {
    expect(calcNewYield(1, MAX_YIELD, "add")).toBe(MAX_YIELD);
  });

  it("add, both currYield and addedYield are max yield", () => {
    expect(calcNewYield(MAX_YIELD, MAX_YIELD, "add")).toBe(MAX_YIELD);
  });

  it("subtract, currYield > addedYield", () => {
    expect(calcNewYield(100, 20, "subtract")).toBe(80);
  });

  it("subtract, currYield === addedYield", () => {
    expect(calcNewYield(100, 100, "subtract")).toBe(0);
  });

  it("subtract, currYield < addedYield", () => {
    expect(calcNewYield(20, 100, "subtract")).toBe(0);
  });
});

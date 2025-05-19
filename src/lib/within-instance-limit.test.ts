import { describe, expect, it } from "vitest";
import { withinInstanceLimit } from "~/lib/within-instance-limit";

describe("within instance limit", () => {
  it("within limit, no catching charm", () => {
    expect(withinInstanceLimit(1999, false)).toBe(true);
  });

  it("at limit, no catching charm", () => {
    expect(withinInstanceLimit(2000, false)).toBe(true);
  });

  it("beyond limit, no catching charm", () => {
    expect(withinInstanceLimit(2001, false)).toBe(false);
  });

  it("within limit, has catching charm", () => {
    expect(withinInstanceLimit(2999, true)).toBe(true);
  });

  it("at limit, has catching charm", () => {
    expect(withinInstanceLimit(3000, true)).toBe(true);
  });

  it("beyond limit, has catching charm", () => {
    expect(withinInstanceLimit(3001, true)).toBe(false);
  });
});

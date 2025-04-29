import { describe, expect, it } from "vitest";
import { getRarityColor } from "./get-rarity-color";

describe("get rarity color", () => {
  it("common", () => {
    expect(getRarityColor("Common")).toBe(
      "bg-common-unfocus hover:bg-common-focus shadow-common-focus",
    );
  });

  it("rare", () => {
    expect(getRarityColor("Rare")).toBe(
      "bg-rare-unfocus hover:bg-rare-focus shadow-rare-focus",
    );
  });

  it("epic", () => {
    expect(getRarityColor("Epic")).toBe(
      "bg-epic-unfocus hover:bg-epic-focus shadow-epic-focus",
    );
  });

  it("legendary", () => {
    expect(getRarityColor("Legendary")).toBe(
      "bg-legendary-unfocus hover:bg-legendary-focus shadow-legendary-focus",
    );
  });

  it("mega", () => {
    expect(getRarityColor("Mega")).toBe(
      "bg-mega-unfocus hover:bg-mega-focus shadow-mega-focus",
    );
  });

  it("ultra beast", () => {
    expect(getRarityColor("Ultra Beast")).toBe(
      "bg-ub-unfocus hover:bg-ub-focus shadow-ub-focus",
    );
  });

  it("gigantamax", () => {
    expect(getRarityColor("Gigantamax")).toBe(
      "bg-gmax-unfocus hover:bg-gmax-focus shadow-gmax-focus",
    );
  });

  it("paradox", () => {
    expect(getRarityColor("Paradox")).toBe(
      "bg-paradox-unfocus hover:bg-paradox-focus shadow-paradox-focus",
    );
  });
});

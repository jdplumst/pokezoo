import { type Rarity } from "~/lib/types";

export function getRarityColor(rarity: Rarity) {
  switch (rarity) {
    case "Common":
      return "bg-common-unfocus hover:bg-common-focus shadow-common-focus";
    case "Rare":
      return "bg-rare-unfocus hover:bg-rare-focus shadow-rare-focus";
    case "Epic":
      return "bg-epic-unfocus hover:bg-epic-focus shadow-epic-focus";
    case "Legendary":
      return "bg-legendary-unfocus hover:bg-legendary-focus shadow-legendary-focus";
    case "Mega":
      return "bg-mega-unfocus hover:bg-mega-focus shadow-mega-focus";
    case "Ultra Beast":
      return "bg-ub-unfocus hover:bg-ub-focus shadow-ub-focus";
    case "Gigantamax":
      return "bg-gmax-unfocus hover:bg-gmax-focus shadow-gmax-focus";
    case "Paradox":
      return "bg-paradox-unfocus hover:bg-paradox-focus shadow-paradox-focus";
  }
}

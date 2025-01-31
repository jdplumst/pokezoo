import { type ZodRarity } from "@/src/zod";
import { type z } from "zod";

interface IWildcardProps {
  wildcard: z.infer<typeof ZodRarity>;
  width: number;
  height: number;
}

export default function Wildcard({ wildcard, width, height }: IWildcardProps) {
  switch (wildcard) {
    case "Common":
      return (
        <img
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/iron-plate.png"
          alt="common-wildcard"
          height={height}
          width={width}
          className="pixelated"
        />
      );
    case "Rare":
      return (
        <img
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/fist-plate.png"
          alt="rare-wildcard"
          height={height}
          width={width}
          className="pixelated"
        />
      );
    case "Epic":
      return (
        <img
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/toxic-plate.png"
          alt="epic-wildcard"
          height={height}
          width={width}
          className="pixelated"
        />
      );
    case "Legendary":
      return (
        <img
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/meadow-plate.png"
          alt="legendary-wildcard"
          height={height}
          width={width}
          className="pixelated"
        />
      );
    default:
      return <></>;
  }
}

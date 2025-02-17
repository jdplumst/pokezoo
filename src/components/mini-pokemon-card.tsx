import { type Rarity } from "~/lib/types";
import Image from "next/image";
import { getRarityColor } from "~/lib/get-rarity-color";

export default function MiniPokemonCard(props: {
  name: string;
  img: string;
  shiny: boolean;
  rarity: Rarity;
  selected?: boolean;
}) {
  return (
    <div
      className={`${props.selected ? "border-4 border-yellow-400" : "border-2 border-black"} flex h-40 w-full flex-col items-center gap-2 border-solid p-4 ${getRarityColor(props.rarity)}`}
    >
      <Image
        src={props.img}
        alt={props.name}
        width={80}
        height={80}
        className="pixelated"
      />
      <div className="text-center font-semibold capitalize">
        {props.shiny && "🌟 "}
        {props.name}
      </div>
    </div>
  );
}

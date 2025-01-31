import { type z } from "zod";
import { type ZodRarity } from "@/utils/zod";
import Image from "next/image";

export default function MiniPokemonCard(props: {
  name: string;
  img: string;
  shiny: boolean;
  rarity: z.infer<typeof ZodRarity>;
  selected?: boolean;
}) {
  return (
    <div
      className={`${props.selected ? "border-4 border-yellow-400" : "border-2 border-black"} flex h-40 w-full flex-col items-center gap-2 border-solid p-4 ${props.rarity === "Common" && "bg-common-unfocus hover:bg-common-focus"} ${props.rarity === "Rare" && "bg-rare-unfocus hover:bg-rare-focus"} ${props.rarity === "Epic" && "bg-epic-unfocus hover:bg-epic-focus"} ${props.rarity === "Legendary" && "bg-legendary-unfocus hover:bg-legendary-focus"} ${props.rarity === "Mega" && "bg-mega-unfocus hover:bg-mega-focus"} ${props.rarity === "Ultra Beast" && "bg-ub-unfocus hover:bg-ub-focus"} ${props.rarity === "Gigantamax" && "bg-gmax-unfocus hover:bg-gmax-focus"}`}
    >
      <Image src={props.img} alt={props.name} width={80} height={80} />
      <div className="text-center font-semibold capitalize">
        {props.shiny && "🌟 "}
        {props.name}
      </div>
    </div>
  );
}

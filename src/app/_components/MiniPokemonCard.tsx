import { z } from "zod";
import { type ZodRarity } from "@/src/zod";
import Image from "next/image";

export default function MiniPokemonCard(props: {
  name: string;
  img: string;
  rarity: z.infer<typeof ZodRarity>;
}) {
  return (
    <div className="flex flex-col items-center gap-2 border-2 border-solid p-4">
      <Image src={props.img} alt={props.name} width={80} height={80} />
      <div className="font-semibold capitalize">{props.name}</div>
    </div>
  );
}

import Image from "next/image";
import { getRarityColor } from "~/lib/get-rarity-color";
import type { Rarity } from "~/lib/types";

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
				alt={props.name}
				className="pixelated"
				height={80}
				src={props.img}
				width={80}
			/>
			<div className="text-center font-semibold capitalize">
				{props.shiny && "🌟 "}
				{props.name}
			</div>
		</div>
	);
}

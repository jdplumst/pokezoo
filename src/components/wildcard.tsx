import type { Rarity } from "~/lib/types";

interface IWildcardProps {
	wildcard: Rarity;
	width: number;
	height: number;
}

export default function Wildcard({ wildcard, width, height }: IWildcardProps) {
	switch (wildcard) {
		case "Common":
			return (
				<img
					alt="common-wildcard"
					className="pixelated"
					height={height}
					src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/iron-plate.png"
					width={width}
				/>
			);
		case "Rare":
			return (
				<img
					alt="rare-wildcard"
					className="pixelated"
					height={height}
					src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/fist-plate.png"
					width={width}
				/>
			);
		case "Epic":
			return (
				<img
					alt="epic-wildcard"
					className="pixelated"
					height={height}
					src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/toxic-plate.png"
					width={width}
				/>
			);
		case "Legendary":
			return (
				<img
					alt="legendary-wildcard"
					className="pixelated"
					height={height}
					src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/meadow-plate.png"
					width={width}
				/>
			);
		default:
			// biome-ignore lint/complexity/noUselessFragments: address later
			return <></>;
	}
}

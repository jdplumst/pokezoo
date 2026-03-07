"use client";

import Image from "next/image";
import { type ReactNode, useState } from "react";
import { z } from "zod";
import { PokemonSheet } from "~/components/pokemon-sheet";
import { getRarityColor } from "~/lib/get-rarity-color";
import { ZodHabitat, ZodRarity, ZodRegion, ZodSpeciesType } from "~/lib/types";

export default function PokemonCard(props: {
	children: ReactNode;
	caught?: boolean;
	pokemon: {
		id: string;
		pokedexNumber: number;
		name: string;
		rarity: string;
		yield: number;
		img: string;
		sellPrice: number;
		shiny: boolean;
		typeOne: string;
		typeTwo: string | null;
		generation: number;
		habitat: string;
		region: string;
	};
}) {
	const [open, setOpen] = useState(false);

	const pokemonSchema = z.object({
		id: z.string(),
		pokedexNumber: z.number(),
		name: z.string(),
		rarity: ZodRarity,
		yield: z.number(),
		img: z.string(),
		sellPrice: z.number(),
		shiny: z.boolean(),
		typeOne: ZodSpeciesType,
		typeTwo: ZodSpeciesType.nullable(),
		generation: z.number(),
		habitat: ZodHabitat,
		region: ZodRegion,
	});
	const pokemon = pokemonSchema.safeParse(props.pokemon);
	if (pokemon.error) {
		return <div>Something went wrong.</div>;
	}

	return (
		<>
			{/** biome-ignore lint/a11y/noStaticElementInteractions: address later */}
			{/** biome-ignore lint/a11y/useKeyWithClickEvents: address later */}
			<div
				className={`relative w-80 rounded-2xl border-2 border-black border-solid p-4 shadow-xl hover:cursor-pointer ${getRarityColor(pokemon.data.rarity)}`}
				onClick={() => setOpen(true)}
			>
				{props.caught && (
					<Image
						alt="Caught"
						className="absolute top-0 left-0 z-10"
						height={40}
						src={
							"https://raw.githubusercontent.com/PokeAPI/sprites/refs/heads/master/sprites/items/poke-ball.png"
						}
						width={40}
					/>
				)}
				<div className="flex flex-col items-center gap-2">
					<Image
						alt={pokemon.data.name}
						className="pixelated"
						height={100}
						src={pokemon.data.img}
						width={100}
					/>
					<div className="font-lg font-semibold capitalize">
						{pokemon.data.shiny && "🌟"} {`#${pokemon.data.pokedexNumber}:`}{" "}
						{pokemon.data.name}
					</div>
					<div className="flex flex-col items-center gap-0">
						<div>Rarity: {pokemon.data.rarity}</div>
						<div>Yield: P{pokemon.data.yield.toLocaleString()}</div>
						<div>Sell Price: P{pokemon.data.sellPrice.toLocaleString()}</div>
					</div>
					{props.children}
				</div>
			</div>

			<PokemonSheet
				open={open}
				pokemon={pokemon.data}
				setOpen={setOpen}
				storage={false}
			/>
		</>
	);
}

"use client";

import Image from "next/image";
import { useState } from "react";
import { PokemonSheet } from "~/components/pokemon-sheet";
import type { getStorage } from "~/server/db/queries/storage";

export function StorageGrid(props: {
	pokemon: Awaited<ReturnType<typeof getStorage>>;
}) {
	const [selectedPokemon, setSelectedPokemon] = useState<
		(typeof props.pokemon)[0] | null
	>(null);

	const handleClose = () => {
		setSelectedPokemon(null);
	};

	return (
		<>
			<div className="relative z-10 grid grid-cols-6 gap-2 pb-4">
				{props.pokemon.map((p) => (
					// biome-ignore lint/a11y/noStaticElementInteractions: address later
					// biome-ignore lint/a11y/useKeyWithClickEvents: address later
					<div
						className={`cursor-pointer rounded-md bg-gray-800 bg-opacity-70 p-2 transition-all hover:bg-opacity-90 ${
							selectedPokemon?.id === p.id ? "ring-2 ring-yellow-400" : ""
						}`}
						key={p.id}
						onClick={() => setSelectedPokemon(p)}
					>
						<div className="flex justify-center">
							<Image
								alt={p.name}
								className="pixelated"
								height={64}
								src={p.img}
								width={64}
							/>
						</div>
						<p className="mt-1 truncate text-center text-white text-xs capitalize">
							{p.shiny && "🌟 "} {p.name}
						</p>
					</div>
				))}

				{/* Empty slots to fill the grid */}
				{Array.from({ length: 30 - props.pokemon.length }).map((_, index) => (
					<div
						className="h-[96px] rounded-md bg-gray-800 bg-opacity-50 p-2"
						key={`empty-${
							// biome-ignore lint/suspicious/noArrayIndexKey: address later
							index
						}`}
					></div>
				))}
			</div>
			{selectedPokemon && (
				<PokemonSheet
					open={selectedPokemon !== null}
					pokemon={selectedPokemon}
					setOpen={handleClose}
					storage={true}
				/>
			)}
		</>
	);
}

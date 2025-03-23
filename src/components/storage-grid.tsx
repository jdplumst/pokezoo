"use client";

import Image from "next/image";
import { useState } from "react";
import { PokemonSheet } from "~/components/pokemon-sheet";
import { type getStorage } from "~/server/db/queries/storage";

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
          <div
            key={p.id}
            className={`cursor-pointer rounded-md bg-gray-800 bg-opacity-70 p-2 transition-all hover:bg-opacity-90 ${
              selectedPokemon?.id === p.id ? "ring-2 ring-yellow-400" : ""
            }`}
            onClick={() => setSelectedPokemon(p)}
          >
            <div className="flex justify-center">
              <Image
                src={p.img}
                alt={p.name}
                width={64}
                height={64}
                className="pixelated"
              />
            </div>
            <p className="mt-1 truncate text-center text-xs capitalize text-white">
              {p.name}
            </p>
          </div>
        ))}

        {/* Empty slots to fill the grid */}
        {Array.from({ length: 30 - props.pokemon.length }).map((_, index) => (
          <div
            key={`empty-${index}`}
            className="h-[96px] rounded-md bg-gray-800 bg-opacity-50 p-2"
          ></div>
        ))}
      </div>
      {selectedPokemon && (
        <PokemonSheet
          open={selectedPokemon !== null}
          setOpen={handleClose}
          storage={true}
          pokemon={selectedPokemon}
        />
      )}
    </>
  );
}
